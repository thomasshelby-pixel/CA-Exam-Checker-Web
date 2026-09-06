import React, { useState, useEffect } from 'react';
import {
  FileText,
  CreditCard,
  TrendingUp,
  User,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { EvaluationReport, CreditLedgerEntry } from '../../types';

interface SubPageProps {
  onNavigate: (path: string) => void;
  onViewReport?: (id: string) => void;
}

// -------------------------------------------------------------
// 1. EVALUATION HISTORY
// -------------------------------------------------------------
export const EvaluationHistory: React.FC<SubPageProps> = ({ onNavigate, onViewReport }) => {
  const [evaluations, setEvaluations] = useState<EvaluationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  useEffect(() => {
    api
      .getEvaluations()
      .then((res) => setEvaluations(res.evaluations))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = evaluations.filter((e) => {
    const matchesSearch =
      e.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || e.caLevel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Archived Papers</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Evaluation History
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Browse and review all past evaluated answer papers and diagnostic feedback.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/upload')}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
        >
          Evaluate New Sheet
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject, code or ID..."
            className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-[#FFFFFF] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
        >
          <option value="ALL">All CA Levels</option>
          <option value="CA_FOUNDATION">CA Foundation</option>
          <option value="CA_INTERMEDIATE">CA Intermediate</option>
          <option value="CA_FINAL">CA Final</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono uppercase text-[#1A1A1A]/60">Loading history...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] text-center space-y-2">
          <FileText className="w-8 h-8 text-[#1A1A1A]/40 mx-auto" />
          <p className="text-xs text-[#1A1A1A]/70 font-sans">No evaluations match your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onViewReport && onViewReport(item.id)}
              className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F9F8F6] cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/60 block">
                    {item.caLevel.replace('_', ' ')}
                  </span>
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-base group-hover:underline">
                    {item.subjectName}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 font-sans">
                    Code: {item.subjectCode} • Attempt: {item.attempt}
                  </p>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border ${
                    item.passed
                      ? 'bg-[#EFECE6] text-[#1A1A1A] border-[#1A1A1A]'
                      : 'bg-transparent text-[#1A1A1A] border-[#1A1A1A]/50'
                  }`}
                >
                  {item.passed ? 'PASSED' : 'NEEDS REVISION'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]/10 text-xs">
                <div className="text-[#1A1A1A]/60 font-sans">
                  Evaluated: {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-base font-bold text-[#1A1A1A]">
                    {item.obtainedMarks} / {item.maxMarks}
                  </span>
                  <span className="text-[#1A1A1A]/60 font-medium">({item.percentage}%)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. CREDIT LEDGER VIEW
// -------------------------------------------------------------
export const CreditLedgerView: React.FC<SubPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [ledgerData, setLedgerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCreditLedger()
      .then((res) => setLedgerData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Financial Folio</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Evaluation Credits & Transaction Ledger
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Transparent audit record of all credit allocations, free trial usage, and payments.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/pricing')}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
        >
          Buy Credits (10 = ₹100)
        </button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Purchased Credits</span>
          <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
            {ledgerData?.purchasedCredits ?? 0}
          </div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-sans">Never expire</p>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Free Evaluations</span>
          <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
            {Math.max(0, (ledgerData?.freeEvaluationsLimit ?? 2) - (ledgerData?.freeEvaluationsUsed ?? 0))}
            <span className="text-xs text-[#1A1A1A]/60 font-mono font-normal"> / {ledgerData?.freeEvaluationsLimit ?? 2} Left</span>
          </div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-sans">Provided on registration</p>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Access Status</span>
          <div className="text-lg font-serif font-bold text-[#1A1A1A]">
            {ledgerData?.isPermanentFree ? 'VIP Unlimited' : user?.instituteId ? 'Institute Sponsored' : 'Standard'}
          </div>
          <p className="text-[11px] text-[#1A1A1A]/60 font-sans">
            {ledgerData?.isPermanentFree ? 'Permanent free whitelist' : 'Pay-per-pack or free'}
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
        <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
          Transaction History
        </h3>

        {loading ? (
          <div className="p-6 text-center text-xs font-mono uppercase text-[#1A1A1A]/60">Loading ledger...</div>
        ) : !ledgerData?.ledger || ledgerData.ledger.length === 0 ? (
          <div className="p-6 text-center text-xs font-sans text-[#1A1A1A]/60">No transactions recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-[#1A1A1A]/60 uppercase text-[10px] font-mono">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Event / Action</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3 text-right">Change</th>
                  <th className="py-2 px-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                {ledgerData.ledger.map((item: CreditLedgerEntry) => (
                  <tr key={item.id} className="hover:bg-[#F9F8F6]">
                    <td className="py-3 px-3 text-[#1A1A1A]/60 text-[11px] font-mono whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#1A1A1A] font-medium">{item.description}</div>
                      {item.orderId && (
                        <span className="text-[10px] font-mono text-[#1A1A1A]/50">Ref: {item.orderId}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#1A1A1A]/30 bg-[#EFECE6] text-[#1A1A1A]">
                        {item.source}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                      {item.type === 'CREDIT_ADDED' || item.type === 'CREDIT_REFUNDED' ? (
                        <span className="text-[#1A1A1A]">+{item.amount}</span>
                      ) : (
                        <span className="text-[#1A1A1A]/70">-{item.amount}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#1A1A1A] font-mono">
                      {item.balanceAfter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. STUDENT ANALYTICS
// -------------------------------------------------------------
export const StudentAnalytics: React.FC<SubPageProps> = ({ onNavigate }) => {
  const [evaluations, setEvaluations] = useState<EvaluationReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvaluations()
      .then((res) => setEvaluations(res.evaluations))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#1A1A1A] pb-6">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Diagnostic Registry</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
          Performance Analytics & Insights
        </h1>
        <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
          Track topic mastery, presentation benchmarks, and score improvements.
        </p>
      </div>

      {evaluations.length === 0 ? (
        <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] text-center space-y-2">
          <p className="text-xs text-[#1A1A1A]/70 font-sans">
            Evaluate at least one answer sheet to unlock detailed topic mastery charts and examiner trends.
          </p>
          <button
            onClick={() => onNavigate('/upload')}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6] border border-[#1A1A1A]"
          >
            Evaluate Answer Sheet
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subject Performance Breakdown */}
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Subject Mastery Scores
            </h3>
            <div className="space-y-4">
              {evaluations.map((e) => (
                <div key={e.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-semibold text-[#1A1A1A]">{e.subjectName}</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">
                      {e.obtainedMarks}/{e.maxMarks} ({e.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EFECE6] h-2 overflow-hidden border border-[#1A1A1A]">
                    <div
                      className="h-full bg-[#1A1A1A]"
                      style={{ width: `${Math.min(100, e.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 4. STUDENT PROFILE
// -------------------------------------------------------------
export const StudentProfile: React.FC<SubPageProps> = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [attempt, setAttempt] = useState(user?.attempt || 'Nov 2026');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateProfile({ name, mobile, attempt });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] space-y-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Aspirant Credentials</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
            Student Profile
          </h1>
        </div>

        {success && (
          <div className="p-3 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] text-xs font-mono font-bold">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1A1A]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1A1A]">Email Address (Read Only)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#1A1A1A]/30 text-xs text-[#1A1A1A]/60 cursor-not-allowed font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1A1A]">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1A1A]">Target Exam Attempt</label>
            <select
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
            >
              <option value="May 2026">May 2026</option>
              <option value="Nov 2026">Nov 2026</option>
              <option value="May 2027">May 2027</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A]"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
