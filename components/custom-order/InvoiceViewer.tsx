"use client";

import { useState } from "react";
import {
  Receipt,
  Download,
  CreditCard,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { processPayment } from "@/app/actions/custom-order";

interface InvoiceItem {
  desc: string;
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  createdAt: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "unpaid" | "paid";
  paidAt?: string;
  paymentMethod?: string;
}

interface InvoiceViewerProps {
  orderId: string;
  invoice: Invoice;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function InvoiceViewer({
  orderId,
  invoice,
  onClose,
  onPaymentSuccess,
}: InvoiceViewerProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await processPayment(orderId, "Credit Card (Mock)");
      if (res.success) {
        toast.success("Payment successful! Order moved to production.");
        onPaymentSuccess();
        onClose();
      } else {
        toast.error(res.error || "Payment failed");
      }
    } catch (e) {
      toast.error("An error occurred during payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Invoice Card */}
      <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden scale-100 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="flex justify-between items-start p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Invoice
              </h2>
              <p className="text-sm text-slate-500 font-mono mt-0.5">
                #{invoice.id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                invoice.status === "paid"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {invoice.status === "paid" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {invoice.status}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Issued: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Bill To / From */}
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Bill To
              </p>
              <p className="font-bold text-slate-900">Valued Customer</p>
              <p className="text-sm text-slate-500">customer@example.com</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pay To
              </p>
              <div className="flex items-center md:justify-end gap-2 text-slate-900 font-bold">
                <Building2 className="w-4 h-4 text-slate-400" />
                SkyScale Models
              </div>
              <p className="text-sm text-slate-500">finance@skyscale.com</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="border rounded-xl overflow-hidden border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-4 text-slate-900 font-medium">
                      {item.desc}
                    </td>
                    <td className="p-4 text-center text-slate-500">
                      {item.qty}
                    </td>
                    <td className="p-4 text-right text-slate-900">
                      ${item.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/50 font-bold">
                <tr>
                  <td colSpan={2} className="p-4 text-right text-slate-500">
                    Subtotal
                  </td>
                  <td className="p-4 text-right text-slate-900">
                    ${invoice.subtotal.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-4 text-right text-slate-500">
                    Tax (10%)
                  </td>
                  <td className="p-4 text-right text-slate-900">
                    ${invoice.tax.toLocaleString()}
                  </td>
                </tr>
                <tr className="text-lg bg-slate-100/50">
                  <td colSpan={2} className="p-4 text-right text-slate-900">
                    Total
                  </td>
                  <td className="p-4 text-right text-indigo-600">
                    ${invoice.total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => toast.success("Invoice PDF downloaded")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-bold px-4 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-bold hover:bg-white hover:shadow-sm rounded-xl transition-all"
            >
              Close
            </button>
            {invoice.status === "unpaid" && (
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Pay Now $
                    {invoice.total.toLocaleString()}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
