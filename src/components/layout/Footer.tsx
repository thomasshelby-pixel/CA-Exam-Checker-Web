import React from 'react';
import { Shield, Mail, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#F9F8F6] text-[#1A1A1A] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About & Positioning */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center text-[#F9F8F6] font-serif italic font-bold text-sm">
                CA
              </div>
              <span className="font-serif italic font-bold text-[#1A1A1A] text-base tracking-tight">
                CA Exam Checker <span className="font-sans font-extrabold not-italic text-sm">AI</span>
              </span>
            </div>
            <p className="text-[#1A1A1A] font-serif italic leading-relaxed text-[13px]">
              “Get your CA answer sheets evaluated by AI.”
            </p>
            <p className="text-[#1A1A1A]/70 text-[12px] leading-relaxed">
              Upload handwritten CA answer sheets and get question-wise marks, detailed examiner-style feedback, working note analysis, and actionable improvement insights.
            </p>
            {/* Instagram Link per spec */}
            <div className="pt-2">
              <a
                href="https://insta.openinapp.co/utw2r"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EFECE6] border border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#E8E4DC] transition-colors text-xs font-semibold"
              >
                <span>Follow us on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A] pb-1 border-b border-[#1A1A1A]/15">
              Index
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button onClick={() => onNavigate('/features')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  Key Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/for-students')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  For CA Students
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/for-institutes')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  For CA Coaching Institutes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  Transparent Pricing (10 = ₹100)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A] pb-1 border-b border-[#1A1A1A]/15">
              Archive & Trust
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  About CA Exam Checker AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#1A1A1A] hover:underline transition-colors text-[#1A1A1A]/75">
                  Help & Support Center
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Support & ICAI Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A] pb-1 border-b border-[#1A1A1A]/15">
              Official Desk
            </h4>
            <div className="p-3.5 bg-[#EFECE6] border border-[#1A1A1A]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-medium text-[12px]">
                <Mail className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <a
                  href="mailto:caexamchecker.support@gmail.com"
                  className="hover:underline font-mono break-all"
                >
                  caexamchecker.support@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70">
                Official support response SLA: Within 24 hours.
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-start gap-2 p-2.5 bg-[#EFECE6]/60 border border-[#1A1A1A]/15 text-[11px] text-[#1A1A1A]/80">
                <Shield className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> CA Exam Checker AI is an independent technology evaluation platform. We do not claim official ICAI affiliation, endorsement, or certified examiner status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A]/70">
          <p>© 2026 CA Exam Checker AI • Vol. 12 — Digital Evaluation Archive</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-[#1A1A1A] hover:underline">
              Privacy
            </button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-[#1A1A1A] hover:underline">
              Terms
            </button>
            <button onClick={() => onNavigate('/contact')} className="hover:text-[#1A1A1A] hover:underline">
              Inquiry
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
