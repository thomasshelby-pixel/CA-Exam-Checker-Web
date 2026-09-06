import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  CreditCard,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Award,
  Building2,
  ChevronDown,
  LogOut,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      api.getNotifications().then((res) => setNotifications(res.notifications)).catch(() => {});
    }
  }, [user, currentPath]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    for (const n of notifications.filter((item) => !item.read)) {
      await api.markNotificationRead(n.id);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'For Students', path: '/for-students' },
    { label: 'For Institutes', path: '/for-institutes' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A] bg-[#F9F8F6]/95 backdrop-blur-md">
      {/* Top Banner for Independent Status */}
      <div className="bg-[#EFECE6] border-b border-[#1A1A1A]/15 px-4 py-1.5 text-center text-[11px] font-semibold text-[#1A1A1A]/80 uppercase tracking-widest">
        <span className="inline-flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>Independent AI answer sheet evaluation platform for CA Foundation, Inter & Final • Vol. 2026</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center font-serif italic text-base font-bold shadow-sm group-hover:bg-[#2A2A2A] transition-colors">
                CA
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif italic font-bold tracking-tight text-[#1A1A1A] text-lg sm:text-xl">
                    CA Exam Checker <span className="font-sans font-extrabold text-sm uppercase tracking-wider not-italic text-[#1A1A1A]">AI</span>
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]/20">
                    ED. 2026
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#1A1A1A]/60 hidden sm:block">
                  Evaluated Answer Sheet Archive
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs uppercase tracking-wider font-semibold">
            {navLinks.slice(0, 6).map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`pb-1 transition-all ${
                    active
                      ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A]'
                      : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] border-b-2 border-transparent hover:border-[#1A1A1A]/40'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-[#EFECE6] hover:bg-[#E8E4DC] text-[#1A1A1A] border border-[#1A1A1A]/20 transition-colors"
                title="Switch persona for evaluation and portal demonstration"
              >
                {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
                  <Shield className="w-3.5 h-3.5 text-rose-700" />
                ) : user?.role === 'INSTITUTE_ADMIN' ? (
                  <Building2 className="w-3.5 h-3.5 text-blue-800" />
                ) : user?.isPermanentFree ? (
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-emerald-800" />
                )}
                <span>
                  {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
                    ? 'Admin View'
                    : user?.role === 'INSTITUTE_ADMIN'
                    ? 'Institute View'
                    : user?.isPermanentFree
                    ? 'VIP Student'
                    : 'Student View'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#1A1A1A]/60" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#1A1A1A] shadow-xl p-1.5 z-50">
                  <div className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest px-2 py-1 border-b border-[#1A1A1A]/10 mb-1">
                    Persona Index
                  </div>
                  <button
                    onClick={() => {
                      switchRole('STUDENT');
                      setRoleDropdownOpen(false);
                      onNavigate('/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs hover:bg-[#EFECE6] text-left text-[#1A1A1A]"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-emerald-800" />
                      <span>Student (2 Free)</span>
                    </span>
                    {user?.role === 'STUDENT' && !user.isPermanentFree && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      await switchRole('STUDENT');
                      setRoleDropdownOpen(false);
                      onNavigate('/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs hover:bg-[#EFECE6] text-left text-[#1A1A1A]"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-700" />
                      <span>Permanent VIP Free</span>
                    </span>
                    {user?.isPermanentFree && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('INSTITUTE_ADMIN');
                      setRoleDropdownOpen(false);
                      onNavigate('/institute/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs hover:bg-[#EFECE6] text-left text-[#1A1A1A]"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-800" />
                      <span>Institute Admin</span>
                    </span>
                    {user?.role === 'INSTITUTE_ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-800" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('SUPER_ADMIN');
                      setRoleDropdownOpen(false);
                      onNavigate('/admin/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs hover:bg-[#EFECE6] text-left text-[#1A1A1A]"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-800" />
                      <span>Super Admin</span>
                    </span>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-800" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Credit & Free Count Status Badge */}
            {user && (
              <button
                onClick={() => onNavigate('/credits')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#EFECE6] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-all text-[#1A1A1A]"
              >
                {user.isPermanentFree ? (
                  <>
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-amber-800">VIP Unlimited Free</span>
                  </>
                ) : user.instituteId ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-blue-800" />
                    <span className="text-blue-900">Institute Sponsored</span>
                  </>
                ) : user.freeEvaluationsLimit - user.freeEvaluationsUsed > 0 ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                    <span className="text-emerald-900">
                      {user.freeEvaluationsLimit - user.freeEvaluationsUsed} Free Left
                    </span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span className="text-[#1A1A1A]">{user.purchasedCredits} Credits</span>
                  </>
                )}
              </button>
            )}

            {/* Notifications Popover */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:bg-[#EFECE6] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#1A1A1A] rounded-full" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#1A1A1A] shadow-xl p-3 z-50 text-[#1A1A1A]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/15 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Bulletins</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[10px] uppercase font-bold text-[#1A1A1A]/70 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#1A1A1A]/60 text-center py-4 font-serif italic">No notices filed yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 text-xs ${
                              n.read ? 'bg-[#F9F8F6] text-[#1A1A1A]/70' : 'bg-[#EFECE6] text-[#1A1A1A] border-l-2 border-[#1A1A1A]'
                            }`}
                          >
                            <p className="font-bold text-[#1A1A1A]">{n.title}</p>
                            <p className="text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main CTA */}
            <button
              onClick={() => onNavigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#1A1A1A] transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Evaluate Sheet</span>
            </button>

            {/* Portal Direct Shortcut */}
            {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
              <button
                onClick={() => onNavigate('/admin/dashboard')}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200 transition-colors"
              >
                Admin Panel
              </button>
            ) : user?.role === 'INSTITUTE_ADMIN' ? (
              <button
                onClick={() => onNavigate('/institute/dashboard')}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200 transition-colors"
              >
                Institute Portal
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-3 py-1.5 text-xs font-semibold bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]/30 hover:bg-[#E8E4DC] transition-colors"
              >
                Dashboard
              </button>
            )}

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-center text-xs font-serif font-bold hover:bg-[#2A2A2A] transition-colors"
                >
                  {user.name.charAt(0)}
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#FFFFFF] border border-[#1A1A1A] shadow-xl p-2 z-50 text-[#1A1A1A]">
                    <div className="px-3 py-2 border-b border-[#1A1A1A]/15 mb-1">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#1A1A1A]/60 truncate font-mono">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/profile');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1A1A1A]/80 hover:bg-[#EFECE6]"
                    >
                      Profile & Subjects
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/evaluations');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1A1A1A]/80 hover:bg-[#EFECE6]"
                    >
                      Evaluation History
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/contact');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1A1A1A]/80 hover:bg-[#EFECE6]"
                    >
                      Support Desk
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        onNavigate('/login');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 mt-1 border-t border-[#1A1A1A]/10 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('/login')}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] hover:underline"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('/upload')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] bg-[#1A1A1A]"
            >
              Evaluate
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1A1A1A] hover:bg-[#EFECE6]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1A1A1A] bg-[#F9F8F6] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-semibold bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]/20 text-center"
            >
              Student Dashboard
            </button>
            <button
              onClick={() => {
                onNavigate('/institute/dashboard');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 text-center"
            >
              Institute Portal
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-left text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:bg-[#EFECE6]"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between text-xs text-[#1A1A1A]/70">
            <span>Signed: <strong className="text-[#1A1A1A]">{user?.name || 'Guest'}</strong></span>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  onNavigate('/login');
                }}
                className="text-rose-700 font-bold uppercase tracking-wider text-[11px]"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="text-[#1A1A1A] font-bold uppercase tracking-wider text-[11px]"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
