import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User as UserIcon, Phone, BookOpen, Building2, Award, Shield, CheckCircle2 } from 'lucide-react';
import { CALevel, UserRole } from '../../types';

interface AuthPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email);
      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, role: string, destination: string) => {
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail, role);
      onNavigate(destination);
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center text-[#F9F8F6] font-mono font-bold text-sm mx-auto border border-[#1A1A1A]">
            CA
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
            Sign In to CA Exam Checker AI
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 font-sans">
            Access your evaluated answer sheets, scores, and analytics.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1A1A1A]">Registered Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[#1A1A1A]">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[11px] text-[#1A1A1A] hover:underline font-mono"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A] transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-[#1A1A1A]/20 space-y-2">
          <p className="text-[10px] font-mono font-bold text-[#1A1A1A]/60 uppercase tracking-[0.2em] text-center">
            Or Click a Demo Account:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <button
              onClick={() => handleQuickLogin('student@example.com', 'STUDENT', '/dashboard')}
              className="p-2 bg-[#F9F8F6] hover:bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] text-left flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Student (2 Free)</span>
            </button>
            <button
              onClick={() => handleQuickLogin('adityakumart484@gmail.com', 'STUDENT', '/dashboard')}
              className="p-2 bg-[#EFECE6] hover:bg-[#E5E0D8] border border-[#1A1A1A] text-[#1A1A1A] text-left flex items-center gap-1.5 font-bold"
            >
              <Award className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>VIP Permanent Free</span>
            </button>
            <button
              onClick={() => handleQuickLogin('institute@example.com', 'INSTITUTE_ADMIN', '/institute/dashboard')}
              className="p-2 bg-[#F9F8F6] hover:bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] text-left flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Institute Portal</span>
            </button>
            <button
              onClick={() => handleQuickLogin('admin@example.com', 'SUPER_ADMIN', '/admin/dashboard')}
              className="p-2 bg-[#F9F8F6] hover:bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] text-left flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#1A1A1A]/70 font-sans">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-[#1A1A1A] font-bold underline hover:text-black"
          >
            Create Free Account
          </button>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [caLevel, setCaLevel] = useState<CALevel>('CA_INTERMEDIATE');
  const [attempt, setAttempt] = useState('Nov 2026');
  const [studentId, setStudentId] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill out required fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({
        name,
        email,
        mobile,
        password,
        caLevel,
        attempt,
        studentId,
        instituteName,
        role,
      });
      if (role === 'INSTITUTE_ADMIN') {
        onNavigate('/institute/dashboard');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="p-8 bg-[#FFFFFF] border border-[#1A1A1A] space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Registration</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
            Create Your CA Account
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 font-sans">
            Includes 2 full answer sheet evaluations completely free.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F9F8F6] border border-[#1A1A1A] text-xs font-mono uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2 transition-colors ${
              role === 'STUDENT' ? 'bg-[#1A1A1A] text-[#F9F8F6] font-bold' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            CA Student
          </button>
          <button
            type="button"
            onClick={() => setRole('INSTITUTE_ADMIN')}
            className={`py-2 transition-colors ${
              role === 'INSTITUTE_ADMIN' ? 'bg-[#1A1A1A] text-[#F9F8F6] font-bold' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            Coaching Institute
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1A1A]">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Priya Patel"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1A1A]">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="priya@example.com"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1A1A]">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1A1A]">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          {role === 'STUDENT' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">CA Exam Level</label>
                  <select
                    value={caLevel}
                    onChange={(e) => setCaLevel(e.target.value as CALevel)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="CA_FOUNDATION">CA Foundation</option>
                    <option value="CA_INTERMEDIATE">CA Intermediate</option>
                    <option value="CA_FINAL">CA Final</option>
                  </select>
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
                    <option value="Nov 2027">Nov 2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">Student CRO / WRO ID (Optional)</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. WRO0654321"
                    className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">Coaching Institute (Optional)</label>
                  <input
                    type="text"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="e.g. Rankers CA Academy"
                    className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1A1A1A]">Academy / Institute Name *</label>
              <input
                type="text"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                required
                placeholder="e.g. Apex Chartered Academy"
                className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          )}

          <div className="p-3 bg-[#F9F8F6] border border-[#1A1A1A]/30 text-[11px] text-[#1A1A1A]/70 flex items-start gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
            <span>
              By signing up, you agree to receive 2 complimentary evaluation credits. Your data is stored safely with no third-party distribution.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A] transition-colors"
          >
            {loading ? 'Creating Account...' : 'Register & Claim 2 Free Sheets'}
          </button>
        </form>

        <p className="text-center text-xs text-[#1A1A1A]/70 font-sans">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-[#1A1A1A] font-bold underline hover:text-black"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
