import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './components/public/HomePage';
import {
  FeaturesPage,
  HowItWorksPage,
  AboutPage,
  FaqPage,
  LegalPage,
} from './components/public/PublicSubPages';
import { PricingPage } from './components/public/PricingPage';
import { ContactPage } from './components/public/ContactPage';
import { LoginPage, RegisterPage } from './components/public/AuthPages';

// Student Pages
import { StudentDashboard } from './components/student/StudentDashboard';
import { EvaluationUpload } from './components/student/EvaluationUpload';
import { EvaluationReportView } from './components/student/EvaluationReportView';
import {
  EvaluationHistory,
  CreditLedgerView,
  StudentAnalytics,
  StudentProfile,
} from './components/student/StudentSubPages';

// Portals
import { InstitutePortal } from './components/institute/InstitutePortal';
import { AdminPortal } from './components/admin/AdminPortal';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReport = (reportId: string) => {
    setActiveReportId(reportId);
    navigate(`/report/${reportId}`);
  };

  // Render current view
  const renderView = () => {
    // 1. Specific Report View
    if (currentPath.startsWith('/report/') || activeReportId) {
      const id = activeReportId || currentPath.replace('/report/', '');
      return (
        <EvaluationReportView
          reportId={id}
          onBack={() => navigate('/dashboard')}
          onEvaluateAnother={() => navigate('/upload')}
        />
      );
    }

    // 2. Auth Guards for restricted views
    if (currentPath === '/admin') {
      if (!isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'INSTITUTE_ADMIN')) {
        return <LoginPage onNavigate={navigate} />;
      }
      return <AdminPortal onNavigate={navigate} />;
    }

    if (currentPath === '/institute') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return <InstitutePortal onNavigate={navigate} />;
    }

    if (currentPath === '/upload') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return (
        <EvaluationUpload
          onNavigate={navigate}
          onEvaluationComplete={handleViewReport}
        />
      );
    }

    if (currentPath === '/dashboard') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return (
        <StudentDashboard
          onNavigate={navigate}
          onViewReport={handleViewReport}
        />
      );
    }

    if (currentPath === '/evaluations') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return (
        <EvaluationHistory
          onNavigate={navigate}
          onViewReport={handleViewReport}
        />
      );
    }

    if (currentPath === '/credits') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return <CreditLedgerView onNavigate={navigate} />;
    }

    if (currentPath === '/analytics') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return <StudentAnalytics onNavigate={navigate} />;
    }

    if (currentPath === '/profile') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} />;
      }
      return <StudentProfile onNavigate={navigate} />;
    }

    // 3. Public views
    switch (currentPath) {
      case '/features':
        return <FeaturesPage onNavigate={navigate} />;
      case '/how-it-works':
        return <HowItWorksPage onNavigate={navigate} />;
      case '/pricing':
        return <PricingPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/faq':
        return <FaqPage onNavigate={navigate} />;
      case '/legal':
        return <LegalPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#1A1A1A] selection:text-[#F9F8F6]">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-grow">{renderView()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
