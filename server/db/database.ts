import fs from 'fs';
import path from 'path';
import {
  User,
  Subject,
  Chapter,
  Amendment,
  QuestionModel,
  EvaluationReport,
  CreditLedgerEntry,
  PricingPlan,
  PaymentOrder,
  Institute,
  Batch,
  Assignment,
  InstituteTest,
  NotificationItem,
  SupportTicket,
  AuditLog,
  PermanentFreeEntry,
  SystemSettings,
} from '../../src/types';

interface DatabaseSchema {
  users: User[];
  subjects: Subject[];
  chapters: Chapter[];
  amendments: Amendment[];
  questions: QuestionModel[];
  evaluations: EvaluationReport[];
  creditLedger: CreditLedgerEntry[];
  pricingPlans: PricingPlan[];
  orders: PaymentOrder[];
  institutes: Institute[];
  batches: Batch[];
  assignments: Assignment[];
  tests: InstituteTest[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  permanentFreeEntries: PermanentFreeEntry[];
  systemSettings: SystemSettings;
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialDatabase(): DatabaseSchema {
  const permanentFreeEntries: PermanentFreeEntry[] = [
    {
      email: 'adityakumart484@gmail.com',
      grantedBy: 'SYSTEM_BOOTSTRAP',
      grantedAt: new Date().toISOString(),
      reason: 'Mandated Permanent Free VIP Account',
      active: true,
    },
    {
      email: 'Manug8158@gmail.com',
      grantedBy: 'SYSTEM_BOOTSTRAP',
      grantedAt: new Date().toISOString(),
      reason: 'Mandated Permanent Free VIP Account',
      active: true,
    },
  ];

  const systemSettings: SystemSettings = {
    freeEvaluationsForStudents: 2,
    default10SheetsPriceINR: 100,
    mcqNegativeMarkingDefault: false,
    allowInstituteRegistrations: true,
    aiModel: 'gemini-3.8-flash',
    maintenanceMode: false,
  };

  const users: User[] = [
    {
      id: 'usr-student-vip-1',
      name: 'Aditya Kumar',
      email: 'adityakumart484@gmail.com',
      mobile: '+91 98765 43210',
      role: 'STUDENT',
      caLevel: 'CA_FINAL',
      attempt: 'Nov 2026',
      subjects: ['sub-final-1', 'sub-final-2', 'sub-final-3'],
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: 999999,
      purchasedCredits: 9999,
      isPermanentFree: true,
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'usr-student-vip-2',
      name: 'Manu G',
      email: 'Manug8158@gmail.com',
      mobile: '+91 98765 12345',
      role: 'STUDENT',
      caLevel: 'CA_INTERMEDIATE',
      attempt: 'Nov 2026',
      subjects: ['sub-inter-1', 'sub-inter-2'],
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: 999999,
      purchasedCredits: 9999,
      isPermanentFree: true,
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'usr-student-demo',
      name: 'Rohan Sharma',
      email: 'student@example.com',
      mobile: '+91 98111 22334',
      role: 'STUDENT',
      caLevel: 'CA_INTERMEDIATE',
      attempt: 'Nov 2026',
      subjects: ['sub-inter-1', 'sub-inter-2', 'sub-inter-3'],
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: 2,
      purchasedCredits: 0,
      isPermanentFree: false,
      instituteId: 'inst-1',
      instituteName: 'Rankers CA Academy',
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'usr-inst-admin',
      name: 'Prof. S. K. Agarwal',
      email: 'institute@example.com',
      mobile: '+91 98222 33445',
      role: 'INSTITUTE_ADMIN',
      instituteId: 'inst-1',
      instituteName: 'Rankers CA Academy',
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: 100,
      purchasedCredits: 500,
      isPermanentFree: false,
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'usr-admin-1',
      name: 'CA Admin Controller',
      email: 'admin@example.com',
      mobile: '+91 98333 44556',
      role: 'SUPER_ADMIN',
      accountStatus: 'ACTIVE',
      freeEvaluationsUsed: 0,
      freeEvaluationsLimit: 999999,
      purchasedCredits: 9999,
      isPermanentFree: true,
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
    },
  ];

  const subjects: Subject[] = [
    // Foundation
    { id: 'sub-fnd-1', code: 'FND-P1', name: 'Accounting', level: 'CA_FOUNDATION', paperNumber: 1, chaptersCount: 10, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-fnd-2', code: 'FND-P2', name: 'Business Laws', level: 'CA_FOUNDATION', paperNumber: 2, chaptersCount: 7, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-fnd-3', code: 'FND-P3', name: 'Quantitative Aptitude', level: 'CA_FOUNDATION', paperNumber: 3, chaptersCount: 8, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-fnd-4', code: 'FND-P4', name: 'Business Economics', level: 'CA_FOUNDATION', paperNumber: 4, chaptersCount: 6, totalMarks: 100, syllabusYear: '2026' },

    // Intermediate
    { id: 'sub-inter-1', code: 'INT-P1', name: 'Advanced Accounting', level: 'CA_INTERMEDIATE', paperNumber: 1, chaptersCount: 15, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-inter-2', code: 'INT-P2', name: 'Corporate & Other Laws', level: 'CA_INTERMEDIATE', paperNumber: 2, chaptersCount: 11, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-inter-3', code: 'INT-P3', name: 'Taxation (Income Tax & GST)', level: 'CA_INTERMEDIATE', paperNumber: 3, chaptersCount: 16, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-inter-4', code: 'INT-P4', name: 'Cost & Management Accounting', level: 'CA_INTERMEDIATE', paperNumber: 4, chaptersCount: 14, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-inter-5', code: 'INT-P5', name: 'Auditing and Ethics', level: 'CA_INTERMEDIATE', paperNumber: 5, chaptersCount: 11, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-inter-6', code: 'INT-P6', name: 'Financial Management & Strategic Management', level: 'CA_INTERMEDIATE', paperNumber: 6, chaptersCount: 12, totalMarks: 100, syllabusYear: '2026' },

    // Final
    { id: 'sub-final-1', code: 'FIN-P1', name: 'Financial Reporting (Ind AS)', level: 'CA_FINAL', paperNumber: 1, chaptersCount: 18, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-final-2', code: 'FIN-P2', name: 'Advanced Financial Management', level: 'CA_FINAL', paperNumber: 2, chaptersCount: 14, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-final-3', code: 'FIN-P3', name: 'Advanced Auditing, Assurance & Professional Ethics', level: 'CA_FINAL', paperNumber: 3, chaptersCount: 19, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-final-4', code: 'FIN-P4', name: 'Direct Tax Laws & International Taxation', level: 'CA_FINAL', paperNumber: 4, chaptersCount: 22, totalMarks: 100, syllabusYear: '2026' },
    { id: 'sub-final-5', code: 'FIN-P5', name: 'Indirect Tax Laws (GST & Customs)', level: 'CA_FINAL', paperNumber: 5, chaptersCount: 20, totalMarks: 100, syllabusYear: '2026' },
  ];

  const chapters: Chapter[] = [
    { id: 'ch-inter-1', subjectId: 'sub-inter-1', chapterNumber: 1, title: 'Applicability of Accounting Standards & AS-1, AS-2, AS-3', topics: ['Disclosure of Policies', 'Inventory Valuation', 'Cash Flow Statements'] },
    { id: 'ch-inter-2', subjectId: 'sub-inter-1', chapterNumber: 2, title: 'Financial Statements of Companies (Schedule III)', topics: ['Balance Sheet Format', 'Profit and Loss', 'Contingent Liabilities'] },
    { id: 'ch-inter-3', subjectId: 'sub-inter-3', chapterNumber: 1, title: 'Basic Concepts of Income Tax & Residential Status', topics: ['Scope of Total Income', 'Sec 6(1) Conditions', 'RNOR Rules'] },
    { id: 'ch-inter-4', subjectId: 'sub-inter-3', chapterNumber: 2, title: 'Heads of Income - Profits & Gains of Business or Profession', topics: ['Sec 32 Depreciation', 'Sec 40(a)(ia) TDS Disallowance', 'Sec 43B Actual Payment'] },
    { id: 'ch-inter-5', subjectId: 'sub-inter-5', chapterNumber: 1, title: 'Nature, Objective and Scope of Audit (SA 200 series)', topics: ['SA 200 Overall Objectives', 'SA 210 Agreeing Terms', 'Professional Skepticism'] },
    { id: 'ch-final-1', subjectId: 'sub-final-1', chapterNumber: 1, title: 'Ind AS 115 - Revenue from Contracts with Customers', topics: ['5-Step Model', 'Performance Obligations', 'Variable Consideration', 'Principal vs Agent'] },
    { id: 'ch-final-2', subjectId: 'sub-final-1', chapterNumber: 2, title: 'Ind AS 116 - Leases', topics: ['ROU Asset Measurement', 'Lease Liability', 'Discount Rate Selection'] },
  ];

  const amendments: Amendment[] = [
    {
      id: 'amend-1',
      subjectId: 'sub-inter-3',
      title: 'Finance Act 2025/2026 Revisions for AY 2026-27',
      applicableAttempt: 'Nov 2026',
      effectiveDate: '2026-04-01',
      summary: 'New Default Tax Regime Section 115BAC rebate slabs revised up to ₹7,75,000. Standard deduction enhanced to ₹75,000 for salaried employees.',
      statutoryReference: 'Income Tax Act 1961, Section 115BAC & 87A',
    },
    {
      id: 'amend-2',
      subjectId: 'sub-inter-2',
      title: 'Companies (Amendment) Rules 2026 on Audit Trail',
      applicableAttempt: 'Nov 2026',
      effectiveDate: '2026-01-01',
      summary: 'Mandatory statutory auditor reporting on accounting software audit trail logs preservation throughout the financial year without tampering.',
      statutoryReference: 'Section 143(3) of Companies Act 2013 & Rule 11(g)',
    },
  ];

  const questions: QuestionModel[] = [
    {
      id: 'q-demo-1',
      subjectId: 'sub-inter-1',
      paperCode: 'INT-P1',
      attempt: 'Nov 2026',
      questionNumber: '1',
      subQuestion: 'a',
      type: 'PRACTICAL',
      maxMarks: 5,
      text: 'X Ltd. purchased machinery on 01.04.2023 for ₹20,00,000. Government grant of ₹4,00,000 was received towards acquisition. The company credited grant to P&L account immediately. Explain whether accounting treatment is in accordance with AS 12 and pass revised journal entries.',
      modelAnswer: 'According to AS 12 "Accounting for Government Grants", grants related to specific fixed assets should either: Method 1 (Deduction Method): Deducted from gross value of asset; Method 2 (Deferred Income Method): Treated as deferred income and recognized in P&L over useful life. Crediting entire ₹4,00,000 to P&L in Year 1 violates AS 12.',
      markingScheme: [
        { step: 'Identification of AS 12 principles', marks: 1.5, criteria: 'Mentions AS 12 and two allowable presentation methods' },
        { step: 'Analysis of X Ltd treatment', marks: 1.5, criteria: 'Points out that direct credit of full grant to current year P&L is incorrect' },
        { step: 'Rectification entry & balance sheet impact', marks: 2.0, criteria: 'Passes correct rectification entry adjusting deferred income or asset account' },
      ],
      keyProvisionsOrStandards: ['AS 12 Government Grants', 'Para 14 & Para 15'],
    },
    {
      id: 'q-demo-2',
      subjectId: 'sub-inter-3',
      paperCode: 'INT-P3',
      attempt: 'Nov 2026',
      questionNumber: '1',
      subQuestion: 'b',
      type: 'PRACTICAL',
      maxMarks: 5,
      text: 'Mr. Rajesh, a resident individual aged 42 years, paid health insurance premium of ₹28,000 by cheque for himself and wife. He also paid ₹32,000 for father aged 66 years (resident senior citizen). Compute deduction under section 80D.',
      modelAnswer: 'Deduction u/s 80D: (i) Self and spouse: Maximum ₹25,000 (actual ₹28,000 capped at ₹25,000). (ii) Parents (senior citizen resident): Maximum ₹50,000 (actual ₹32,000 allowed in full). Total deduction = ₹25,000 + ₹32,000 = ₹57,000.',
      markingScheme: [
        { step: 'Self & spouse limit analysis', marks: 2.0, criteria: 'Correctly applies ₹25,000 cap u/s 80D(2)(a)' },
        { step: 'Senior citizen parents limit analysis', marks: 2.0, criteria: 'Applies ₹50,000 senior citizen threshold u/s 80D(2)(b) and allows ₹32,000' },
        { step: 'Total deduction figure', marks: 1.0, criteria: 'Arrives at ₹57,000' },
      ],
      keyProvisionsOrStandards: ['Income Tax Act Section 80D'],
    },
    {
      id: 'q-demo-3',
      subjectId: 'sub-inter-5',
      paperCode: 'INT-P5',
      attempt: 'Nov 2026',
      questionNumber: '2',
      subQuestion: 'a',
      type: 'DESCRIPTIVE',
      maxMarks: 4,
      text: 'Explain the auditor responsibility regarding subsequent events between the date of financial statements and the date of auditor report as per SA 560.',
      modelAnswer: 'Under SA 560 "Subsequent Events", the auditor shall perform audit procedures designed to obtain sufficient appropriate audit evidence that all events occurring between the date of the financial statements and the date of the auditor report that require adjustment of, or disclosure in, the financial statements have been identified. Procedures include inquiring management, reading minutes, reviewing latest interim financial statements.',
      markingScheme: [
        { step: 'Statement of SA 560 objective', marks: 1.5, criteria: 'Identifies duty to detect adjusting and non-adjusting events up to report date' },
        { step: 'Required audit procedures', marks: 2.5, criteria: 'Inquiries, reading minutes, reviewing post balance sheet cash and trial balances' },
      ],
      keyProvisionsOrStandards: ['SA 560 Subsequent Events'],
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      id: 'plan-basic-10',
      name: 'Standard Evaluation Pack',
      evaluationsCount: 10,
      priceINR: 100,
      popular: true,
      features: [
        '10 Full Answer Sheet Evaluations',
        'Question-wise Marks & Step Scoring',
        'Examiner-Style Detailed Feedback',
        'Working Notes & Presentation Analysis',
        'AS / Ind AS / SA Provisions Audit',
        'PDF Exportable Evaluation Reports',
        'No Expiry on Credits',
      ],
    },
    {
      id: 'plan-pro-25',
      name: 'Single Group Booster',
      evaluationsCount: 25,
      priceINR: 230,
      discountPercentage: 8,
      features: [
        '25 Full Answer Sheet Evaluations',
        'All Standard Pack Features',
        'Priority AI Processing Queue',
        'Topic-wise Weakness Heatmap',
        'MCQ & Descriptive Combined Grading',
        'Historical Score Improvement Tracking',
        'No Expiry on Credits',
      ],
    },
    {
      id: 'plan-both-50',
      name: 'Both Groups Comprehensive',
      evaluationsCount: 50,
      priceINR: 420,
      discountPercentage: 16,
      features: [
        '50 Full Answer Sheet Evaluations',
        'Covers Full Test Series Across Papers',
        'Detailed Suggested Improvement Routines',
        'Dedicated Support Ticket Priority',
        'Shareable Reports with Mentors',
        'No Expiry on Credits',
      ],
    },
  ];

  const institutes: Institute[] = [
    {
      id: 'inst-1',
      name: 'Rankers CA Academy',
      code: 'RCA-2026',
      email: 'admin@rankersca.com',
      phone: '+91 98222 33445',
      address: 'Laxmi Road, Sadashiv Peth, Pune, Maharashtra 411030',
      website: 'https://rankerscaacademy.example.com',
      contactPerson: 'Prof. S. K. Agarwal (FCA)',
      description: 'Premier coaching institute for CA Intermediate & Final students since 2012.',
      status: 'ACTIVE',
      sponsoredCreditsPool: 500,
      sponsoredCreditsUsed: 64,
      subscriptionPlan: 'Enterprise Tier',
      subscriptionExpiresAt: '2026-12-31T23:59:59Z',
      allowAssignments: true,
      allowTests: true,
      totalStudents: 142,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'inst-2',
      name: 'Apex School of Chartered Accountancy',
      code: 'APEX-DELHI',
      email: 'info@apexca.edu',
      phone: '+91 98111 88776',
      address: 'Pari Chowk, Laxmi Nagar, New Delhi 110092',
      website: 'https://apexca.edu',
      contactPerson: 'CA Meera Bansal',
      description: 'Specialized coaching center focusing on direct taxation and financial reporting.',
      status: 'ACTIVE',
      sponsoredCreditsPool: 300,
      sponsoredCreditsUsed: 21,
      subscriptionPlan: 'Standard Academy',
      subscriptionExpiresAt: '2026-11-30T23:59:59Z',
      allowAssignments: true,
      allowTests: true,
      totalStudents: 85,
      createdAt: '2026-01-15T00:00:00Z',
    },
  ];

  const batches: Batch[] = [
    {
      id: 'batch-inter-regular',
      instituteId: 'inst-1',
      name: 'Nov 2026 Inter Regular Batch A',
      caLevel: 'CA_INTERMEDIATE',
      attempt: 'Nov 2026',
      studentIds: ['usr-student-demo'],
      createdAt: '2026-01-20T00:00:00Z',
    },
    {
      id: 'batch-final-fasttrack',
      instituteId: 'inst-1',
      name: 'Nov 2026 Final Fast-Track Batch',
      caLevel: 'CA_FINAL',
      attempt: 'Nov 2026',
      studentIds: [],
      createdAt: '2026-01-25T00:00:00Z',
    },
  ];

  const assignments: Assignment[] = [
    {
      id: 'asg-1',
      instituteId: 'inst-1',
      batchId: 'batch-inter-regular',
      batchName: 'Nov 2026 Inter Regular Batch A',
      title: 'Advanced Accounting - Schedule III & AS 12 Test Submission',
      subjectId: 'sub-inter-1',
      subjectName: 'Advanced Accounting',
      maxMarks: 20,
      deadline: '2026-10-15T23:59:59Z',
      instructions: 'Solve Question 1 to 4 on official ICAI-ruled papers. Show full working notes for deferred grants and depreciation schedules.',
      totalSubmissions: 18,
      status: 'ACTIVE',
      createdAt: '2026-02-10T10:00:00Z',
    },
  ];

  const tests: InstituteTest[] = [
    {
      id: 'test-1',
      instituteId: 'inst-1',
      batchId: 'batch-inter-regular',
      batchName: 'Nov 2026 Inter Regular Batch A',
      title: 'Auditing Unit Test 1: SA 200 to SA 299 Series',
      subjectId: 'sub-inter-5',
      subjectName: 'Auditing and Ethics',
      durationMinutes: 90,
      maxMarks: 50,
      allowNegativeMarking: false,
      questionsCount: 6,
      mcqCount: 10,
      startDate: '2026-10-01T10:00:00Z',
      endDate: '2026-10-02T18:00:00Z',
      createdAt: '2026-02-15T12:00:00Z',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId: 'usr-student-vip-1',
      title: 'Permanent Free VIP Access Active',
      message: 'Your account (adityakumart484@gmail.com) has lifetime permanent free evaluation privileges enabled by administrator policy.',
      type: 'SYSTEM',
      read: false,
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'notif-2',
      userId: 'usr-student-vip-2',
      title: 'Permanent Free VIP Access Active',
      message: 'Your account (Manug8158@gmail.com) has lifetime permanent free evaluation privileges enabled by administrator policy.',
      type: 'SYSTEM',
      read: false,
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'notif-3',
      userId: 'usr-student-demo',
      title: 'Welcome to CA Exam Checker AI',
      message: 'You have 2 free evaluations remaining. Upload any CA Foundation, Inter, or Final handwritten answer sheet to receive comprehensive examiner feedback.',
      type: 'SYSTEM',
      read: false,
      createdAt: '2026-02-01T10:00:00Z',
    },
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'tkt-1',
      ticketNumber: 'TKT-2026-001',
      userId: 'usr-student-demo',
      userName: 'Rohan Sharma',
      userEmail: 'student@example.com',
      subject: 'Inquiry regarding Advanced Accounting AS 12 marking step',
      message: 'Could you please clarify if alternative accounting presentations under AS 12 (deduction method vs deferred income) receive equal weightage?',
      status: 'RESOLVED',
      adminReply: 'Yes! Our AI evaluation engine awards full marks for both Method 1 (gross asset deduction) and Method 2 (deferred income credit over useful life) as prescribed by AS 12.',
      createdAt: '2026-02-05T14:30:00Z',
      updatedAt: '2026-02-05T16:00:00Z',
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      actorId: 'system',
      actorEmail: 'system@caexamchecker.internal',
      actorRole: 'SUPER_ADMIN',
      action: 'SYSTEM_BOOTSTRAP',
      targetType: 'SYSTEM',
      targetId: 'ca-exam-checker-ai',
      details: 'System initialized with permanent free access list and official CA syllabus models.',
      timestamp: '2026-01-01T00:00:00Z',
    },
    {
      id: 'log-2',
      actorId: 'usr-admin-1',
      actorEmail: 'admin@example.com',
      actorRole: 'SUPER_ADMIN',
      action: 'PERMANENT_FREE_INITIALIZED',
      targetType: 'PERMANENT_FREE',
      targetId: 'adityakumart484@gmail.com',
      details: 'Granted permanent free evaluation privileges per system mandate.',
      timestamp: '2026-01-10T10:00:00Z',
    },
    {
      id: 'log-3',
      actorId: 'usr-admin-1',
      actorEmail: 'admin@example.com',
      actorRole: 'SUPER_ADMIN',
      action: 'PERMANENT_FREE_INITIALIZED',
      targetType: 'PERMANENT_FREE',
      targetId: 'Manug8158@gmail.com',
      details: 'Granted permanent free evaluation privileges per system mandate.',
      timestamp: '2026-01-10T10:00:00Z',
    },
  ];

  const evaluations: EvaluationReport[] = [
    {
      id: 'eval-sample-1',
      userId: 'usr-student-demo',
      studentName: 'Rohan Sharma',
      caLevel: 'CA_INTERMEDIATE',
      attempt: 'Nov 2026',
      subjectId: 'sub-inter-1',
      subjectName: 'Advanced Accounting',
      paperNumber: 1,
      totalQuestions: 2,
      maxMarks: 10,
      obtainedMarks: 7.5,
      percentage: 75.0,
      passed: true,
      stage: 'COMPLETED',
      stageMessage: 'Evaluation completed successfully.',
      pageCount: 2,
      pages: [],
      source: 'INSTITUTE_SPONSORED',
      instituteId: 'inst-1',
      instituteName: 'Rankers CA Academy',
      createdAt: '2026-02-18T11:20:00Z',
      completedAt: '2026-02-18T11:22:15Z',
      presentationScore: 8,
      accuracyScore: 7,
      strengths: [
        'Accurately identified applicable accounting standard (AS 12)',
        'Clear ledger account presentation with proper date column',
        'Sound grasp of the distinction between capital and revenue government grants',
      ],
      weaknesses: [
        'Omitted disclosure requirement note under Schedule III',
        'Minor computation rounding error in deferred income schedule',
      ],
      topicPerformance: [
        { topic: 'AS 12 Government Grants', marksObtained: 4.0, maxMarks: 5.0 },
        { topic: 'Schedule III Rectification Entries', marksObtained: 3.5, maxMarks: 5.0 },
      ],
      commonMistakes: [
        'Failed to state the secondary alternative method recognized by ICAI',
      ],
      actionableRecommendations: [
        'Always write 1-line concluding note explaining the rationale behind the selected accounting method.',
        'Ensure working notes are referenced with distinct numbers (e.g. W.N. 1, W.N. 2).',
      ],
      overallSummary: 'High quality answer with strong conceptual clarity. Marks were only deducted for incomplete working note labeling and missed disclosure note.',
      questionEvaluations: [
        {
          questionNumber: '1',
          subQuestion: 'a',
          topic: 'AS 12 Government Grants',
          maxMarks: 5.0,
          marksObtained: 4.0,
          marksDeducted: 1.0,
          status: 'PARTIAL_MARKS',
          conceptualCorrectness: 'Excellent grasp of AS 12 principles. Stated that direct credit of full grant to P&L is non-compliant.',
          whatWasCorrect: 'Correctly cited AS 12, explained that asset-related grants cannot be taken to current year P&L directly, and presented the deferred income journal entries accurately.',
          whatWasMissing: 'Did not cite the second allowable approach (deducting the grant from the gross book value of the asset).',
          whatWasIncorrect: 'Stated that deferred grant must be amortized over 5 years without tying it to the machine useful life.',
          methodologyAndWorkingNotesAnalysis: 'Working notes were neat. Calculation of depreciation on net asset basis was performed clearly.',
          presentationAnalysis: 'Legible handwriting, neat journal entry format with proper narrations.',
          whyMarksDeducted: '1 mark deducted for omission of the alternative gross-deduction method and incomplete statutory reference.',
          improvementSuggestion: 'In CA exams, whenever an AS provides dual options, always mention both before proceeding with one chosen method.',
          idealApproach: 'Reference AS 12 Para 14 (deferred income) and Para 15 (deduction from gross asset value).',
          examinerStyleFeedback: 'A well-articulated response demonstrating solid preparation. Adding the second option would have yielded a perfect 5/5 score.',
          confidenceScore: 95,
          needsManualReview: false,
        },
        {
          questionNumber: '1',
          subQuestion: 'b',
          topic: 'Schedule III Rectification Entries',
          maxMarks: 5.0,
          marksObtained: 3.5,
          marksDeducted: 1.5,
          status: 'PARTIAL_MARKS',
          conceptualCorrectness: 'Understood rectification mechanism through Profit & Loss Adjustment Account.',
          whatWasCorrect: 'Journal entries correctly debiting P&L adjustment and crediting deferred revenue reserve.',
          whatWasMissing: 'Balance sheet extract showing presentation under Other Non-Current Liabilities.',
          whatWasIncorrect: 'Classified the entire deferred grant balance as current liability.',
          methodologyAndWorkingNotesAnalysis: 'Bifurcation between current portion (to be credited within 12 months) and non-current portion was omitted.',
          presentationAnalysis: 'Format was clean, debit and credit totals tallied.',
          whyMarksDeducted: '1.5 marks deducted for failure to bifurcate deferred grant into current and non-current liabilities as required by Schedule III.',
          improvementSuggestion: 'Pay special attention to Division I/II Schedule III classification for deferred income.',
          idealApproach: 'Split ₹4,00,000 into current liability (1 year amortization) and non-current liability (remaining useful life).',
          examinerStyleFeedback: 'Good technical grasp, but strict adherence to Schedule III liability categorization is expected at the Intermediate level.',
          confidenceScore: 92,
          needsManualReview: false,
        },
      ],
    },
  ];

  const creditLedger: CreditLedgerEntry[] = [
    {
      id: 'crd-1',
      userId: 'usr-student-demo',
      type: 'INSTITUTE_BENEFIT',
      amount: 1,
      source: 'INSTITUTE_BENEFIT',
      evaluationId: 'eval-sample-1',
      balanceAfter: 0,
      description: 'Answer sheet evaluated using Rankers CA Academy sponsored pool.',
      timestamp: '2026-02-18T11:20:00Z',
    },
  ];

  const orders: PaymentOrder[] = [];

  return {
    users,
    subjects,
    chapters,
    amendments,
    questions,
    evaluations,
    creditLedger,
    pricingPlans,
    orders,
    institutes,
    batches,
    assignments,
    tests,
    notifications,
    supportTickets,
    auditLogs,
    permanentFreeEntries,
    systemSettings,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure permanent free accounts exist in case store was old
        const mandatedEmails = ['adityakumart484@gmail.com', 'Manug8158@gmail.com'];
        for (const email of mandatedEmails) {
          if (!parsed.permanentFreeEntries?.some((e: PermanentFreeEntry) => e.email.toLowerCase() === email.toLowerCase())) {
            parsed.permanentFreeEntries = parsed.permanentFreeEntries || [];
            parsed.permanentFreeEntries.push({
              email,
              grantedBy: 'SYSTEM_BOOTSTRAP',
              grantedAt: new Date().toISOString(),
              reason: 'Mandated Permanent Free VIP Account',
              active: true,
            });
          }
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Error reading store.json, falling back to initial database:', err);
    }
    const initial = getInitialDatabase();
    this.saveDataDirect(initial);
    return initial;
  }

  private saveDataDirect(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save store.json:', err);
    }
  }

  private save(): void {
    this.saveDataDirect(this.data);
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  // --- Users & Permanent Free ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    return this.data.users.find((u) => u.email.toLowerCase() === normalized);
  }

  public isEmailPermanentFree(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return this.data.permanentFreeEntries.some(
      (e) => e.email.toLowerCase() === normalized && e.active
    );
  }

  public getPermanentFreeEntries(): PermanentFreeEntry[] {
    return this.data.permanentFreeEntries;
  }

  public addPermanentFreeEntry(email: string, grantedBy: string, reason: string): PermanentFreeEntry {
    const normalized = email.trim().toLowerCase();
    const existingIndex = this.data.permanentFreeEntries.findIndex(
      (e) => e.email.toLowerCase() === normalized
    );
    const entry: PermanentFreeEntry = {
      email: normalized,
      grantedBy,
      grantedAt: new Date().toISOString(),
      reason,
      active: true,
    };
    if (existingIndex >= 0) {
      this.data.permanentFreeEntries[existingIndex] = entry;
    } else {
      this.data.permanentFreeEntries.push(entry);
    }

    // Update user if present
    const user = this.getUserByEmail(normalized);
    if (user) {
      user.isPermanentFree = true;
      user.freeEvaluationsLimit = 999999;
      user.purchasedCredits = Math.max(user.purchasedCredits, 9999);
    }
    this.save();
    return entry;
  }

  public removePermanentFreeEntry(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    const existing = this.data.permanentFreeEntries.find(
      (e) => e.email.toLowerCase() === normalized
    );
    if (existing) {
      existing.active = false;
      const user = this.getUserByEmail(normalized);
      if (user) {
        user.isPermanentFree = false;
        user.freeEvaluationsLimit = this.data.systemSettings.freeEvaluationsForStudents;
      }
      this.save();
      return true;
    }
    return false;
  }

  public createUser(user: User): User {
    // Check if permanent free
    if (this.isEmailPermanentFree(user.email)) {
      user.isPermanentFree = true;
      user.freeEvaluationsLimit = 999999;
      user.purchasedCredits = 9999;
    }
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Subjects, Chapters, Amendments, Questions ---
  public getSubjects(level?: string): Subject[] {
    if (level) {
      return this.data.subjects.filter((s) => s.level === level);
    }
    return this.data.subjects;
  }

  public getSubjectById(id: string): Subject | undefined {
    return this.data.subjects.find((s) => s.id === id);
  }

  public saveSubject(subject: Subject): Subject {
    const idx = this.data.subjects.findIndex((s) => s.id === subject.id);
    if (idx >= 0) {
      this.data.subjects[idx] = subject;
    } else {
      this.data.subjects.push(subject);
    }
    this.save();
    return subject;
  }

  public getChapters(subjectId?: string): Chapter[] {
    if (subjectId) {
      return this.data.chapters.filter((c) => c.subjectId === subjectId);
    }
    return this.data.chapters;
  }

  public saveChapter(chapter: Chapter): Chapter {
    const idx = this.data.chapters.findIndex((c) => c.id === chapter.id);
    if (idx >= 0) {
      this.data.chapters[idx] = chapter;
    } else {
      this.data.chapters.push(chapter);
    }
    this.save();
    return chapter;
  }

  public getAmendments(subjectId?: string): Amendment[] {
    if (subjectId) {
      return this.data.amendments.filter((a) => a.subjectId === subjectId);
    }
    return this.data.amendments;
  }

  public saveAmendment(amendment: Amendment): Amendment {
    const idx = this.data.amendments.findIndex((a) => a.id === amendment.id);
    if (idx >= 0) {
      this.data.amendments[idx] = amendment;
    } else {
      this.data.amendments.push(amendment);
    }
    this.save();
    return amendment;
  }

  public getQuestions(subjectId?: string): QuestionModel[] {
    if (subjectId) {
      return this.data.questions.filter((q) => q.subjectId === subjectId);
    }
    return this.data.questions;
  }

  public saveQuestion(question: QuestionModel): QuestionModel {
    const idx = this.data.questions.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      this.data.questions[idx] = question;
    } else {
      this.data.questions.push(question);
    }
    this.save();
    return question;
  }

  // --- Evaluations ---
  public getEvaluations(userId?: string): EvaluationReport[] {
    if (userId) {
      return this.data.evaluations.filter((e) => e.userId === userId);
    }
    return this.data.evaluations;
  }

  public getEvaluationById(id: string): EvaluationReport | undefined {
    return this.data.evaluations.find((e) => e.id === id);
  }

  public saveEvaluation(evaluation: EvaluationReport): EvaluationReport {
    const idx = this.data.evaluations.findIndex((e) => e.id === evaluation.id);
    if (idx >= 0) {
      this.data.evaluations[idx] = evaluation;
    } else {
      this.data.evaluations.unshift(evaluation);
    }
    this.save();
    return evaluation;
  }

  // --- Credits & Ledger ---
  public getCreditLedger(userId?: string): CreditLedgerEntry[] {
    if (userId) {
      return this.data.creditLedger.filter((c) => c.userId === userId);
    }
    return this.data.creditLedger;
  }

  public addCreditLedgerEntry(entry: CreditLedgerEntry): CreditLedgerEntry {
    this.data.creditLedger.unshift(entry);
    this.save();
    return entry;
  }

  // --- Pricing & Orders ---
  public getPricingPlans(): PricingPlan[] {
    return this.data.pricingPlans;
  }

  public updatePricingPlan(plan: PricingPlan): PricingPlan {
    const idx = this.data.pricingPlans.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      this.data.pricingPlans[idx] = plan;
    } else {
      this.data.pricingPlans.push(plan);
    }
    this.save();
    return plan;
  }

  public getOrders(userId?: string): PaymentOrder[] {
    if (userId) {
      return this.data.orders.filter((o) => o.userId === userId);
    }
    return this.data.orders;
  }

  public saveOrder(order: PaymentOrder): PaymentOrder {
    const idx = this.data.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      this.data.orders[idx] = order;
    } else {
      this.data.orders.unshift(order);
    }
    this.save();
    return order;
  }

  // --- Institutes & Academics ---
  public getInstitutes(): Institute[] {
    return this.data.institutes;
  }

  public getInstituteById(id: string): Institute | undefined {
    return this.data.institutes.find((i) => i.id === id);
  }

  public saveInstitute(institute: Institute): Institute {
    const idx = this.data.institutes.findIndex((i) => i.id === institute.id);
    if (idx >= 0) {
      this.data.institutes[idx] = institute;
    } else {
      this.data.institutes.push(institute);
    }
    this.save();
    return institute;
  }

  public getBatches(instituteId?: string): Batch[] {
    if (instituteId) {
      return this.data.batches.filter((b) => b.instituteId === instituteId);
    }
    return this.data.batches;
  }

  public saveBatch(batch: Batch): Batch {
    const idx = this.data.batches.findIndex((b) => b.id === batch.id);
    if (idx >= 0) {
      this.data.batches[idx] = batch;
    } else {
      this.data.batches.push(batch);
    }
    this.save();
    return batch;
  }

  public getAssignments(instituteId?: string): Assignment[] {
    if (instituteId) {
      return this.data.assignments.filter((a) => a.instituteId === instituteId);
    }
    return this.data.assignments;
  }

  public saveAssignment(assignment: Assignment): Assignment {
    const idx = this.data.assignments.findIndex((a) => a.id === assignment.id);
    if (idx >= 0) {
      this.data.assignments[idx] = assignment;
    } else {
      this.data.assignments.push(assignment);
    }
    this.save();
    return assignment;
  }

  public getTests(instituteId?: string): InstituteTest[] {
    if (instituteId) {
      return this.data.tests.filter((t) => t.instituteId === instituteId);
    }
    return this.data.tests;
  }

  public saveTest(test: InstituteTest): InstituteTest {
    const idx = this.data.tests.findIndex((t) => t.id === test.id);
    if (idx >= 0) {
      this.data.tests[idx] = test;
    } else {
      this.data.tests.push(test);
    }
    this.save();
    return test;
  }

  // --- Notifications, Support, Audit Logs & Settings ---
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.data.notifications.filter((n) => n.userId === userId);
    }
    return this.data.notifications;
  }

  public addNotification(notification: NotificationItem): NotificationItem {
    this.data.notifications.unshift(notification);
    this.save();
    return notification;
  }

  public markNotificationRead(id: string): boolean {
    const n = this.data.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public getSupportTickets(userId?: string): SupportTicket[] {
    if (userId) {
      return this.data.supportTickets.filter((t) => t.userId === userId);
    }
    return this.data.supportTickets;
  }

  public saveSupportTicket(ticket: SupportTicket): SupportTicket {
    const idx = this.data.supportTickets.findIndex((t) => t.id === ticket.id);
    if (idx >= 0) {
      this.data.supportTickets[idx] = ticket;
    } else {
      this.data.supportTickets.unshift(ticket);
    }
    this.save();
    return ticket;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }

  public getSystemSettings(): SystemSettings {
    return this.data.systemSettings;
  }

  public updateSystemSettings(settings: Partial<SystemSettings>): SystemSettings {
    Object.assign(this.data.systemSettings, settings);
    this.save();
    return this.data.systemSettings;
  }
}

export const db = new Database();
