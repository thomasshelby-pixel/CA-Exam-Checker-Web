import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Printer,
  ArrowLeft,
  Sparkles,
  Building2,
  BookOpen,
  Share2,
  ShieldCheck,
  Download,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { EvaluationReport } from '../../types';
import { generateEvaluationPDF } from '../../utils/pdfGenerator';
import { OfficialLogo } from '../common/OfficialLogo';

interface EvaluationReportViewProps {
  reportId: string;
  onBack: () => void;
  onEvaluateAnother: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  reportId,
  onBack,
  onEvaluateAnother,
}) => {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  useEffect(() => {
    api
      .getEvaluationById(reportId)
      .then((res) => setReport(res.report))
      .catch((err) => setError(err.message || 'Could not load report'))
      .finally(() => setLoading(false));
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    try {
      setDownloadingPdf(true);
      generateEvaluationPDF(report);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to print
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs font-mono uppercase tracking-widest text-[#1A1A1A]/60">
        Loading evaluation dossier & diagnostic audit...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 bg-[#FFFFFF] border border-[#1A1A1A] p-8">
        <AlertCircle className="w-10 h-10 text-[#1A1A1A] mx-auto" />
        <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Evaluation Dossier Not Found</h2>
        <p className="text-xs text-[#1A1A1A]/70">{error || 'This report may have been archived or moved.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const sumOfQuestions = report.questionEvaluations.reduce((acc, q) => acc + q.marksObtained, 0);
  const mathMatches = Math.abs(sumOfQuestions - report.obtainedMarks) < 0.05;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 print:py-0 print:px-0">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 dark:text-gray-300 hover:text-[#1A1A1A] dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#0284C7] hover:bg-[#0369A1] text-white border border-[#0284C7] transition-colors shadow-sm"
            title="Download Formatted Editorial PDF Document"
          >
            {pdfDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>PDF Downloaded!</span>
              </>
            ) : downloadingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Dossier</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#FFFFFF] dark:bg-[#22252E] hover:bg-[#EFECE6] dark:hover:bg-[#2B2F3A] text-[#1A1A1A] dark:text-[#F3F4F6] border border-[#1A1A1A] dark:border-white/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Folio</span>
          </button>

          <button
            onClick={onEvaluateAnother}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] dark:bg-white/10 hover:bg-[#2A2A2A] dark:hover:bg-white/20 text-[#F9F8F6] border border-[#1A1A1A] dark:border-white/20"
          >
            Evaluate Another Sheet
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#181A20] border border-[#1A1A1A] dark:border-white/10 p-6 sm:p-10 space-y-8 print:border-none print:p-0 shadow-sm">
        {/* Editorial Official Header Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#1A1A1A] dark:border-white/10 gap-4">
          <OfficialLogo variant="header" size="md" />
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/60 dark:text-gray-400 block">
              Certified ICAI Examiner Evaluation
            </span>
            <span className="text-xs font-serif italic text-[#0284C7] font-semibold">
              Accurate • Reliable • Step-Wise Marking
            </span>
          </div>
        </div>

        {/* Header with Title & Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#1A1A1A] dark:border-white/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#EFECE6] dark:bg-[#22252E] text-[#1A1A1A] dark:text-[#F3F4F6] border border-[#1A1A1A]/20 dark:border-white/10">
                DOSSIER #{report.id.slice(0, 10)}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white px-2 py-0.5 border border-[#1A1A1A]/30 dark:border-white/20">
                {report.caLevel.replace('_', ' ')}
              </span>
              {report.instituteName && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F3F4F6] bg-[#EFECE6] dark:bg-[#22252E] px-2 py-0.5 border border-[#1A1A1A]/20 dark:border-white/10">
                  Institute: {report.instituteName}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-white leading-tight">
              {report.subjectName} <span className="font-mono text-xl font-normal text-[#1A1A1A]/60 dark:text-gray-400">({report.subjectCode})</span>
            </h1>
            <p className="text-xs font-sans text-[#1A1A1A]/70 dark:text-gray-300">
              Candidate: <strong className="text-[#1A1A1A] dark:text-white">{report.studentName}</strong> • Attempt: {report.attempt} • Evaluated on{' '}
              {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Big Score Box */}
          <div className="p-5 bg-[#EFECE6] dark:bg-[#22252E] border-2 border-[#1A1A1A] dark:border-white/20 text-center min-w-[190px]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60 dark:text-gray-400">Awarded Score</div>
            <div className="text-4xl font-serif font-bold text-[#1A1A1A] dark:text-white my-1">
              {report.obtainedMarks} <span className="text-sm font-mono font-normal text-[#1A1A1A]/60 dark:text-gray-400">/ {report.maxMarks}</span>
            </div>
            <div
              className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold inline-block border ${
                report.passed
                  ? 'bg-[#1A1A1A] dark:bg-[#0284C7] text-[#F9F8F6] border-[#1A1A1A] dark:border-[#0284C7]'
                  : 'bg-transparent text-[#1A1A1A] dark:text-white border-[#1A1A1A] dark:border-white/30'
              }`}
            >
              {report.passed ? 'PASSED (≥ 40%)' : 'REVISION NEEDED (< 40%)'}
            </div>
          </div>
        </div>

        {/* Mathematical Check Verification Banner */}
        <div className="p-4 bg-[#EFECE6] dark:bg-[#22252E] border border-[#1A1A1A] dark:border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#1A1A1A] dark:text-[#F3F4F6] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1A1A1A] dark:text-white shrink-0" />
            <span>
              ICAI Arithmetic Rule: Total score ({report.obtainedMarks}) matches the exact sum of all question marks ({sumOfQuestions.toFixed(1)}).
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold text-[#1A1A1A] dark:text-white bg-[#FFFFFF] dark:bg-[#181A20] px-2 py-0.5 border border-[#1A1A1A]/30 dark:border-white/20">
            Audit Verified
          </span>
        </div>

        {/* Presentation & Accuracy Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1A1A1A]/20 dark:bg-white/10 border border-[#1A1A1A] dark:border-white/10 text-xs">
          <div className="p-4 bg-[#FFFFFF] dark:bg-[#181A20]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 dark:text-gray-400 block">Percentage</span>
            <div className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-white mt-0.5">{report.percentage}%</div>
          </div>
          <div className="p-4 bg-[#FFFFFF] dark:bg-[#181A20]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 dark:text-gray-400 block">Presentation</span>
            <div className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-white mt-0.5">{report.presentationScore} / 10</div>
          </div>
          <div className="p-4 bg-[#FFFFFF] dark:bg-[#181A20]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 dark:text-gray-400 block">Accuracy</span>
            <div className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-white mt-0.5">{report.accuracyScore} / 10</div>
          </div>
          <div className="p-4 bg-[#FFFFFF] dark:bg-[#181A20]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 dark:text-gray-400 block">Pages Scanned</span>
            <div className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-white mt-0.5">{report.pageCount} Pages</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 bg-[#EFECE6] dark:bg-[#22252E] border border-[#1A1A1A] dark:border-white/10 space-y-2">
          <h3 className="text-[11px] font-bold text-[#1A1A1A] dark:text-white uppercase tracking-[0.2em] font-mono">
            Examiner Executive Evaluation Summary
          </h3>
          <p className="text-sm font-sans text-[#1A1A1A]/80 dark:text-gray-300 leading-relaxed drop-cap">
            {report.overallSummary}
          </p>
        </div>

        {/* Question-Wise Detailed Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] dark:border-white/10 pb-2">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-white">
              Question-by-Question Diagnostic Breakdown
            </h3>
            <span className="text-xs font-mono uppercase text-[#1A1A1A]/60 dark:text-gray-400">
              {report.questionEvaluations.length} Questions Graded
            </span>
          </div>

          <div className="space-y-6">
            {report.questionEvaluations.map((q, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#FFFFFF] dark:bg-[#181A20] border border-[#1A1A1A] dark:border-white/10 space-y-4"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1A1A1A]/15 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-[#EFECE6] dark:bg-[#22252E] text-[#1A1A1A] dark:text-white font-mono font-bold text-xs border border-[#1A1A1A]/30 dark:border-white/20">
                      {q.questionNumber}
                    </span>
                    <span className="text-base font-serif font-bold text-[#1A1A1A] dark:text-white">
                      {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-[#1A1A1A]/60 dark:text-gray-400 uppercase">
                      Max: <strong className="text-[#1A1A1A] dark:text-white">{q.maxMarks}</strong>
                    </span>
                    <span className="font-bold px-2.5 py-0.5 bg-[#EFECE6] dark:bg-[#22252E] text-[#1A1A1A] dark:text-white border border-[#1A1A1A] dark:border-white/20">
                      Awarded: {q.marksObtained} / {q.maxMarks}
                    </span>
                  </div>
                </div>

                {/* Step Marking Table if present */}
                {q.stepBreakdown && q.stepBreakdown.length > 0 && (
                  <div className="overflow-x-auto border border-[#1A1A1A]/15 dark:border-white/10">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="bg-[#EFECE6] dark:bg-[#22252E] border-b border-[#1A1A1A]/20 dark:border-white/10 text-[#1A1A1A] dark:text-white font-mono text-[10px] uppercase tracking-wider">
                          <th className="py-2 px-3">Step</th>
                          <th className="py-2 px-3">Sub-Criteria</th>
                          <th className="py-2 px-3 text-right">Max</th>
                          <th className="py-2 px-3 text-right">Awarded</th>
                          <th className="py-2 px-3">Examiner Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A1A1A]/10 dark:divide-white/10">
                        {q.stepBreakdown.map((step, sIdx) => (
                          <tr key={sIdx} className="hover:bg-[#F9F8F6] dark:hover:bg-white/5">
                            <td className="py-2 px-3 font-mono text-[#1A1A1A] dark:text-white font-bold">#{step.stepNumber}</td>
                            <td className="py-2 px-3 font-medium text-[#1A1A1A] dark:text-gray-200">{step.description}</td>
                            <td className="py-2 px-3 text-right font-mono text-[#1A1A1A] dark:text-gray-300">{step.maxMarks}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-[#1A1A1A] dark:text-white">
                              {step.awardedMarks}
                            </td>
                            <td className="py-2 px-3 text-[#1A1A1A]/70 dark:text-gray-400 text-[11px]">{step.examinerNotes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Three Diagnostics Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-4 bg-[#F9F8F6] dark:bg-[#111317] border border-[#1A1A1A]/20 dark:border-white/10 space-y-1.5">
                    <div className="font-serif font-bold text-[#1A1A1A] dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-emerald-400" /> What Was Correct
                    </div>
                    <p className="text-[#1A1A1A]/80 dark:text-gray-300 text-[11px] leading-relaxed font-sans">
                      {q.whatWasCorrect}
                    </p>
                  </div>

                  <div className="p-4 bg-[#F9F8F6] dark:bg-[#111317] border border-[#1A1A1A]/20 dark:border-white/10 space-y-1.5">
                    <div className="font-serif font-bold text-[#1A1A1A] dark:text-rose-400 flex items-center gap-1.5 text-sm">
                      <AlertCircle className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-rose-400" /> Deficits & Deductions
                    </div>
                    <p className="text-[#1A1A1A]/80 dark:text-gray-300 text-[11px] leading-relaxed font-sans">
                      {q.whatWasMissing}
                    </p>
                    {q.whyMarksDeducted && (
                      <p className="text-[10px] font-mono text-[#1A1A1A]/70 dark:text-gray-400 pt-1 border-t border-[#1A1A1A]/10 dark:border-white/10">
                        Reason: {q.whyMarksDeducted}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-[#F9F8F6] dark:bg-[#111317] border border-[#1A1A1A]/20 dark:border-white/10 space-y-1.5">
                    <div className="font-serif font-bold text-[#1A1A1A] dark:text-sky-400 flex items-center gap-1.5 text-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-sky-400" /> Ideal Approach & Advice
                    </div>
                    <p className="text-[#1A1A1A]/80 dark:text-gray-300 text-[11px] leading-relaxed font-sans">
                      {q.idealApproach}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#1A1A1A] dark:border-white/10">
          <div className="p-6 bg-[#FFFFFF] dark:bg-[#181A20] border border-[#1A1A1A] dark:border-white/10 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] dark:text-emerald-400" /> Demonstrated Strengths
            </h4>
            <ul className="space-y-2 text-xs text-[#1A1A1A]/80 dark:text-gray-300 font-sans">
              {report.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1A1A1A] dark:text-white font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-[#FFFFFF] dark:bg-[#181A20] border border-[#1A1A1A] dark:border-white/10 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-rose-400 flex items-center gap-1.5 font-mono">
              <XCircle className="w-4 h-4 text-[#1A1A1A] dark:text-rose-400" /> Deficits & Areas For Improvement
            </h4>
            <ul className="space-y-2 text-xs text-[#1A1A1A]/80 dark:text-gray-300 font-sans">
              {report.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1A1A1A] dark:text-white font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-6 bg-[#EFECE6] dark:bg-[#22252E] border border-[#1A1A1A] dark:border-white/10 space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white flex items-center gap-2 font-mono">
            <TrendingUp className="w-4 h-4 text-[#1A1A1A] dark:text-sky-400" />
            Examiner Actionable Recommendations to Boost Next Paper Score
          </h4>
          <ul className="space-y-2 text-xs text-[#1A1A1A]/80 dark:text-gray-300 font-sans">
            {report.actionableRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#1A1A1A] dark:text-white font-bold font-mono">{idx + 1}.</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
