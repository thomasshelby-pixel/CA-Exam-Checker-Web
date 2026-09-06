import React, { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Shield, Sparkles, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { PricingPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [activePaymentModal, setActivePaymentModal] = useState<{
    orderId: string;
    amountINR: number;
    evaluationsCount: number;
    planName: string;
  } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPricing()
      .then((res) => {
        setPlans(res.plans);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (plan: PricingPlan) => {
    if (plan.priceINR === 0) {
      onNavigate('/upload');
      return;
    }

    if (!user) {
      onNavigate('/login');
      return;
    }

    setProcessingPlanId(plan.id);
    try {
      const res = await api.createOrder(plan.id);
      setActivePaymentModal({
        orderId: res.order.id,
        amountINR: res.order.amountINR,
        evaluationsCount: res.order.evaluationsCount,
        planName: res.order.planName,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to initiate purchase');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleConfirmMockGatewayPayment = async () => {
    if (!activePaymentModal) return;
    try {
      const mockGatewayRef = `UPI_REF_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const result = await api.verifyPayment(activePaymentModal.orderId, mockGatewayRef);
      setActivePaymentModal(null);
      setSuccessMsg(`Payment of ₹${result.order.amountINR} verified! ${result.creditsAdded} credits added to your account.`);
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Payment verification failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 block">Transparent & Affordable</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1A1A]">
          Predictable Pricing for CA Aspirants
        </h1>
        <p className="text-[#1A1A1A]/70 text-sm max-w-xl mx-auto font-sans">
          Evaluate your answer sheets with verified examiner step marking. First 2 sheets free; ₹100 for 10 sheets afterwards.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#EFECE6] border border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold flex items-center justify-between">
          <span>{successMsg}</span>
          <button
            onClick={() => onNavigate('/upload')}
            className="px-4 py-1.5 bg-[#1A1A1A] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider"
          >
            Evaluate Now
          </button>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isStandard = plan.id === 'plan-standard-10';
          return (
            <div
              key={plan.id}
              className={`p-8 space-y-6 relative transition-all flex flex-col justify-between ${
                isStandard
                  ? 'bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-xl z-10'
                  : 'bg-[#FFFFFF] border border-[#1A1A1A]'
              }`}
            >
              {isStandard && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#1A1A1A] text-[#F9F8F6] font-mono font-bold text-[10px] tracking-widest uppercase">
                  Most Popular for Students
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">{plan.name}</h3>
                  <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-bold text-[#1A1A1A]">
                    ₹{plan.priceINR}
                  </span>
                  {plan.priceINR > 0 && (
                    <span className="text-xs text-[#1A1A1A]/60 font-mono">
                      / {plan.evaluationsCount} sheets
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#1A1A1A]/80 font-mono">
                  {plan.priceINR === 0
                    ? 'Complimentary on signup'
                    : `Just ₹${(plan.priceINR / plan.evaluationsCount).toFixed(0)} per full answer sheet`}
                </div>

                <ul className="space-y-3 pt-4 border-t border-[#1A1A1A]/10 text-xs text-[#1A1A1A] font-sans">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={processingPlanId === plan.id}
                className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors border border-[#1A1A1A] ${
                  isStandard
                    ? 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F8F6]'
                    : 'bg-[#F9F8F6] hover:bg-[#EFECE6] text-[#1A1A1A]'
                }`}
              >
                {processingPlanId === plan.id
                  ? 'Initiating...'
                  : plan.priceINR === 0
                  ? 'Get 2 Free Evaluations'
                  : `Get ${plan.evaluationsCount} Sheets for ₹${plan.priceINR}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Confirmation Modal */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#1A1A1A] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1A1A1A]" />
                <h3 className="font-serif font-bold text-[#1A1A1A] text-base">Secure Payment Gateway</h3>
              </div>
              <span className="text-[9px] uppercase font-mono font-bold text-[#1A1A1A] bg-[#EFECE6] border border-[#1A1A1A] px-2 py-0.5">
                Server-Verified
              </span>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Plan:</span>
                <span className="text-[#1A1A1A] font-semibold">{activePaymentModal.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Credits to Allocate:</span>
                <span className="text-[#1A1A1A] font-mono font-bold">{activePaymentModal.evaluationsCount} Sheets</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Amount to Pay:</span>
                <span className="text-[#1A1A1A] font-serif font-bold text-lg">₹{activePaymentModal.amountINR}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#1A1A1A]/60">Order Reference:</span>
                <span className="font-mono text-[#1A1A1A]/80">{activePaymentModal.orderId}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F9F8F6] border border-[#1A1A1A]/20 text-[11px] text-[#1A1A1A]/70 space-y-1 font-sans">
              <p className="font-bold text-[#1A1A1A] font-mono uppercase text-[10px]">Supported Methods:</p>
              <p>UPI (Google Pay, PhonePe, Paytm), Net Banking, RuPay/Visa/MasterCard Debit & Credit.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActivePaymentModal(null)}
                className="w-1/2 py-2.5 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMockGatewayPayment}
                className="w-1/2 py-2.5 bg-[#1A1A1A] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Simulate Pay ₹{activePaymentModal.amountINR}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
