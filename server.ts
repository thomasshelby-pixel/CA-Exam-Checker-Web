import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db/database';
import { runCAnswerSheetEvaluation } from './server/services/geminiService';
import { checkEvaluationEligibility, deductEvaluationCredit, restoreEvaluationCredit } from './server/services/creditService';
import { createPaymentOrder, verifyAndCompletePayment } from './server/services/paymentService';
import { logAuditEvent } from './server/services/auditService';
import { User, UserRole, EvaluationReport, UploadedPage } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

// Generous payload limit for high-resolution multi-page CA answer sheet uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper: simulate or extract user authentication from header or default demo user
function getAuthUser(req: Request): User | null {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Token can be user ID or user email
    const byId = db.getUserById(token);
    if (byId) return byId;
    const byEmail = db.getUserByEmail(token);
    if (byEmail) return byEmail;
  }
  // Fallback to first student if no token provided in demo/dev mode
  const users = db.getUsers();
  return users.find((u) => u.role === 'STUDENT') || users[0] || null;
}

// -------------------------------------------------------------
// 1. HEALTH & METADATA APIS
// -------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'CA Exam Checker AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    aiStatus: process.env.GEMINI_API_KEY ? 'ACTIVE_GEMINI_KEY' : 'STANDALONE_EVALUATION_FALLBACK',
  });
});

app.get('/api/meta/academics', (req: Request, res: Response) => {
  const level = req.query.level as string | undefined;
  const subjects = db.getSubjects(level);
  const chapters = db.getChapters();
  const amendments = db.getAmendments();
  const questions = db.getQuestions();
  res.json({
    subjects,
    chapters,
    amendments,
    questions,
  });
});

// -------------------------------------------------------------
// 2. AUTHENTICATION & PROFILE APIS
// -------------------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password, role = 'STUDENT', caLevel, attempt, studentId, instituteId, instituteName } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile ? mobile.trim() : '',
      role: (role as UserRole) || 'STUDENT',
      caLevel: caLevel || 'CA_INTERMEDIATE',
      attempt: attempt || 'Nov 2026',
      studentId: studentId || '',
      instituteId: instituteId || undefined,
      instituteName: instituteName || undefined,
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: db.getSystemSettings().freeEvaluationsForStudents,
      purchasedCredits: 0,
      isPermanentFree: db.isEmailPermanentFree(email),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = db.createUser(newUser);

    logAuditEvent({
      actorId: created.id,
      actorEmail: created.email,
      actorRole: created.role,
      action: 'USER_REGISTERED',
      targetType: 'USER',
      targetId: created.id,
      details: `New account registered under role ${created.role} for ${created.caLevel || 'General'}`,
      ipAddress: req.ip,
    });

    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: created.id,
      title: 'Welcome to CA Exam Checker AI',
      message: `Your account is ready. You have ${created.isPermanentFree ? 'unlimited permanent free' : '2 free'} answer sheet evaluations available.`,
      type: 'SYSTEM',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ user: created, token: created.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = db.getUserByEmail(email);

    // If logging in with a predefined role or new email in preview
    if (!user) {
      const isVip = db.isEmailPermanentFree(email);
      user = db.createUser({
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: email.split('@')[0].toUpperCase(),
        email: email.trim().toLowerCase(),
        role: role || (email.includes('admin') ? 'ADMIN' : email.includes('institute') ? 'INSTITUTE_ADMIN' : 'STUDENT'),
        accountStatus: 'ACTIVE',
        freeEvaluationsUsed: 0,
        freeEvaluationsLimit: isVip ? 999999 : db.getSystemSettings().freeEvaluationsForStudents,
        purchasedCredits: isVip ? 9999 : 0,
        isPermanentFree: isVip,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Check if student account is blocked/suspended
    if (user.accountStatus === 'BLOCKED' || (user as any).accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        error: 'Your student account has been blocked/suspended by the administrator. Please contact academic support.',
      });
    }

    // Automatically detect and grant permanent free VIP for lifetime use
    if (db.isEmailPermanentFree(user.email)) {
      user.isPermanentFree = true;
      user.freeEvaluationsLimit = 999999;
      user.purchasedCredits = Math.max(user.purchasedCredits, 9999);
      db.updateUser(user.id, {
        isPermanentFree: true,
        freeEvaluationsLimit: 999999,
        purchasedCredits: user.purchasedCredits,
      });
    }

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'USER_LOGIN',
      targetType: 'SESSION',
      targetId: user.id,
      details: 'User logged in successfully',
      ipAddress: req.ip,
    });

    res.json({ user, token: user.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // Refresh VIP status
  if (db.isEmailPermanentFree(user.email) && !user.isPermanentFree) {
    user.isPermanentFree = true;
    db.updateUser(user.id, { isPermanentFree: true });
  }
  res.json({ user });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { name, mobile, caLevel, attempt, subjects } = req.body;
  const updated = db.updateUser(user.id, {
    name: name || user.name,
    mobile: mobile || user.mobile,
    caLevel: caLevel || user.caLevel,
    attempt: attempt || user.attempt,
    subjects: subjects || user.subjects,
  });
  res.json({ user: updated });
});

// -------------------------------------------------------------
// 3. EVALUATION & ANSWER SHEET APIS
// -------------------------------------------------------------
app.get('/api/evaluations/eligibility', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const eligibility = checkEvaluationEligibility(user.id);
  res.json(eligibility);
});

app.post('/api/evaluations/evaluate', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (user.accountStatus === 'BLOCKED' || (user as any).accountStatus === 'SUSPENDED') {
    return res.status(403).json({
      error: 'Your student account has been blocked/suspended by the administrator. Evaluations cannot be submitted.',
    });
  }

  const { subjectId, caLevel, attempt, pages = [] } = req.body;

  if (!subjectId) {
    return res.status(400).json({ error: 'Subject is required for evaluation.' });
  }

  if (!pages || pages.length === 0) {
    return res.status(400).json({ error: 'Please upload at least one answer sheet page.' });
  }

  // 1. Verify eligibility server-side
  const eligibility = checkEvaluationEligibility(user.id);
  if (!eligibility.canEvaluate) {
    return res.status(403).json({
      error: eligibility.reason,
      requiresPurchase: true,
    });
  }

  const subject = db.getSubjectById(subjectId);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found in database.' });
  }

  const reportId = `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // 2. Deduct credit or use free slot atomically
  let deductionResult;
  try {
    deductionResult = deductEvaluationCredit(user.id, reportId);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Credit deduction failed' });
  }

  try {
    const modelQuestions = db.getQuestions(subjectId);
    const applicableAmendments = db.getAmendments(subjectId);

    const report = await runCAnswerSheetEvaluation({
      reportId,
      userId: user.id,
      studentName: user.name,
      caLevel: caLevel || user.caLevel || 'CA_INTERMEDIATE',
      attempt: attempt || user.attempt || 'Nov 2026',
      subject,
      pages,
      modelQuestions,
      applicableAmendments,
    });

    report.source = deductionResult.source;
    if (user.instituteId) {
      report.instituteId = user.instituteId;
      report.instituteName = user.instituteName;
    }

    db.saveEvaluation(report);

    // Notify user
    db.addNotification({
      id: `notif-eval-${Date.now()}`,
      userId: user.id,
      title: 'Answer Sheet Evaluation Ready',
      message: `Your evaluation report for ${subject.name} has been finalized. Score: ${report.obtainedMarks}/${report.maxMarks} (${report.percentage}%).`,
      type: 'EVALUATION',
      read: false,
      linkUrl: `/evaluations/${report.id}`,
      createdAt: new Date().toISOString(),
    });

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'EVALUATION_COMPLETED',
      targetType: 'EVALUATION',
      targetId: report.id,
      details: `Evaluated ${pages.length} pages for ${subject.name}. Score: ${report.obtainedMarks}/${report.maxMarks} using ${deductionResult.source}.`,
      ipAddress: req.ip,
    });

    res.json({ report });
  } catch (evaluationError: any) {
    // Restore credit if evaluation failed!
    restoreEvaluationCredit(user.id, reportId, deductionResult.source, evaluationError.message || 'Evaluation processing failure');
    res.status(500).json({
      error: `Evaluation could not be completed: ${evaluationError.message || 'Processing error'}. Your credit/free trial balance has been safely restored without deduction.`,
    });
  }
});

app.get('/api/evaluations', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  let evaluations = db.getEvaluations(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? undefined : user.id);

  // Subject filter
  if (req.query.subjectId) {
    evaluations = evaluations.filter((e) => e.subjectId === req.query.subjectId);
  }
  // Level filter
  if (req.query.caLevel) {
    evaluations = evaluations.filter((e) => e.caLevel === req.query.caLevel);
  }

  res.json({ evaluations });
});

app.get('/api/evaluations/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const report = db.getEvaluationById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Evaluation report not found.' });
  }

  // Authorization check: only owner, associated institute, or admin can view
  if (
    report.userId !== user.id &&
    user.role !== 'ADMIN' &&
    user.role !== 'SUPER_ADMIN' &&
    (!user.instituteId || report.instituteId !== user.instituteId)
  ) {
    return res.status(403).json({ error: 'You are not authorized to view this evaluation report.' });
  }

  res.json({ report });
});

// -------------------------------------------------------------
// 4. CREDITS, LEDGER & PRICING APIS
// -------------------------------------------------------------
app.get('/api/credits/ledger', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const ledger = db.getCreditLedger(user.id);
  const eligibility = checkEvaluationEligibility(user.id);
  res.json({
    purchasedCredits: user.purchasedCredits || 0,
    freeEvaluationsUsed: user.freeEvaluationsUsed || 0,
    freeEvaluationsLimit: user.freeEvaluationsLimit || 2,
    isPermanentFree: db.isEmailPermanentFree(user.email) || user.isPermanentFree,
    eligibility,
    ledger,
  });
});

app.get('/api/pricing', (req: Request, res: Response) => {
  const plans = db.getPricingPlans();
  const settings = db.getSystemSettings();
  res.json({ plans, default10SheetsPriceINR: settings.default10SheetsPriceINR });
});

app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { planId } = req.body;
  try {
    const order = createPaymentOrder(user.id, planId);
    res.json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Order creation failed' });
  }
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { orderId, paymentId } = req.body;
  if (!orderId || !paymentId) {
    return res.status(400).json({ error: 'Order ID and Gateway Payment Reference required for server verification.' });
  }

  try {
    const result = verifyAndCompletePayment(orderId, paymentId);
    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'PAYMENT_VERIFIED',
      targetType: 'PAYMENT_ORDER',
      targetId: orderId,
      details: `Added ${result.creditsAdded} credits for ₹${result.order.amountINR}. Gateway reference: ${paymentId}`,
      ipAddress: req.ip,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Verification failed' });
  }
});

// -------------------------------------------------------------
// 5. INSTITUTE PORTAL APIS
// -------------------------------------------------------------
app.get('/api/institute/dashboard', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'INSTITUTE_ADMIN' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Institute admin authorization required.' });
  }

  const instId = user.instituteId || 'inst-1';
  const institute = db.getInstituteById(instId);
  const batches = db.getBatches(instId);
  const assignments = db.getAssignments(instId);
  const tests = db.getTests(instId);
  const students = db.getUsers().filter((u) => u.instituteId === instId);
  const evaluations = db.getEvaluations().filter((e) => e.instituteId === instId);

  const avgScore =
    evaluations.length > 0
      ? Number((evaluations.reduce((acc, curr) => acc + curr.percentage, 0) / evaluations.length).toFixed(1))
      : 0;

  res.json({
    institute,
    studentsCount: students.length,
    evaluationsCount: evaluations.length,
    batchesCount: batches.length,
    assignmentsCount: assignments.length,
    testsCount: tests.length,
    averageScore: avgScore,
    batches,
    assignments,
    tests,
    recentEvaluations: evaluations.slice(0, 5),
  });
});

app.get('/api/institute/students', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const instId = user?.instituteId || 'inst-1';
  const students = db.getUsers().filter((u) => u.instituteId === instId);
  res.json({ students });
});

app.post('/api/institute/students/add', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'INSTITUTE_ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { name, email, caLevel, batchId } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  let student = db.getUserByEmail(email);
  if (student) {
    // Link existing student to institute
    db.updateUser(student.id, {
      instituteId: user.instituteId,
      instituteName: user.instituteName,
    });
  } else {
    // Create student
    student = db.createUser({
      id: `usr-stu-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      role: 'STUDENT',
      caLevel: caLevel || 'CA_INTERMEDIATE',
      instituteId: user.instituteId,
      instituteName: user.instituteName,
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: 2,
      purchasedCredits: 0,
      isPermanentFree: db.isEmailPermanentFree(email),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  if (batchId && user.instituteId) {
    const batches = db.getBatches(user.instituteId);
    const batch = batches.find((b) => b.id === batchId);
    if (batch && !batch.studentIds.includes(student.id)) {
      batch.studentIds.push(student.id);
      db.saveBatch(batch);
    }
  }

  res.json({ success: true, student });
});

app.post('/api/institute/batches', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'INSTITUTE_ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { name, caLevel, attempt } = req.body;
  const batch = db.saveBatch({
    id: `batch-${Date.now()}`,
    instituteId: user.instituteId || 'inst-1',
    name,
    caLevel: caLevel || 'CA_INTERMEDIATE',
    attempt: attempt || 'Nov 2026',
    studentIds: [],
    createdAt: new Date().toISOString(),
  });
  res.json({ batch });
});

app.post('/api/institute/assignments', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'INSTITUTE_ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { batchId, batchName, title, subjectId, subjectName, maxMarks, deadline, instructions } = req.body;
  const assignment = db.saveAssignment({
    id: `asg-${Date.now()}`,
    instituteId: user.instituteId || 'inst-1',
    batchId,
    batchName,
    title,
    subjectId,
    subjectName,
    maxMarks: Number(maxMarks) || 20,
    deadline,
    instructions,
    totalSubmissions: 0,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  });
  res.json({ assignment });
});

app.post('/api/institute/tests', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'INSTITUTE_ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { batchId, batchName, title, subjectId, subjectName, durationMinutes, maxMarks, questionsCount, mcqCount, startDate, endDate, allowNegativeMarking = false } = req.body;
  const test = db.saveTest({
    id: `test-${Date.now()}`,
    instituteId: user.instituteId || 'inst-1',
    batchId,
    batchName,
    title,
    subjectId,
    subjectName,
    durationMinutes: Number(durationMinutes) || 90,
    maxMarks: Number(maxMarks) || 50,
    allowNegativeMarking: Boolean(allowNegativeMarking), // Default false for CA Exams
    questionsCount: Number(questionsCount) || 5,
    mcqCount: Number(mcqCount) || 10,
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  });
  res.json({ test });
});

// -------------------------------------------------------------
// 6. ADMIN & SUPER ADMIN APIS
// -------------------------------------------------------------

// Protect Admin Portal with Master Password = BgMi@2006
app.post('/api/admin/verify-passcode', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (passcode === 'BgMi@2006') {
    let adminUser = db.getUsers().find((u) => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN');
    if (!adminUser) {
      adminUser = db.createUser({
        id: 'usr-admin-master',
        name: 'Administrator',
        email: 'admin@caexamchecker.ai',
        role: 'SUPER_ADMIN',
        accountStatus: 'ACTIVE',
        freeEvaluationsUsed: 0,
        freeEvaluationsLimit: 999999,
        purchasedCredits: 999999,
        isPermanentFree: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    logAuditEvent({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      actorRole: adminUser.role,
      action: 'ADMIN_MASTER_PASSWORD_AUTHENTICATED',
      targetType: 'SYSTEM',
      targetId: 'ADMIN_PORTAL',
      details: 'Master password entered successfully for Administrator Portal',
      ipAddress: req.ip,
    });

    return res.json({ verified: true, user: adminUser, token: adminUser.id });
  }

  return res.status(401).json({ error: 'Incorrect Administrator Master Password.' });
});

app.get('/api/admin/dashboard', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }

  const users = db.getUsers();
  const students = users.filter((u) => u.role === 'STUDENT');
  const institutes = db.getInstitutes();
  const admins = users.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
  const evaluations = db.getEvaluations();
  
  // Successful vs Failed evaluation breakdown
  const successfulEvaluations = evaluations.filter((e) => e.stage === 'COMPLETED').length;
  const failedEvaluations = evaluations.filter((e) => e.stage === 'FAILED').length;
  const inProgressEvaluations = evaluations.filter((e) => e.stage !== 'COMPLETED' && e.stage !== 'FAILED').length;
  const successRate = evaluations.length > 0 
    ? Math.round((successfulEvaluations / Math.max(1, successfulEvaluations + failedEvaluations)) * 100) 
    : 100;

  const orders = db.getOrders();
  const successfulOrders = orders.filter((o) => o.status === 'SUCCESS');
  const totalRevenue = successfulOrders.reduce((acc, curr) => acc + curr.amountINR, 0);
  const permanentFree = db.getPermanentFreeEntries();
  const auditLogs = db.getAuditLogs().slice(0, 15);

  res.json({
    totalUsers: users.length,
    totalAccountsCreated: users.length,
    totalStudents: students.length,
    totalInstitutes: institutes.length,
    totalAdmins: admins.length,
    totalEvaluations: evaluations.length,
    successfulEvaluations,
    failedEvaluations,
    inProgressEvaluations,
    successRate,
    totalRevenue,
    paidOrdersCount: successfulOrders.length,
    permanentFreeCount: permanentFree.filter((p) => p.active).length,
    recentEvaluations: evaluations.slice(0, 10),
    recentAuditLogs: auditLogs,
  });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  res.json({ users: db.getUsers() });
});

app.put('/api/admin/users/:id/status', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  const targetId = req.params.id;
  const targetUser = db.getUserById(targetId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { status } = req.body;
  if (status !== 'ACTIVE' && status !== 'BLOCKED') {
    return res.status(400).json({ error: "Invalid status. Must be 'ACTIVE' or 'BLOCKED'." });
  }

  const updated = db.updateUser(targetId, { accountStatus: status });

  logAuditEvent({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: status === 'BLOCKED' ? 'STUDENT_BLOCKED_BY_ADMIN' : 'STUDENT_UNBLOCKED_BY_ADMIN',
    targetType: 'USER',
    targetId,
    details: `Admin changed student account status to ${status} for ${targetUser.name} (${targetUser.email})`,
    ipAddress: req.ip,
  });

  res.json({ success: true, user: updated, message: `Account status updated to ${status}.` });
});

app.put('/api/admin/users/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  const targetId = req.params.id;
  const updates = req.body;

  const updated = db.updateUser(targetId, updates);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  logAuditEvent({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'USER_UPDATED_BY_ADMIN',
    targetType: 'USER',
    targetId,
    details: `Updated fields: ${Object.keys(updates).join(', ')}`,
    ipAddress: req.ip,
  });

  res.json({ user: updated });
});

app.delete('/api/admin/users/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator privileges required to delete accounts.' });
  }
  const targetId = req.params.id;
  const targetUser = db.getUserById(targetId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // STRICT RULE: Only normal student IDs can be deleted!
  if (targetUser.role !== 'STUDENT') {
    return res.status(403).json({
      error: 'Security Policy: Only normal student accounts can be deleted. Administrator and Institute accounts cannot be deleted.',
    });
  }

  db.deleteUser(targetId);

  logAuditEvent({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'NORMAL_STUDENT_DELETED_BY_ADMIN',
    targetType: 'USER',
    targetId,
    details: `Permanently removed normal student ${targetUser.name} (${targetUser.email})`,
    ipAddress: req.ip,
  });

  res.json({ success: true, message: `Student account for ${targetUser.name} (${targetUser.email}) deleted successfully.` });
});

// Permanent Free Access Management
app.get('/api/admin/permanent-free', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  res.json({ entries: db.getPermanentFreeEntries() });
});

app.post('/api/admin/permanent-free', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  const { email, reason } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const entry = db.addPermanentFreeEntry(email, user.email, reason || 'Granted by Admin Portal');

  logAuditEvent({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'PERMANENT_FREE_GRANTED',
    targetType: 'PERMANENT_FREE',
    targetId: email,
    details: `Added ${email} to permanent free access list. Reason: ${reason || 'Admin policy'}`,
    ipAddress: req.ip,
  });

  res.json({ success: true, entry });
});

app.delete('/api/admin/permanent-free/:email', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }
  const email = decodeURIComponent(req.params.email);
  const success = db.removePermanentFreeEntry(email);

  logAuditEvent({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'PERMANENT_FREE_REVOKED',
    targetType: 'PERMANENT_FREE',
    targetId: email,
    details: `Revoked permanent free access from ${email}.`,
    ipAddress: req.ip,
  });

  res.json({ success });
});

// Admin Academic Management
app.post('/api/admin/subjects', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const subject = db.saveSubject({
    id: req.body.id || `sub-${Date.now()}`,
    code: req.body.code,
    name: req.body.name,
    level: req.body.level,
    paperNumber: Number(req.body.paperNumber) || 1,
    chaptersCount: Number(req.body.chaptersCount) || 10,
    totalMarks: Number(req.body.totalMarks) || 100,
    syllabusYear: req.body.syllabusYear || '2026',
  });
  res.json({ subject });
});

app.post('/api/admin/amendments', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const amendment = db.saveAmendment({
    id: req.body.id || `amend-${Date.now()}`,
    subjectId: req.body.subjectId,
    title: req.body.title,
    applicableAttempt: req.body.applicableAttempt || 'Nov 2026',
    effectiveDate: req.body.effectiveDate || new Date().toISOString().split('T')[0],
    summary: req.body.summary,
    statutoryReference: req.body.statutoryReference,
  });
  res.json({ amendment });
});

app.post('/api/admin/questions', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const question = db.saveQuestion({
    id: req.body.id || `q-${Date.now()}`,
    subjectId: req.body.subjectId,
    paperCode: req.body.paperCode,
    attempt: req.body.attempt || 'Nov 2026',
    questionNumber: req.body.questionNumber,
    subQuestion: req.body.subQuestion,
    type: req.body.type || 'PRACTICAL',
    maxMarks: Number(req.body.maxMarks) || 5,
    text: req.body.text,
    modelAnswer: req.body.modelAnswer,
    markingScheme: req.body.markingScheme || [],
  });
  res.json({ question });
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.json({ logs: db.getAuditLogs() });
});

// -------------------------------------------------------------
// 7. NOTIFICATIONS & SUPPORT APIS
// -------------------------------------------------------------
app.get('/api/notifications', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const notifications = db.getNotifications(user.id);
  res.json({ notifications });
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

app.get('/api/support/tickets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const tickets = db.getSupportTickets(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? undefined : user.id);
  res.json({ tickets });
});

app.post('/api/support/tickets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { name, email, subject, message, evaluationId } = req.body;

  const ticket = db.saveSupportTicket({
    id: `tkt-${Date.now()}`,
    ticketNumber: `TKT-${Date.now().toString().slice(-6)}`,
    userId: user?.id,
    userName: name || user?.name || 'Student',
    userEmail: email || user?.email || 'student@example.com',
    subject,
    message,
    evaluationId,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  res.status(201).json({ ticket });
});

app.put('/api/admin/support/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const { status, adminReply } = req.body;
  const tickets = db.getSupportTickets();
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  ticket.status = status || ticket.status;
  if (adminReply) {
    ticket.adminReply = adminReply;
  }
  ticket.updatedAt = new Date().toISOString();
  db.saveSupportTicket(ticket);

  res.json({ ticket });
});

// -------------------------------------------------------------
// 8. VITE MIDDLEWARE & SPA HANDLING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CA Exam Checker AI] Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
