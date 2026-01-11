"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Mail,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  List,
  Send,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCustomOrderDetails,
  updateCustomOrderStatus,
} from "@/app/actions/custom-order";
import QuestionnaireBuilder from "@/components/admin/QuestionnaireBuilder";
import { cn } from "@/lib/utils";

// Helper for status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "enquiry_received":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "pending_admin_review":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "questionnaire_sent":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusLabel = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function CustomOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionnaireBuilder, setShowQuestionnaireBuilder] =
    useState(false);
  const { id } = use(params);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getCustomOrderDetails(id);
        if (data) {
          setOrder(data);
        } else {
          toast.error("Order not found");
          // In real app, redirect or show 404
        }
      } catch (error) {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const result = await updateCustomOrderStatus(id, newStatus);
      if (result.success) {
        setOrder((prev: any) => ({ ...prev, status: newStatus }));
        toast.success(`Status updated to ${getStatusLabel(newStatus)}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-indigo-600 font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Questionnaire Builder Modal */}
      {showQuestionnaireBuilder && (
        <QuestionnaireBuilder
          orderId={id}
          onClose={() => setShowQuestionnaireBuilder(false)}
          onSuccess={() => {
            setShowQuestionnaireBuilder(false);
            setOrder((prev: any) => ({
              ...prev,
              status: "questionnaire_sent",
              questionnaireSent: true,
            }));
          }}
        />
      )}

      {/* Top Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to List
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                {order.orderReference}
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize",
                  getStatusColor(order.status)
                )}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {order.subject}
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              Submitted on {new Date(order.submittedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Contextual Actions based on Phase */}
            {order.status === "enquiry_received" && (
              <button
                onClick={() => handleStatusUpdate("pending_admin_review")}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                Start Review
              </button>
            )}

            {order.status === "pending_admin_review" &&
              !order.questionnaireSent && (
                <button
                  onClick={() => setShowQuestionnaireBuilder(true)}
                  className="px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  Request More Info (Questionnaire)
                </button>
              )}

            {order.status === "questionnaire_sent" && (
              <div className="px-4 py-2 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-100 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Waiting for Customer
              </div>
            )}

            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Stepper (Phase 1 to Phase 2) */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {[
              { id: 1, label: "Enquiry Received", done: true },
              {
                id: 2,
                label: "Admin Review",
                done: order.status !== "enquiry_received",
              },
              {
                id: 3,
                label: "Clarification (Optional)",
                done:
                  order.status === "questionnaire_sent" ||
                  order.status === "questionnaire_completed",
              },
              { id: 4, label: "Quote Sent", done: false },
              { id: 5, label: "In Production", done: false },
            ].map((step, idx, arr) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors",
                    step.done
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-slate-400"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                      step.done
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {step.done ? <CheckCircle className="w-3 h-3" /> : step.id}
                  </div>
                  {step.label}
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      step.done ? "bg-indigo-100" : "bg-slate-100"
                    )}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requirements Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Extracted Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Subject
                  </label>
                  <p className="font-medium text-slate-900">{order.subject}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Estimated Budget
                  </label>
                  <p className="font-medium text-slate-900">{order.budget}</p>
                </div>
              </div>

              {/* Reference Image */}
              <div className="aspect-video relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                {order.image ? (
                  <Image
                    src={order.image}
                    alt="Reference"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Description / Notes
              </label>
              <div className="mt-2 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {order.description}
              </div>
            </div>
          </div>

          {/* Conversation Summary (Placeholder for Phase 1 output) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 opacity-75 grayscale-[0.3]">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              AI Conversation Log
            </h3>
            <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
              Full conversation transcript would appear here.
            </div>
          </div>
        </div>

        {/* Right Column - Client & Meta */}
        <div className="space-y-6">
          {/* Client Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Client Details
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {order.clientName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  {order.clientName}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> New York, USA
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <Mail className="w-4 h-4 text-slate-400" />
                {order.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-400" />
                Joined Jan 2024
              </div>
            </div>

            <button className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
              View Full Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-indigo-900 rounded-2xl shadow-lg shadow-indigo-200 p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

            <h3 className="font-bold text-lg mb-2 relative z-10">Next Steps</h3>
            <p className="text-indigo-200 text-sm mb-6 relative z-10">
              {order.status === "enquiry_received"
                ? "Review the requirements and decide if we need more info."
                : order.status === "pending_admin_review"
                ? "Send a questionnaire to clarify details or proceed to quote."
                : "Waiting for customer response."}
            </p>

            {order.status === "enquiry_received" && (
              <button
                onClick={() => handleStatusUpdate("pending_admin_review")}
                className="w-full py-2.5 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Start Review Process
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon component helper
function MoreHorizontal(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
