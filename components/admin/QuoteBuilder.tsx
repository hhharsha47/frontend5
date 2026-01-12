"use client";

import { useState } from "react";
import { createQuote } from "@/app/actions/custom-order";
import { toast } from "sonner";
import {
  DollarSign,
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";

interface QuoteBuilderProps {
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuoteBuilder({
  orderId,
  onSuccess,
  onCancel,
}: QuoteBuilderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("14 Days"); // Default
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7); // Default 7 days
    return d.toISOString().split("T")[0];
  });
  const [scopeOfWork, setScopeOfWork] = useState<string[]>([""]);
  const [terms, setTerms] = useState(
    "50% advance payment required to start work.\nRemaining 50% before shipping.\nShipping costs calculated separately."
  );

  const handleAddScopeItem = () => {
    setScopeOfWork([...scopeOfWork, ""]);
  };

  const handleRemoveScopeItem = (index: number) => {
    const newScope = [...scopeOfWork];
    newScope.splice(index, 1);
    setScopeOfWork(newScope);
  };

  const handleScopeChange = (index: number, value: string) => {
    const newScope = [...scopeOfWork];
    newScope[index] = value;
    setScopeOfWork(newScope);
  };

  const handleSubmit = async () => {
    if (!amount || !timeline || !validUntil) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createQuote(orderId, {
        amount,
        timeline,
        validUntil,
        scopeOfWork: scopeOfWork.filter((s) => s.trim() !== ""),
        terms,
      });

      if (result.success) {
        toast.success("Quote sent successfully!");
        onSuccess();
      } else {
        toast.error("Failed to send quote");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Create Official Quote
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Structure a professional offer for the customer
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-200/50 rounded-full text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Key Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Price (USD)
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Estimated Timeline
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 2 Weeks"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Validity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Valid Until
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Scope of Work
            </label>
            <button
              onClick={handleAddScopeItem}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {scopeOfWork.map((item, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold shrink-0 mt-2">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleScopeChange(index, e.target.value)}
                  placeholder={`Deliverable item ${index + 1}...`}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                />
                {scopeOfWork.length > 1 && (
                  <button
                    onClick={() => handleRemoveScopeItem(index)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Terms & Conditions
          </label>
          <div className="relative">
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-sm font-medium text-slate-600 leading-relaxed transition-all"
            />
            <div className="absolute right-3 top-3 text-slate-300 pointer-events-none">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Drafting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Send Quote
            </>
          )}
        </button>
      </div>
    </div>
  );
}
