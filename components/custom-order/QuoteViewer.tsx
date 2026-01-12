"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  FileText,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { acceptQuote, rejectQuote } from "@/app/actions/custom-order";

interface Quote {
  id: number;
  amount: number;
  currency: string;
  timeline: string;
  validUntil: string;
  scopeOfWork: string[];
  terms: string;
}

interface QuoteViewerProps {
  quote: Quote;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export default function QuoteViewer({
  quote,
  onClose,
  onStatusUpdate,
}: QuoteViewerProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Confetti Effect for Acceptance
  const triggerConfetti = () => {
    // Simple visual feedback instead of external lib
    toast.success("Correct! Confetti!");
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const result = await acceptQuote(quote.id);
      if (result.success) {
        triggerConfetti();
        toast.success("Offer accepted! Preparing invoice...", {
          duration: 5000,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Let animations play
        onStatusUpdate();
        onClose();
      } else {
        toast.error("Failed to accept quote. Please try again.");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for the revision request");
      return;
    }

    setIsRejecting(true);
    try {
      const result = await rejectQuote(quote.id, rejectReason);
      if (result.success) {
        toast.info("Revision request sent to admin");
        onStatusUpdate();
        onClose();
      }
    } catch (e) {
      toast.error("Error sending request");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal Card - Glassmorphism */}
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden scale-100 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ring-1 ring-black/5">
        {/* Header with Premium Gradient */}
        <div className="relative h-32 bg-linear-to-r from-slate-900 to-indigo-900 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 p-12 bg-indigo-500/30 blur-[60px] rounded-full w-40 h-40"></div>
          <div className="absolute bottom-0 left-0 p-12 bg-emerald-500/20 blur-[60px] rounded-full w-40 h-40"></div>

          <div className="relative z-10 text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Official Offer
            </span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Project Proposal
            </h2>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-8 bg-linear-to-t from-white/90 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Price & Timeline Hero */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-4">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Estimate
              </p>
              <div className="flex items-start justify-center text-slate-900">
                <span className="text-3xl font-bold mt-1.5 opacity-60">$</span>
                <span className="text-6xl font-display font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-slate-800 to-slate-600">
                  {quote.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="h-16 w-px bg-slate-200 hidden md:block"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Timeline
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {quote.timeline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Valid Until
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scope of Work */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-600" />
              Scope of Work
            </h3>
            <ul className="space-y-3">
              {quote.scopeOfWork.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex gap-3 text-slate-700 text-sm leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Terms Disclaimer */}
          <div className="flex gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-xs text-indigo-900/80 leading-relaxed font-medium">
              <span className="font-bold text-indigo-900 block mb-1">
                Terms & Conditions Apply
              </span>
              {quote.terms}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative p-6 bg-slate-50/80 border-t border-slate-200/60 backdrop-blur-md flex flex-col items-center gap-4">
          <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between z-10">
            {!showRejectForm ? (
              <>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="text-slate-500 hover:text-slate-800 font-bold text-sm px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Changes
                </button>

                <button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ring-1 ring-white/20"
                >
                  {isAccepting ? (
                    "Processing..."
                  ) : (
                    <>
                      Accept Offer{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    Request Revision
                  </h4>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="What would you like to change? (e.g. Budget constraints, different timeline...)"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  rows={2}
                />
                <button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="w-full py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors text-sm"
                >
                  {isRejecting ? "Sending Request..." : "Submit Request"}
                </button>
              </div>
            )}
          </div>

          {/* Secure Transaction Badge - Now Inside Footer */}
          <div className="bg-emerald-100/50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Transaction via Stripe Escrow
          </div>
        </div>
      </div>
    </div>
  );
}
