import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Layers,
  FileCheck,
  Plus,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Batch, Assignment, InstituteTest, User } from '../../types';

interface InstitutePortalProps {
  onNavigate: (path: string) => void;
}

export const InstitutePortal: React.FC<InstitutePortalProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'OVERVIEW' | 'STUDENTS' | 'BATCHES' | 'ASSIGNMENTS' | 'TESTS'>('OVERVIEW');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals / forms
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');

  const [showAddBatch, setShowAddBatch] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchLevel, setBatchLevel] = useState('CA_INTERMEDIATE');

  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentMarks, setAssignmentMarks] = useState('20');
  const [assignmentDeadline, setAssignmentDeadline] = useState('2026-11-15');

  const [showAddTest, setShowAddTest] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testMarks, setTestMarks] = useState('50');
  const [testDuration, setTestDuration] = useState('90');

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, stu] = await Promise.all([
        api.getInstituteDashboard(),
        api.getInstituteStudents(),
      ]);
      setDashboardData(dash);
      setStudents(stu.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addInstituteStudent({
        name: newStudentName,
        email: newStudentEmail,
        batchId: selectedBatchId,
      });
      setShowAddStudent(false);
      setNewStudentName('');
      setNewStudentEmail('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add student');
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBatch({
        name: batchName,
        caLevel: batchLevel,
        attempt: 'Nov 2026',
      });
      setShowAddBatch(false);
      setBatchName('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create batch');
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        title: assignmentTitle,
        maxMarks: Number(assignmentMarks),
        deadline: assignmentDeadline,
        subjectId: 'sub-inter-1',
        subjectName: 'Advanced Accounting',
        batchId: dashboardData?.batches[0]?.id || 'batch-1',
        batchName: dashboardData?.batches[0]?.name || 'Batch A',
        instructions: 'Attempt all mandatory questions showing working notes clearly.',
      });
      setShowAddAssignment(false);
      setAssignmentTitle('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createInstituteTest({
        title: testTitle,
        maxMarks: Number(testMarks),
        durationMinutes: Number(testDuration),
        subjectId: 'sub-inter-1',
        subjectName: 'Advanced Accounting',
        batchId: dashboardData?.batches[0]?.id || 'batch-1',
        batchName: dashboardData?.batches[0]?.name || 'Batch A',
        allowNegativeMarking: false, // strictly zero negative marking for CA
      });
      setShowAddTest(false);
      setTestTitle('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create test');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block mb-1">Academy Oversight</span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              {dashboardData?.institute?.name || 'Institute Management Portal'}
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]">
              Partner Academy
            </span>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Batch-wise student evaluation tracking, test creation, and sponsored benefit pool management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStudent(true)}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => setShowAddBatch(true)}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-transparent hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]"
          >
            New Batch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1A1A1A] text-xs font-mono uppercase tracking-wider overflow-x-auto pb-0">
        {(['OVERVIEW', 'STUDENTS', 'BATCHES', 'ASSIGNMENTS', 'TESTS'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 transition-colors whitespace-nowrap -mb-[1px] ${
              tab === t
                ? 'bg-[#FFFFFF] text-[#1A1A1A] border-t-2 border-t-[#1A1A1A] border-x border-[#1A1A1A] font-bold'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            {t === 'OVERVIEW' ? 'Dashboard Overview' : t}
          </button>
        ))}
      </div>

      {/* Expiry Rule Callout */}
      <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-[#1A1A1A] shrink-0" />
          <p className="text-[#1A1A1A] font-sans">
            <strong className="font-semibold">Data Preservation Policy:</strong> Even if your institute sponsorship period ends, student records, mock test evaluations, and history are never deleted. Students automatically fall back to individual credit mode.
          </p>
        </div>
        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A] shrink-0">
          Permanent Archival
        </span>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Enrolled Students</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.studentsCount ?? 0}
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60 font-sans">Active CA Aspirants</p>
            </div>

            <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Total Evaluations</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.evaluationsCount ?? 0}
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60 font-sans">Across all batches</p>
            </div>

            <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Average Academy Score</span>
              <div className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.averageScore ?? 0}%
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60 font-sans">Passing benchmark: 40%</p>
            </div>

            <div className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Sponsored Credit Pool</span>
              <div className="text-xl font-serif font-bold text-[#1A1A1A]">
                {dashboardData?.institute?.sponsoredCreditsRemaining ?? 0}
                <span className="text-xs text-[#1A1A1A]/60 font-mono font-normal"> / {dashboardData?.institute?.sponsoredCreditsTotal ?? 0}</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60 font-sans">
                Expires: {dashboardData?.institute?.subscriptionExpiresAt?.split('T')[0] || '2026-12-31'}
              </p>
            </div>
          </div>

          {/* Batches & Tests Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10">
                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
                  Active Batches ({dashboardData?.batchesCount ?? 0})
                </h3>
                <button
                  onClick={() => setShowAddBatch(true)}
                  className="text-xs font-mono font-semibold text-[#1A1A1A] hover:underline"
                >
                  + Add Batch
                </button>
              </div>

              <div className="space-y-3">
                {dashboardData?.batches?.map((b: Batch) => (
                  <div
                    key={b.id}
                    className="p-3.5 bg-[#F9F8F6] border border-[#1A1A1A]/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-serif font-bold text-[#1A1A1A] text-sm">{b.name}</p>
                      <p className="text-[#1A1A1A]/70 text-[11px] font-sans">{b.caLevel.replace('_', ' ')} • Attempt: {b.attempt}</p>
                    </div>
                    <span className="px-2 py-0.5 border border-[#1A1A1A] bg-[#FFFFFF] text-[#1A1A1A] text-[10px] font-mono font-bold">
                      {b.studentIds.length} Students
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10">
                <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
                  Scheduled Mock Tests ({dashboardData?.testsCount ?? 0})
                </h3>
                <button
                  onClick={() => setShowAddTest(true)}
                  className="text-xs font-mono font-semibold text-[#1A1A1A] hover:underline"
                >
                  + Create Test
                </button>
              </div>

              <div className="space-y-3">
                {dashboardData?.tests?.map((t: InstituteTest) => (
                  <div
                    key={t.id}
                    className="p-3.5 bg-[#F9F8F6] border border-[#1A1A1A]/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-serif font-bold text-[#1A1A1A] text-sm">{t.title}</p>
                      <p className="text-[#1A1A1A]/70 text-[11px] font-sans">{t.subjectName} • {t.durationMinutes} mins • Max {t.maxMarks} marks</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A] text-[9px] font-mono font-bold">
                      Zero MCQ Negative
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS */}
      {tab === 'STUDENTS' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Enrolled Students ({students.length})
            </h3>
            <button
              onClick={() => setShowAddStudent(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Student
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-[#1A1A1A]/60 uppercase text-[10px] font-mono">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Attempt</th>
                  <th className="py-2.5 px-3">Free Used</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/10 font-sans">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F9F8F6]">
                    <td className="py-3 px-3 font-semibold text-[#1A1A1A]">{s.name}</td>
                    <td className="py-3 px-3 text-[#1A1A1A]/70 font-mono text-[11px]">{s.email}</td>
                    <td className="py-3 px-3 text-[#1A1A1A]">{s.caLevel?.replace('_', ' ')}</td>
                    <td className="py-3 px-3 text-[#1A1A1A]/70">{s.attempt || 'Nov 2026'}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#1A1A1A]">{s.freeEvaluationsUsed} sheets</td>
                    <td className="py-3 px-3">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#1A1A1A] bg-[#EFECE6] text-[#1A1A1A]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BATCHES */}
      {tab === 'BATCHES' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Batches
            </h3>
            <button
              onClick={() => setShowAddBatch(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6]"
            >
              + Create Batch
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardData?.batches?.map((b: Batch) => (
              <div key={b.id} className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-[#1A1A1A] text-base">{b.name}</h4>
                    <p className="text-xs text-[#1A1A1A]/70 font-sans">{b.caLevel.replace('_', ' ')} • Attempt: {b.attempt}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase border border-[#1A1A1A] bg-[#EFECE6] text-[#1A1A1A] px-2 py-0.5">
                    {b.studentIds.length} Enrolled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS */}
      {tab === 'ASSIGNMENTS' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Assignments
            </h3>
            <button
              onClick={() => setShowAddAssignment(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6]"
            >
              + New Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardData?.assignments?.map((a: Assignment) => (
              <div key={a.id} className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-[#1A1A1A] text-base">{a.title}</h4>
                    <p className="text-xs text-[#1A1A1A]/70 font-sans">{a.subjectName} • Batch: {a.batchName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1A1A1A]">Max: {a.maxMarks} Marks</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/60 font-mono">Deadline: {a.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TESTS */}
      {tab === 'TESTS' && (
        <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Mock Tests
            </h3>
            <button
              onClick={() => setShowAddTest(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F9F8F6]"
            >
              + Create Mock Test
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardData?.tests?.map((t: InstituteTest) => (
              <div key={t.id} className="p-5 bg-[#FFFFFF] border border-[#1A1A1A] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-[#1A1A1A] text-base">{t.title}</h4>
                    <p className="text-xs text-[#1A1A1A]/70 font-sans">{t.subjectName} • {t.durationMinutes} Minutes</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1A1A1A]">Max: {t.maxMarks} Marks</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]/10 text-[11px] text-[#1A1A1A]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] uppercase">Zero MCQ Negative Marking Rule Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 space-y-4 shadow-2xl">
            <div className="border-b border-[#1A1A1A] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1">Student Registry</span>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Enroll Student to Institute</h3>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-semibold">Student Name</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                  placeholder="e.g. Yash Singhal"
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-semibold">Student Email</label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                  placeholder="yash@example.com"
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="w-1/2 py-2.5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#1A1A1A] text-[#F9F8F6] font-bold text-xs uppercase tracking-wider"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 space-y-4 shadow-2xl">
            <div className="border-b border-[#1A1A1A] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 block mb-1">Batch Setup</span>
              <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Create New Batch</h3>
            </div>
            <form onSubmit={handleAddBatch} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-semibold">Batch Name</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                  placeholder="e.g. May 2027 Fast Track Batch"
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-semibold">CA Exam Level</label>
                <select
                  value={batchLevel}
                  onChange={(e) => setBatchLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] focus:outline-none"
                >
                  <option value="CA_FOUNDATION">CA Foundation</option>
                  <option value="CA_INTERMEDIATE">CA Intermediate</option>
                  <option value="CA_FINAL">CA Final</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBatch(false)}
                  className="w-1/2 py-2.5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#1A1A1A] text-[#F9F8F6] font-bold text-xs uppercase tracking-wider"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
