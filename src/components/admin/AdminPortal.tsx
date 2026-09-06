import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Award,
  BookOpen,
  DollarSign,
  LifeBuoy,
  History,
  Trash2,
  Edit2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Lock,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, PermanentFreeEntry, AuditLog, SupportTicket } from '../../types';

interface AdminPortalProps {
  onNavigate: (path: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'KPI' | 'USERS' | 'PERMANENT_FREE' | 'ACADEMICS' | 'PRICING' | 'SUPPORT' | 'AUDIT'>('KPI');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [permanentFreeList, setPermanentFreeList] = useState<PermanentFreeEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');

  // Add Permanent Free Modal
  const [showAddVip, setShowAddVip] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [vipReason, setVipReason] = useState('');

  // Reply Ticket Modal
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dash, uList, vipList, logs, tickets] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers(),
        api.getPermanentFreeList(),
        api.getAuditLogs(),
        api.getSupportTickets(),
      ]);
      setDashboardData(dash);
      setUsersList(uList.users);
      setPermanentFreeList(vipList.entries);
      setAuditLogs(logs.logs);
      setSupportTickets(tickets.tickets);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleAddPermanentFree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipEmail) return;
    try {
      await api.addPermanentFree(vipEmail, vipReason || 'Admin Whitelist Policy');
      setShowAddVip(false);
      setVipEmail('');
      setVipReason('');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add permanent free entry');
    }
  };

  const handleRemovePermanentFree = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke permanent free access from ${email}?`)) return;
    try {
      await api.removePermanentFree(email);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove permanent free entry');
    }
  };

  const handleDeleteUser = async (targetId: string, name: string) => {
    if (!confirm(`WARNING: Super Admin deletion will permanently delete user "${name}". This will be logged in the immutable audit trail. Proceed?`)) {
      return;
    }
    try {
      await api.deleteAdminUser(targetId);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    try {
      await api.replySupportTicket(ticketId, ticketReplyText, 'RESOLVED');
      setReplyTicketId(null);
      setTicketReplyText('');
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to reply ticket');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Administrative Office</span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Super Admin Controller
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A] flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#1A1A1A]" /> Authorized Admin
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Manage users, VIP permanent free access whitelist, academics, pricing rules, and view real audit logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddVip(true)}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A] flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Grant Permanent VIP Free</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1A1A1A] text-xs font-mono uppercase tracking-wider overflow-x-auto pb-0">
        {[
          { key: 'KPI', label: 'Dashboard & Metrics', icon: Shield },
          { key: 'USERS', label: 'User Directory', icon: Users },
          { key: 'PERMANENT_FREE', label: 'Permanent Free Whitelist', icon: Award },
          { key: 'SUPPORT', label: 'Support Desk Tickets', icon: LifeBuoy },
          { key: 'AUDIT', label: 'Audit Trail Logs', icon: History },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key as any)}
              className={`flex items-center gap-2 px-5 py-3 transition-colors whitespace-nowrap -mb-[1px] ${
                tab === item.key
                  ? 'bg-[#FFFFFF] text-[#1A1A1A] border-t-2 border-t-[#1A1A1A] border-x border-[#1A1A1A] font-bold'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI METRICS */}
      {tab === 'KPI' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Total Users</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.totalUsers ?? 0}
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Students</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.totalStudents ?? 0}
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Institutes</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.totalInstitutes ?? 0}
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Evaluations Run</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.totalEvaluations ?? 0}
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Total Revenue</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                ₹{dashboardData?.totalRevenue ?? 0}
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">VIP Perm Free</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.permanentFreeCount ?? 0}
              </div>
            </div>
          </div>

          {/* Recent Evaluations table */}
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em] pb-3 border-b border-[#1A1A1A]/10">
              Recent System Evaluations
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[#1A1A1A]/60 uppercase text-[10px] font-mono">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Student</th>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3 text-right">Score</th>
                    <th className="py-2 px-3">Source</th>
                    <th className="py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                  {dashboardData?.recentEvaluations?.map((r: any) => (
                    <tr key={r.id} className="hover:bg-[#F9F8F6]">
                      <td className="py-2.5 px-3 font-mono text-[#1A1A1A]/60 text-[11px]">{r.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#1A1A1A]">{r.studentName}</td>
                      <td className="py-2.5 px-3 text-[#1A1A1A]">{r.subjectName}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1A1A1A]">
                        {r.obtainedMarks}/{r.maxMarks} ({r.percentage}%)
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 border border-[#1A1A1A] bg-[#EFECE6] text-[#1A1A1A]">
                          {r.source}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#1A1A1A]/60 font-mono text-[11px]">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY */}
      {tab === 'USERS' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Registered Accounts ({usersList.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user..."
                className="w-full pl-9 pr-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-[#1A1A1A]/60 uppercase text-[10px] font-mono">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Free Used</th>
                  <th className="py-2.5 px-3 text-right">Paid Credits</th>
                  <th className="py-2.5 px-3">Permanent Free?</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9F8F6]">
                    <td className="py-3 px-3 font-semibold text-[#1A1A1A]">{u.name}</td>
                    <td className="py-3 px-3 text-[#1A1A1A]/70 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#1A1A1A]/30 bg-[#EFECE6] text-[#1A1A1A]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#1A1A1A]">{u.freeEvaluationsUsed} / {u.freeEvaluationsLimit}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#1A1A1A] font-bold">{u.purchasedCredits}</td>
                    <td className="py-3 px-3">
                      {u.isPermanentFree ? (
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]">
                          YES (VIP)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#1A1A1A]/50">No</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {user?.role === 'SUPER_ADMIN' && u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-[#1A1A1A] hover:bg-[#EFECE6] border border-transparent hover:border-[#1A1A1A] transition-colors"
                          title="Permanently Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PERMANENT FREE ACCESS WHITELIST */}
      {tab === 'PERMANENT_FREE' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1A1A1A]/10">
            <div>
              <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
                Permanent Free VIP Accounts ({permanentFreeList.length})
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 font-sans mt-0.5">
                Accounts registered with these emails enjoy unlimited lifetime answer sheet evaluations.
              </p>
            </div>

            <button
              onClick={() => setShowAddVip(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add VIP Email
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-[#1A1A1A]/60 uppercase text-[10px] font-mono">
                  <th className="py-2.5 px-3">Whitelisted Email</th>
                  <th className="py-2.5 px-3">Grant Reason</th>
                  <th className="py-2.5 px-3">Added By</th>
                  <th className="py-2.5 px-3">Added Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                {permanentFreeList.map((entry) => (
                  <tr key={entry.email} className="hover:bg-[#F9F8F6]">
                    <td className="py-3 px-3 font-mono font-semibold text-[#1A1A1A] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#1A1A1A]" />
                      <span>{entry.email}</span>
                    </td>
                    <td className="py-3 px-3 text-[#1A1A1A]">{entry.reason}</td>
                    <td className="py-3 px-3 text-[#1A1A1A]/70 font-mono text-[11px]">{entry.addedBy}</td>
                    <td className="py-3 px-3 text-[#1A1A1A]/70 font-mono text-[11px]">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleRemovePermanentFree(entry.email)}
                        className="text-[#1A1A1A] underline font-mono text-[11px] font-semibold uppercase hover:text-red-700"
                      >
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT DESK */}
      {tab === 'SUPPORT' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em] pb-3 border-b border-[#1A1A1A]/10">
            Student & Institute Support Desk ({supportTickets.length})
          </h3>

          <div className="space-y-4">
            {supportTickets.map((t) => (
              <div key={t.id} className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60 font-bold block mb-1">{t.ticketNumber}</span>
                    <h4 className="font-serif font-bold text-[#1A1A1A] text-base">{t.subject}</h4>
                    <p className="text-xs text-[#1A1A1A]/70 font-sans">
                      From: {t.userName} ({t.userEmail}) • {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border ${
                      t.status === 'RESOLVED'
                        ? 'bg-[#EFECE6] text-[#1A1A1A] border-[#1A1A1A]'
                        : 'bg-transparent text-[#1A1A1A] border-[#1A1A1A]'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-xs text-[#1A1A1A] bg-[#F9F8F6] border border-[#1A1A1A]/20 p-3 font-sans">{t.message}</p>

                {t.adminReply ? (
                  <div className="p-3 bg-[#EFECE6] border border-[#1A1A1A] text-xs text-[#1A1A1A] space-y-1 font-sans">
                    <p className="font-bold font-mono text-[10px] uppercase tracking-wider">Official Admin Reply:</p>
                    <p>{t.adminReply}</p>
                  </div>
                ) : (
                  <div>
                    {replyTicketId === t.id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={3}
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          placeholder="Type official reply to student..."
                          className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReplyTicketId(null)}
                            className="px-3 py-1.5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplyTicket(t.id)}
                            className="px-3 py-1.5 bg-[#1A1A1A] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider"
                          >
                            Send & Resolve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyTicketId(t.id)}
                        className="text-xs font-mono text-[#1A1A1A] hover:underline font-bold uppercase tracking-wider"
                      >
                        Reply to this Ticket →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {tab === 'AUDIT' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Immutable Audit Trail Logs ({auditLogs.length})
            </h3>
            <p className="text-xs text-[#1A1A1A]/70 font-sans mt-0.5">
              Real tamper-evident log of security events, administrative changes, evaluations, and payments.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-[#1A1A1A]/60 uppercase text-[10px] font-mono">
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Actor</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Target</th>
                  <th className="py-2 px-3">IP Address</th>
                  <th className="py-2 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F9F8F6]">
                    <td className="py-2.5 px-3 text-[#1A1A1A]/70 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#1A1A1A]">
                      {log.actorEmail} ({log.actorRole})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#1A1A1A] font-bold text-[11px]">{log.action}</td>
                    <td className="py-2.5 px-3 text-[#1A1A1A]/70 font-mono text-[11px]">
                      {log.targetType}: {log.targetId}
                    </td>
                    <td className="py-2.5 px-3 text-[#1A1A1A]/50 font-mono text-[11px]">{log.ipAddress}</td>
                    <td className="py-2.5 px-3 text-[#1A1A1A] text-[11px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Permanent VIP Free */}
      {showAddVip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 space-y-4 shadow-2xl">
            <div className="border-b border-[#1A1A1A] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1">VIP Whitelist</span>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1A1A1A]" />
                <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Grant Permanent Free Access</h3>
              </div>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-sans">
              This email will receive permanent VIP status with unlimited answer sheet evaluations.
            </p>

            <form onSubmit={handleAddPermanentFree} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-semibold">User Email Address *</label>
                <input
                  type="email"
                  value={vipEmail}
                  onChange={(e) => setVipEmail(e.target.value)}
                  required
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-semibold">Reason for Exemption</label>
                <input
                  type="text"
                  value={vipReason}
                  onChange={(e) => setVipReason(e.target.value)}
                  placeholder="e.g. Founder Whitelist or Merit Scholarship"
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVip(false)}
                  className="w-1/2 py-2.5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#1A1A1A] text-[#F9F8F6] font-bold text-xs uppercase tracking-wider"
                >
                  Confirm & Whitelist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
