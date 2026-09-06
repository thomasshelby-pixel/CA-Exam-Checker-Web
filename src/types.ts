/**
 * CA EXAM CHECKER AI - Unified Type Definitions
 * Covers Student, Institute, Admin, Evaluation Engine, Credits, Payments, and Syllabus
 */

export type UserRole = 'STUDENT' | 'INSTITUTE_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';

export type CALevel = 'CA_FOUNDATION' | 'CA_INTERMEDIATE' | 'CA_FINAL';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  caLevel?: CALevel;
  attempt?: string;
  subjects?: string[];
  studentId?: string;
  instituteId?: string;
  instituteName?: string;
  accountStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BLOCKED';
  freeEvaluationsUsed: number;
  freeEvaluationsLimit: number;
  purchasedCredits: number;
  isPermanentFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: CALevel;
  paperNumber: number;
  chaptersCount: number;
  totalMarks: number;
  syllabusYear: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNumber: number;
  title: string;
  weightagePercentage?: number;
  topics: string[];
}

export interface Amendment {
  id: string;
  subjectId: string;
  title: string;
  applicableAttempt: string;
  effectiveDate: string;
  summary: string;
  statutoryReference: string;
}

export interface QuestionModel {
  id: string;
  subjectId: string;
  chapterId?: string;
  paperCode: string;
  attempt: string;
  questionNumber: string;
  subQuestion?: string;
  type: 'DESCRIPTIVE' | 'MCQ' | 'PRACTICAL';
  maxMarks: number;
  text: string;
  modelAnswer: string;
  markingScheme: {
    step: string;
    marks: number;
    criteria: string;
  }[];
  keyProvisionsOrStandards?: string[];
}

export interface UploadedPage {
  id?: string;
  pageNumber: number;
  dataUrl: string; // base64 representation
  fileName: string;
  fileSize: number;
  fileType?: string;
  status?: string;
  detectedQuestions?: string[];
  rotation?: number;
}

export type EvaluationStage =
  | 'QUEUED'
  | 'UPLOADING'
  | 'INGESTING_PAGES'
  | 'OCR_HANDWRITING_RECOGNITION'
  | 'QUESTION_SEGMENTATION'
  | 'SYLLABUS_MAPPING'
  | 'STEP_MARKING_CALCULATION'
  | 'AMENDMENT_STANDARDS_VERIFICATION'
  | 'WORKING_NOTE_AUDIT'
  | 'PRESENTATION_ANALYSIS'
  | 'TOTAL_MARKS_ARITHMETIC_VERIFICATION'
  | 'READING_ANSWER_SHEET'
  | 'IDENTIFYING_QUESTIONS'
  | 'ANALYSING_ANSWERS'
  | 'EVALUATING_ANSWERS'
  | 'CALCULATING_MARKS'
  | 'GENERATING_FEEDBACK'
  | 'FINALIZING_REPORT'
  | 'COMPLETED'
  | 'FAILED';

export interface QuestionEvaluationResult {
  questionNumber: string;
  subQuestion?: string;
  topic?: string;
  maxMarks: number;
  marksObtained: number;
  marksDeducted: number;
  status: 'FULL_MARKS' | 'PARTIAL_MARKS' | 'ZERO_MARKS' | 'UNATTEMPTED';
  isMcq?: boolean;
  conceptualCorrectness: string;
  whatWasCorrect: string;
  whatWasMissing: string;
  whatWasIncorrect: string;
  methodologyAndWorkingNotesAnalysis: string;
  presentationAnalysis: string;
  whyMarksDeducted: string;
  improvementSuggestion: string;
  idealApproach: string;
  examinerStyleFeedback: string;
  confidenceScore: number; // 0-100
  needsManualReview?: boolean;
  stepBreakdown?: {
    stepNumber?: number | string;
    stepIndex?: number | string;
    description: string;
    maxMarks?: number;
    allocatedMarks?: number;
    awardedMarks: number;
    examinerNotes?: string;
    status?: string;
  }[];
  deductions?: Array<string | { reason?: string; description?: string; marksDeducted?: number }>;
  positiveFeedback?: string;
  topicName?: string;
}

export interface EvaluationReport {
  id: string;
  userId: string;
  studentName: string;
  caLevel: CALevel;
  attempt: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  paperNumber: number;
  totalQuestions: number;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
  passed: boolean;
  stage: EvaluationStage;
  stageMessage: string;
  pageCount: number;
  pages: UploadedPage[];
  questionEvaluations: QuestionEvaluationResult[];
  strengths: string[];
  weaknesses: string[];
  topicPerformance: {
    topic: string;
    marksObtained: number;
    maxMarks: number;
  }[];
  presentationScore: number; // out of 10
  accuracyScore: number; // out of 10
  commonMistakes: string[];
  actionableRecommendations: string[];
  overallSummary: string;
  overallFeedback?: string;
  recommendations?: string[];
  instituteId?: string;
  instituteName?: string;
  source: 'INDIVIDUAL_FREE' | 'INDIVIDUAL_CREDIT' | 'PERMANENT_FREE' | 'INSTITUTE_SPONSORED';
  createdAt: string;
  completedAt?: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  type: 'CREDIT_ADDED' | 'CREDIT_CONSUMED' | 'CREDIT_REFUNDED' | 'INSTITUTE_BENEFIT';
  amount: number;
  source: 'PURCHASE' | 'EVALUATION' | 'MANUAL_GRANT' | 'FREE_TRIAL' | 'FAILED_EVALUATION_RESTORE' | 'INSTITUTE_BENEFIT';
  evaluationId?: string;
  orderId?: string;
  balanceAfter: number;
  description: string;
  timestamp: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  evaluationsCount: number;
  priceINR: number;
  discountPercentage?: number;
  popular?: boolean;
  features: string[];
}

export interface PaymentOrder {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  evaluationsCount: number;
  amountINR: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Institute {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  contactPerson: string;
  description?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  sponsoredCreditsPool: number;
  sponsoredCreditsUsed: number;
  subscriptionPlan: string;
  subscriptionExpiresAt: string;
  allowAssignments: boolean;
  allowTests: boolean;
  totalStudents: number;
  createdAt: string;
}

export interface Batch {
  id: string;
  instituteId: string;
  name: string;
  caLevel: CALevel;
  attempt: string;
  studentIds: string[];
  createdAt: string;
}

export interface Assignment {
  id: string;
  instituteId: string;
  batchId: string;
  batchName: string;
  title: string;
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  deadline: string;
  instructions: string;
  totalSubmissions: number;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  createdAt: string;
}

export interface InstituteTest {
  id: string;
  instituteId: string;
  batchId: string;
  batchName: string;
  title: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  maxMarks: number;
  allowNegativeMarking: boolean; // default false per CA exam rule
  questionsCount: number;
  mcqCount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'EVALUATION' | 'CREDIT' | 'PAYMENT' | 'INSTITUTE' | 'SYSTEM';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  evaluationId?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface PermanentFreeEntry {
  email: string;
  grantedBy: string;
  grantedAt: string;
  reason: string;
  active: boolean;
}

export interface SystemSettings {
  freeEvaluationsForStudents: number;
  default10SheetsPriceINR: number;
  mcqNegativeMarkingDefault: boolean;
  allowInstituteRegistrations: boolean;
  aiModel: string;
  systemPromptOverride?: string;
  maintenanceMode: boolean;
}
