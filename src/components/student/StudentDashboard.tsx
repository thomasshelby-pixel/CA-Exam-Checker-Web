import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { EvaluationReport } from '../../types';
import {
  UploadCloud,
  Award,
  Sparkles,
  CreditCard,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  FileCheck2,
  AlertCircle,
  Percent,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onViewReport: (reportId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onViewReport }) => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<EvaluationReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvaluations()
      .then((res) => setEvaluations(res.evaluations))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const freeRemaining = Math.max(0, (user?.freeEvaluationsLimit || 2) - (user?.freeEvaluationsUsed || 0));
  const avgPercentage =
    evaluations.length > 0
      ? (evaluations.reduce((acc, curr) => acc + curr.percentage, 0) / evaluations.length).toFixed(1)
      : '0.0';

  const passedCount = evaluations.filter((e) => e.passed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Student Folio & Overview</span>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Welcome back, {user?.name || 'Aspirant'}
            </h1>
            {user?.isPermanentFree && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-mono uppercase font-bold">
                <Award className="w-3.5 h-3.5" /> VIP Permanent Free
              </span>
            )}
          </div>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
            Targeting {user?.caLevel?.replace('_', ' ') || 'CA Intermediate'} • Attempt: {user?.attempt || 'Nov 2026'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('/upload')}
          className="flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A] shadow-md transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Evaluate Answer Sheet</span>
        </button>
      </div>

      {/* Institute Sponsorship Banner if applicable */}
      {user?.instituteName && (
        <div className="p-4 bg-[#EFECE6] border border-[#1A1A1A] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#1A1A1A] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#1A1A1A]">
                Institute Benefits Active: <span className="font-serif">{user.instituteName}</span>
              </p>
              <p className="text-[11px] text-[#1A1A1A]/70 font-sans">
                Your evaluations are sponsored by your enrolled coaching academy.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FFFFFF] text-[#1A1A1A] border border-[#1A1A1A]">
            Sponsored
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credit / Balance Card */}
        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2 relative">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">
            <span>Evaluation Balance</span>
            <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
            {user?.isPermanentFree ? (
              <span>Unlimited</span>
            ) : user?.instituteId ? (
              <span>Sponsored</span>
            ) : freeRemaining > 0 ? (
              <span>{freeRemaining} Free Left</span>
            ) : (
              <span>{user?.purchasedCredits || 0} Credits</span>
            )}
          </div>
          <div className="text-[11px] text-[#1A1A1A]/70 flex items-center justify-between pt-1 border-t border-[#1A1A1A]/10">
            <span>{user?.isPermanentFree ? 'VIP Access' : `${user?.freeEvaluationsUsed || 0} used of 2 free`}</span>
            <button
              onClick={() => onNavigate('/credits')}
              className="text-[#1A1A1A] font-bold underline font-mono text-[10px] uppercase"
            >
              Ledger →
            </button>
          </div>
        </div>

        {/* Total Evaluated */}
        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">
            <span>Sheets Evaluated</span>
            <FileCheck2 className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
            {evaluations.length}
          </div>
          <p className="text-[11px] text-[#1A1A1A]/70 font-sans border-t border-[#1A1A1A]/10 pt-1">
            {passedCount} passed (≥40% per paper)
          </p>
        </div>

        {/* Average Score */}
        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">
            <span>Average Score</span>
            <Percent className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
            {avgPercentage}%
          </div>
          <p className="text-[11px] text-[#1A1A1A]/70 font-sans border-t border-[#1A1A1A]/10 pt-1">
            Across all evaluated subjects
          </p>
        </div>

        {/* Pricing Quick CTA */}
        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">
            <span>Standard Pack</span>
            <CreditCard className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div className="text-xl font-serif font-bold text-[#1A1A1A]">
            10 Sheets = ₹100
          </div>
          <button
            onClick={() => onNavigate('/pricing')}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A] underline block border-t border-[#1A1A1A]/10 pt-1"
          >
            Recharge Credits →
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Evaluations & Diagnostic Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Evaluations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Recent Answer Sheet Evaluations</h2>
            <button
              onClick={() => onNavigate('/evaluations')}
              className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] underline"
            >
              View All History
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs font-mono uppercase text-[#1A1A1A]/60">Loading evaluations...</div>
          ) : evaluations.length === 0 ? (
            <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[#1A1A1A] mx-auto" />
              <h3 className="font-serif font-bold text-[#1A1A1A] text-base">No Answer Sheets Evaluated Yet</h3>
              <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto font-sans">
                Upload your first handwritten test paper or mock answer sheet to receive question-wise marks and examiner feedback.
              </p>
              <button
                onClick={() => onNavigate('/upload')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6] border border-[#1A1A1A]"
              >
                Evaluate First Sheet (Free)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {evaluations.slice(0, 5).map((evalItem) => (
                <div
                  key={evalItem.id}
                  onClick={() => onViewReport(evalItem.id)}
                  className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F9F8F6] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#1A1A1A] group-hover:underline">
                        {evalItem.subjectName}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border ${
                          evalItem.passed
                            ? 'bg-[#EFECE6] text-[#1A1A1A] border-[#1A1A1A]'
                            : 'bg-transparent text-[#1A1A1A] border-[#1A1A1A]/50'
                        }`}
                      >
                        {evalItem.passed ? 'PASSED' : 'NEEDS REVISION'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#1A1A1A]/70 font-sans">
                      <span>{evalItem.caLevel.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(evalItem.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{evalItem.pageCount} Pages</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <div className="text-right">
                      <div className="text-base font-bold text-[#1A1A1A]">
                        {evalItem.obtainedMarks} / {evalItem.maxMarks}
                      </div>
                      <div className="text-xs text-[#1A1A1A]/60">{evalItem.percentage}%</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Diagnostic Insights (1 col) */}
        <div className="space-y-4">
          <div className="border-b border-[#1A1A1A] pb-2">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Examiner Focus Areas</h2>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4 text-xs">
            <div className="space-y-2">
              <div className="font-serif font-bold text-sm text-[#1A1A1A]">High-Yield CA Recommendations:</div>
              <ul className="space-y-2 text-[#1A1A1A]/80 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#1A1A1A] font-bold">•</span>
                  <span>
                    <strong>Working Notes:</strong> Always show calculations even if intermediate values appear trivial. Up to 40% marks are in W.N.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1A1A1A] font-bold">•</span>
                  <span>
                    <strong>Statutory Precision:</strong> Don't guess Section numbers. Quoting the correct legal rule without guessing the section gets more marks than an incorrect section citation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1A1A1A] font-bold">•</span>
                  <span>
                    <strong>MCQ Strategy:</strong> Zero negative marking means you should attempt 100% of all MCQs.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/10">
              <button
                onClick={() => onNavigate('/analytics')}
                className="w-full py-2 text-xs font-bold uppercase tracking-wider bg-[#EFECE6] hover:bg-[#E8E4DC] text-[#1A1A1A] border border-[#1A1A1A]/40"
              >
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
