import React from 'react';
import {
  UploadCloud,
  CheckCircle,
  FileCheck2,
  Brain,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION - Editorial Masthead */}
      <section className="relative pt-12 sm:pt-16 border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-8 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#EFECE6] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Chartered Accountancy Examination Assessment • Vol. 2026</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic font-normal tracking-tight text-[#1A1A1A] leading-[1.05]">
              The Examiner’s Dossier: <br />
              <span className="font-serif not-italic font-bold tracking-tight">CA Answer Sheet AI</span>
            </h1>
            <p className="text-xl sm:text-2xl font-serif italic text-[#1A1A1A]/80 tracking-normal max-w-2xl mx-auto">
              “Get your CA answer sheets evaluated by AI with authentic examiner rigor.”
            </p>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A1A1A]/70 leading-relaxed font-sans">
              Upload handwritten CA answer sheets across Foundation, Inter & Final. Receive question-wise step marks, working note verifications, standard citations, and actionable diagnostic commentary.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('/upload')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#F9F8F6] bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#1A1A1A] shadow-md transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Evaluate Answer Sheet</span>
            </button>

            <button
              onClick={() => onNavigate('/for-institutes')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#EFECE6] transition-all"
            >
              <Building2 className="w-4 h-4 text-[#1A1A1A]" />
              <span>For Coaching Institutes</span>
            </button>
          </div>

          {/* Quick Stats / Trust indicators in Editorial Grid */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1A1A1A]/20 border border-[#1A1A1A] max-w-5xl mx-auto text-left">
            <div className="p-4 bg-[#FFFFFF]">
              <div className="font-serif italic font-bold text-xl text-[#1A1A1A]">First 2 Free</div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 uppercase tracking-wider font-mono">Complimentary for all students</p>
            </div>
            <div className="p-4 bg-[#FFFFFF]">
              <div className="font-serif italic font-bold text-xl text-[#1A1A1A]">10 Sheets = ₹100</div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 uppercase tracking-wider font-mono">₹10 per evaluated paper</p>
            </div>
            <div className="p-4 bg-[#FFFFFF]">
              <div className="font-serif italic font-bold text-xl text-[#1A1A1A]">Zero MCQ Penalty</div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 uppercase tracking-wider font-mono">Strict ICAI evaluation rules</p>
            </div>
            <div className="p-4 bg-[#FFFFFF]">
              <div className="font-serif italic font-bold text-xl text-[#1A1A1A]">AS / Ind AS / SA</div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 uppercase tracking-wider font-mono">Statutory & standard citations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60">Editorial Methodology</span>
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">
            How Answer Sheets Are Critiqued & Graded
          </h2>
          <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto">
            From handwritten student folio to an examiner-grade score report in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3 relative group">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Upload Foliage</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Upload multi-page JPG, PNG or PDF scans of your handwritten answer papers from any mobile device or workstation.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3 relative group">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Transcript OCR</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Vision intelligence transcribes questions, sub-parts, calculations, ledger entries, and working notes across pages.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3 relative group">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Examiner Critique</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Evaluates conceptual accuracy, statutory provisions, standard citations, and methodology with fair alternative logic.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3 relative group">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center font-mono font-bold text-xs">
              04
            </div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Score Dossier</h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Obtain question-wise marks, mathematical tally, deduction rationale, presentation feedback, and actionable guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. IMPORTANT MARKING PRINCIPLE SECTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 bg-[#EFECE6] border border-[#1A1A1A] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1A1A1A] text-[#F9F8F6]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60">Academic Tenet</span>
              <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Substance & Methodology Over Rigid Keyword Matching</h3>
            </div>
          </div>

          <p className="text-[#1A1A1A]/80 text-sm leading-relaxed drop-cap font-sans">
            Unlike superficial keyword matchers, CA Exam Checker AI evaluates whether the student has genuinely applied the core accounting standard, legal principle, or mathematical formulation. A student receives full legitimate credit even if sentence structure or wording differs from model solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A]/20 space-y-1.5">
              <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5 font-serif text-sm">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Valid Alternative Views
              </div>
              <p className="text-[#1A1A1A]/70 leading-relaxed">
                Full marks awarded for legitimate alternative treatments (e.g., AS 12 deduction vs deferred income).
              </p>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A]/20 space-y-1.5">
              <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5 font-serif text-sm">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Mathematical Sum Guarantee
              </div>
              <p className="text-[#1A1A1A]/70 leading-relaxed">
                Total obtained marks always strictly equal the arithmetic sum of question-level decimal marks.
              </p>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A]/20 space-y-1.5">
              <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5 font-serif text-sm">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Authentic Realism
              </div>
              <p className="text-[#1A1A1A]/70 leading-relaxed">
                The evaluator behaves objectively without flattering the student, preparing candidates for real ICAI rigor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUESTION-WISE MARKING SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60">Exemplar Report Excerpt</span>
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">
            Question-by-Question Diagnostic Feedback
          </h2>
          <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto">
            Every question receives specific diagnostics on what was correct, what was missing, and why marks were deducted.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]/15">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[#EFECE6] text-[#1A1A1A] font-mono font-bold text-xs border border-[#1A1A1A]/20">
                Question 1 (a)
              </span>
              <span className="text-base font-serif font-bold text-[#1A1A1A]">
                AS 12 Accounting for Government Grants & Asset Presentation
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-[#1A1A1A]/60 uppercase">Max: <strong className="text-[#1A1A1A]">5.0</strong></span>
              <span className="text-[#1A1A1A] font-bold px-2.5 py-1 bg-[#EFECE6] border border-[#1A1A1A]">
                Obtained: 4.0 / 5.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#F9F8F6] border border-[#1A1A1A]/20 space-y-1.5">
              <p className="font-bold text-[#1A1A1A] font-serif uppercase tracking-wider text-[11px]">What Was Correct:</p>
              <p className="text-[#1A1A1A]/80 leading-relaxed font-sans">
                Accurately cited AS 12; stated that crediting the entire ₹4,00,000 grant directly to P&L is non-compliant; provided correct deferred income amortization schedule.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F6] border border-[#1A1A1A]/20 space-y-1.5">
              <p className="font-bold text-[#1A1A1A] font-serif uppercase tracking-wider text-[11px]">Deductions & Deficits:</p>
              <p className="text-[#1A1A1A]/80 leading-relaxed font-sans">
                1 mark deducted for omission of the alternative gross deduction method recognised under Para 15 and missed Schedule III non-current classification.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F6] border border-[#1A1A1A]/20 space-y-1.5">
              <p className="font-bold text-[#1A1A1A] font-serif uppercase tracking-wider text-[11px]">Examiner Recommendation:</p>
              <p className="text-[#1A1A1A]/80 leading-relaxed font-sans">
                Whenever testing an AS with dual approaches, always present both methods briefly before proceeding with computation. Reference working note numbers distinctly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MCQ EVALUATION: NO NEGATIVE MARKING */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EFECE6] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider border border-[#1A1A1A]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>CA Intermediate & Final Examination Rule</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              MCQ Evaluation: Strictly No Negative Marking
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 max-w-xl leading-relaxed font-sans">
              Per official CA examination guidelines, MCQs are evaluated objectively: Correct answers receive the full designated marks. Incorrect or unattempted MCQs receive 0 marks. The evaluator will NEVER deduct marks for a wrong MCQ.
            </p>
          </div>

          <div className="shrink-0 p-5 bg-[#EFECE6] border border-[#1A1A1A] text-center space-y-2 min-w-[220px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">Correct Option</div>
            <div className="text-[#1A1A1A] font-serif font-bold text-2xl">+ Full Marks</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]/60 pt-2 border-t border-[#1A1A1A]/20">Wrong / Blank Option</div>
            <div className="text-[#1A1A1A]/70 font-mono text-base font-bold">0 Marks (No Penalty)</div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60">Tariff Schedule</span>
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">
            Transparent, Accessible Evaluation Tiers
          </h2>
          <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto">
            First 2 evaluations are 100% free. Additional sheets at a flat ₹10 per paper.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <h4 className="text-base font-serif font-bold text-[#1A1A1A]">Free Trial</h4>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A]">₹0</div>
            <p className="text-xs text-[#1A1A1A]/70">2 complete answer sheet evaluations for every newly registered student.</p>
            <ul className="space-y-2 text-xs text-[#1A1A1A]/80 border-t border-b border-[#1A1A1A]/10 py-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Question-wise step marking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Full examiner commentary
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Foundation / Inter / Final
              </li>
            </ul>
            <button
              onClick={() => onNavigate('/upload')}
              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#EFECE6] hover:bg-[#E8E4DC] text-[#1A1A1A] border border-[#1A1A1A]/30"
            >
              Start Free Trial
            </button>
          </div>

          <div className="p-6 bg-[#FFFFFF] border-2 border-[#1A1A1A] space-y-4 relative shadow-lg">
            <span className="absolute -top-3 right-6 px-2 py-0.5 bg-[#1A1A1A] text-[#F9F8F6] font-bold text-[9px] uppercase tracking-widest font-mono">
              STANDARD FOLIO
            </span>
            <h4 className="text-base font-serif font-bold text-[#1A1A1A]">Standard Pack</h4>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A]">₹100</div>
            <p className="text-xs text-[#1A1A1A]/70">10 complete answer sheet evaluations (just ₹10 per sheet).</p>
            <ul className="space-y-2 text-xs text-[#1A1A1A]/80 border-t border-b border-[#1A1A1A]/10 py-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> 10 Full Answer Sheet Checks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Working notes & presentation audit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Credits never expire
              </li>
            </ul>
            <button
              onClick={() => onNavigate('/pricing')}
              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6]"
            >
              Get 10 Sheets for ₹100
            </button>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <h4 className="text-base font-serif font-bold text-[#1A1A1A]">Institutes</h4>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A]">Custom</div>
            <p className="text-xs text-[#1A1A1A]/70">Institutional student sponsorship, batch assignments, and mock series.</p>
            <ul className="space-y-2 text-xs text-[#1A1A1A]/80 border-t border-b border-[#1A1A1A]/10 py-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Dedicated institute dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Batch-wise student performance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" /> Automatic benefit allocation
              </li>
            </ul>
            <button
              onClick={() => onNavigate('/for-institutes')}
              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#EFECE6] hover:bg-[#E8E4DC] text-[#1A1A1A] border border-[#1A1A1A]/30"
            >
              Explore Institute Suite
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60">Clarifications</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Frequently Addressed Questions
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
            <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-serif">
              <HelpCircle className="w-4 h-4 text-[#1A1A1A] shrink-0" />
              Is CA Exam Checker AI affiliated with the Institute of Chartered Accountants of India (ICAI)?
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 pl-6 leading-relaxed font-sans">
              No. CA Exam Checker AI is an independent academic technology platform. We are not affiliated with, authorized by, or endorsed by ICAI. All evaluation is provided for student practice and revision purposes.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
            <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-serif">
              <HelpCircle className="w-4 h-4 text-[#1A1A1A] shrink-0" />
              How many answer sheets can I evaluate for free?
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 pl-6 leading-relaxed font-sans">
              Every newly registered individual student receives 2 full answer sheet evaluations free of charge. After that, packages start at ₹100 for 10 sheets (or through your institute if they are an active partner).
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
            <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-serif">
              <HelpCircle className="w-4 h-4 text-[#1A1A1A] shrink-0" />
              What formats can I upload for my handwritten sheets?
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 pl-6 leading-relaxed font-sans">
              You can upload JPG, JPEG, PNG images or PDF documents. You can upload multiple pages, reorder them, rotate pages, and preview them before running the evaluation.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
            <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-serif">
              <HelpCircle className="w-4 h-4 text-[#1A1A1A] shrink-0" />
              What happens if an institute's subscription expires?
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 pl-6 leading-relaxed font-sans">
              Under our strict data preservation policy, students NEVER lose their account, historical evaluations, or previous reports. If an institute subscription expires, the student simply falls back to their individual free/purchased credit rules.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-10 bg-[#EFECE6] border border-[#1A1A1A] space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Ready to Discover Exactly Where You Lose Marks?
          </h2>
          <p className="text-[#1A1A1A]/70 text-sm max-w-lg mx-auto leading-relaxed font-sans">
            Upload your handwritten CA answer sheet today and receive instant question-wise examiner feedback with verified step scoring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/upload')}
              className="px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#1A1A1A] shadow-md transition-all"
            >
              Evaluate Sheet Now (2 Free)
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F9F8F6] transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
