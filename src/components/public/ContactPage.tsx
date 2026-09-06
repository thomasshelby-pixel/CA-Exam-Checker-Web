import React, { useState } from 'react';
import { Mail, ExternalLink, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedTicketNumber, setSubmittedTicketNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createSupportTicket({
        name,
        email,
        subject,
        message,
      });
      setSubmittedTicketNumber(res.ticket.ticketNumber);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit support request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Help & Support</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          Contact CA Exam Checker AI
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto font-sans">
          Need assistance with an evaluation report, credit balance, or institute onboarding? We’re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info & Socials */}
        <div className="space-y-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#1A1A1A] space-y-4">
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Direct Channels</h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[#1A1A1A]/60 font-mono uppercase text-[10px]">Official Support Email:</p>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                  <a
                    href="mailto:caexamchecker.support@gmail.com"
                    className="text-[#1A1A1A] font-semibold hover:underline break-all font-mono text-[11px]"
                  >
                    caexamchecker.support@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10">
                <p className="text-[#1A1A1A]/60 font-mono uppercase text-[10px]">Social Community:</p>
                <div className="mt-2">
                  <a
                    href="https://insta.openinapp.co/utw2r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F9F8F6] border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#EFECE6] transition-colors text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    <span>Follow on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#1A1A1A] text-[11px] text-[#1A1A1A]/70 space-y-1 font-sans">
            <p className="font-bold text-[#1A1A1A] font-mono text-[10px] uppercase tracking-wider">Support Hours:</p>
            <p>Monday – Saturday: 9:00 AM – 8:00 PM IST.</p>
            <p>Average ticket response time: Under 4 hours.</p>
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="md:col-span-2 p-8 bg-[#FFFFFF] border border-[#1A1A1A]">
          <h3 className="font-serif font-bold text-[#1A1A1A] text-xl mb-4">Submit a Support Ticket</h3>

          {submittedTicketNumber ? (
            <div className="p-6 bg-[#EFECE6] border border-[#1A1A1A] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#1A1A1A] mx-auto" />
              <h4 className="text-base font-serif font-bold text-[#1A1A1A]">Ticket Submitted Successfully!</h4>
              <p className="text-xs text-[#1A1A1A]/80 font-sans">
                Your ticket reference number is{' '}
                <strong className="text-[#1A1A1A] font-mono text-sm">{submittedTicketNumber}</strong>.
                Our academic support team will review your query and reply to your email address shortly.
              </p>
              <button
                onClick={() => setSubmittedTicketNumber(null)}
                className="mt-2 px-4 py-2 bg-[#1A1A1A] text-xs font-bold uppercase tracking-wider text-[#F9F8F6]"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1A]">Subject / Category</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="e.g. Question on Evaluation Report #eval-123 or Institute Partnership"
                  className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1A]">Your Message / Query Details</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Describe your query, specific paper subject, or question number in detail..."
                  className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#1A1A1A] text-xs text-[#1A1A1A] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6] border border-[#1A1A1A] flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
