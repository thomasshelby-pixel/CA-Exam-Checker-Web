import React from 'react';
import {
  Brain,
  Shield,
  CheckCircle2,
  FileText,
  Building2,
  Percent,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Target,
  FileCheck,
} from 'lucide-react';

interface SubPageProps {
  onNavigate: (path: string) => void;
}

export const FeaturesPage: React.FC<SubPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Comprehensive Capabilities</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          Engineered Strictly for Chartered Accountancy Exams
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-2xl mx-auto leading-relaxed font-sans">
          Explore why CA Exam Checker AI is an independent academic evaluation engine, not a generic chatbot or basic OCR reader.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <div className="w-9 h-9 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Handwritten Sheet Vision OCR</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Interprets hurried handwriting, crossed-out paragraphs, double-entry journals, ledger accounts, tax computation tables, and balance sheet schedules.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <div className="w-9 h-9 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Working Notes & Method Audit</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Grades intermediate calculation steps and confirms whether numbers in final answers originate from clearly referenced Working Notes (W.N. 1, 2, 3).
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <div className="w-9 h-9 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Statutory & Standards Benchmark</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Cross-verifies citations against AS, Ind AS, Standards on Auditing (SA 200–700), the Income Tax Act 1961, CGST/IGST Acts, and the Companies Act 2013.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <div className="w-9 h-9 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Strict Mathematical Tally</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            The total score strictly equals the sum of decimal marks across all evaluated questions. Never displays inconsistent or rounded arithmetic totals.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <div className="w-9 h-9 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Zero MCQ Negative Marking</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Strictly enforces the official CA exam regulation: Correct MCQs earn full designated marks; wrong or omitted MCQs yield 0 with zero negative deduction.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <div className="w-9 h-9 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Historical Trend Analytics</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Monitors topic mastery, recurring mistakes, presentation scores, and percentage trajectories across successive mock test papers.
          </p>
        </div>
      </div>

      <div className="text-center pt-6">
        <button
          onClick={() => onNavigate('/upload')}
          className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
        >
          Try Free Evaluation Now
        </button>
      </div>
    </div>
  );
};

export const HowItWorksPage: React.FC<SubPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Transparent Methodology</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          How Evaluation Works
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto font-sans">
          A step-by-step overview of how your answer sheets are processed with examiner integrity.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 p-6 bg-[#FFFFFF] border border-[#1A1A1A]">
          <div className="w-10 h-10 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center font-mono font-bold shrink-0 text-sm">
            01
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">High-Resolution Multi-Page Ingestion</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Upload photos or scans in JPG, PNG, or PDF format. The system supports drag-and-drop, page reordering, page previewing, and page removal. Image blur, darkness, and rotation are checked before processing.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-[#FFFFFF] border border-[#1A1A1A]">
          <div className="w-10 h-10 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center font-mono font-bold shrink-0 text-sm">
            02
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Question Segmentation & Context Mapping</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              The AI parses the document to differentiate main questions, sub-parts (e.g. 1a, 1b), ledger entries, narrations, rough work, and working notes. It maps them against configured subject papers and attempt guidelines.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-[#FFFFFF] border border-[#1A1A1A]">
          <div className="w-10 h-10 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center font-mono font-bold shrink-0 text-sm">
            03
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Substance-Based Objective Evaluation</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Answers are not evaluated by blind string matching. Valid alternative accounting treatments and legal arguments receive full marks. Decimal marks are awarded step-by-step according to ICAI marking patterns.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-[#FFFFFF] border border-[#1A1A1A]">
          <div className="w-10 h-10 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center font-mono font-bold shrink-0 text-sm">
            04
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Comprehensive Audit Report Generation</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Students receive question-wise marks, precise explanations of marks deducted, strengths, weaknesses, common mistakes, and actionable advice to boost exam scores by 15-20 marks.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/upload')}
          className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
        >
          Evaluate Answer Sheet
        </button>
      </div>
    </div>
  );
};

export const ForStudentsPage: React.FC<SubPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">For CA Aspirants</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          Designed to Help You Clear CA on the First Attempt
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto font-sans">
          Every CA student writes mock test papers. But without granular, examiner-style feedback, revision is incomplete.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <h3 className="font-serif font-bold text-[#1A1A1A] text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-[#1A1A1A]" />
            Spot Costly Working Note Mistakes
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            In CA Intermediate & Final practical papers (Accounting, Tax, Costing, AFM), up to 40% of marks are awarded for working notes. CA Exam Checker AI audits whether your working notes are properly titled, numbered, and cross-referenced.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <h3 className="font-serif font-bold text-[#1A1A1A] text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1A1A1A]" />
            Section & Standard Citation Feedback
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Know whether quoting Section 115BAC or SA 560 was accurate, or if quoting the section number incorrectly risked mark deductions.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <h3 className="font-serif font-bold text-[#1A1A1A] text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1A1A1A]" />
            2 Free Evaluated Sheets for Everyone
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Test the evaluation accuracy with 2 full answer sheets completely free before deciding to purchase any pack.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <h3 className="font-serif font-bold text-[#1A1A1A] text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1A1A1A]" />
            Affordable Packs (₹10 / Sheet)
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Traditional test series charge ₹1,500 to ₹4,000 and return evaluated sheets after 10–14 days. With CA Exam Checker AI, get instant evaluation at ₹10 per sheet.
          </p>
        </div>
      </div>

      <div className="p-6 bg-[#EFECE6] border border-[#1A1A1A] text-center space-y-4">
        <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Start Evaluating Your Answer Sheet</h3>
        <button
          onClick={() => onNavigate('/upload')}
          className="px-8 py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
        >
          Evaluate Free Trial Sheet
        </button>
      </div>
    </div>
  );
};

export const ForInstitutesPage: React.FC<SubPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">CA Coaching Academies</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          Scale Test Series Evaluation for Your Entire Academy
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto font-sans">
          Eliminate weeks of evaluation backlogs. Empower your faculties with batch-level analytics and automated test grading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <Building2 className="w-6 h-6 text-[#1A1A1A]" />
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Sponsored Student Benefits</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Allocate sponsored evaluation credit pools to your students. Students see “Sponsored by Your Academy” on their dashboard and reports.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <Users className="w-6 h-6 text-[#1A1A1A]" />
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Batch & Class Management</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Organize students into batches (e.g. Nov 2026 Regular, Fast-Track) and track average marks and pass percentages across subjects.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
          <FileCheck className="w-6 h-6 text-[#1A1A1A]" />
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Assignments & Mock Tests</h3>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
            Create chapter-wise assignments or full 100-mark mock tests with custom deadlines and MCQ evaluation rules (Zero negative marking).
          </p>
        </div>
      </div>

      <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#1A1A1A]" />
          <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Important Institute Expiry Rule</h3>
        </div>
        <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
          If your institute subscription expires, student accounts and historical evaluations are NEVER deleted. Students simply fall back to their individual free or purchased credit balances smoothly without data loss.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/institute/dashboard')}
          className="px-8 py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
        >
          Access Institute Portal Demo
        </button>
      </div>
    </div>
  );
};

export const AboutPage: React.FC<SubPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Our Mission</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          About CA Exam Checker AI
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto font-sans">
          Empowering Chartered Accountancy students with rigorous, objective, and examiner-grade evaluation.
        </p>
      </div>

      <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] space-y-6 text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
        <p>
          Preparing for Chartered Accountancy examinations is one of the most intellectually demanding journeys in professional education. With passing rates averaging 10% to 25%, the difference between clearing and falling short often lies in examination technique: presentation, step marking, working notes, and legal citation precision.
        </p>
        <p>
          Historically, CA students had to rely either on expensive test series with delayed feedback or evaluate their own papers against model answers with inherent personal bias.
        </p>
        <p>
          <strong>CA Exam Checker AI</strong> was built to solve this problem independently. By leveraging state-of-the-art vision models fine-tuned on Chartered Accountancy marking guidelines, students can upload their handwritten papers and receive diagnostic feedback in minutes.
        </p>

        <div className="p-4 bg-[#EFECE6] border border-[#1A1A1A] text-xs text-[#1A1A1A]">
          <strong>Important Notice:</strong> CA Exam Checker AI is an independent educational technology application. We are not affiliated with, endorsed by, or representing the Institute of Chartered Accountants of India (ICAI).
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC<SubPageProps> = () => {
  const faqs = [
    {
      q: 'How does the AI evaluate handwritten CA answer sheets?',
      a: 'The system uses vision OCR models to parse handwritten answers, identifies questions and sub-questions, and assesses conceptual accuracy, working notes, presentation, and statutory provisions against ICAI syllabus guidelines.',
    },
    {
      q: 'Is there any negative marking for wrong MCQs?',
      a: 'No. Strictly per CA examination guidelines, there is ZERO negative marking for MCQs. Correct answers earn designated marks, while incorrect or blank MCQs receive 0 marks.',
    },
    {
      q: 'Will I lose marks if my sentence wording differs from the model answer?',
      a: 'No. Our marking engine prioritizes substance, logical steps, calculations, and legal provisions over superficial wording. If you apply an alternative approved approach (e.g. AS 12 deduction method), full marks are awarded.',
    },
    {
      q: 'How much does it cost after my 2 free evaluations?',
      a: 'Our standard pack is ₹100 for 10 full answer sheets (just ₹10 per paper). Purchased credits never expire.',
    },
    {
      q: 'Are permanent free VIP accounts supported?',
      a: 'Yes. Authorized administrator-designated accounts (such as adityakumart484@gmail.com and Manug8158@gmail.com) have permanent free access without credit restrictions.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Knowledge Base</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">{faq.q}</h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed font-sans">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LegalPages: React.FC<{ type: 'PRIVACY' | 'TERMS' }> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Legal Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
          {type === 'PRIVACY' ? 'Privacy Policy & Data Security' : 'Terms & Conditions'}
        </h1>
        <p className="text-[#1A1A1A]/60 text-xs font-mono">Last updated: January 2026</p>
      </div>

      <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] space-y-6 text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
        <div className="p-4 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] font-semibold">
          Disclaimer: CA Exam Checker AI is an independent AI-based evaluation platform and is not an official ICAI evaluator, partner, or ICAI-endorsed service.
        </div>

        {type === 'PRIVACY' ? (
          <>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">1. Answer Sheet Privacy & Security</h3>
            <p>
              Your uploaded answer sheet images and PDFs are stored in encrypted, access-controlled cloud storage. They are processed strictly for the purpose of generating your evaluation report and are never made public.
            </p>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">2. User Data Retention</h3>
            <p>
              We retain student evaluation histories and reports so you can track your study improvement over time. When an institute subscription expires, historical student records are preserved according to our retention policy.
            </p>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">3. Third-Party Integrations</h3>
            <p>
              Payments are verified server-side with certified payment gateways. We do not store sensitive credit card numbers or UPI PINs on our servers.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">1. Nature of Service</h3>
            <p>
              CA Exam Checker AI provides automated diagnostic feedback for exam preparation. While our algorithms model ICAI examination marking schemes, evaluation results do not guarantee official examination outcomes.
            </p>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">2. Acceptable Use</h3>
            <p>
              Users agree to upload only legitimate academic answer sheets and test papers. Abuse, denial of service attempts, and unauthorized commercial scraping are strictly prohibited.
            </p>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">3. Credits & Refunds</h3>
            <p>
              Purchased evaluation credits are non-transferable and do not expire. In the event of an evaluation processing failure, the consumed credit is automatically restored to your account ledger.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export const LegalPage: React.FC<{ onNavigate?: (path: string) => void }> = () => {
  return <LegalPages type="TERMS" />;
};

