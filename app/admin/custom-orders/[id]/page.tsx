"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  MoreHorizontal,
  Paperclip,
  Download,
  Send,
  User,
  Sparkles,
  X,
  List,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Receipt,
  Trash2,
  Calendar,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import QuestionnaireBuilder from "@/components/admin/QuestionnaireBuilder";
import QuoteBuilder from "@/components/admin/QuoteBuilder";
import { toast } from "sonner";
import {
  getOrderQuestionnaires,
  getQuotesForOrder,
  generateInvoice,
} from "@/app/actions/custom-order";

// Mock Data (in a real app, this would be fetched based on ID)
const MOCK_ORDER_DETAILS = {
  id: "CO-2024-001",
  status: "quote_ready",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "JD",
    history: "3 previous orders",
  },
  requirements: {
    type: "Aircraft",
    scale: "1/48",
    description:
      "F-14A Tomcat Jolly Rogers, clean finish. High visibility markings from VF-84. Fully loaded payload configuration (AIM-54, AIM-7, AIM-9).",
    submittedAt: "Jan 15, 2024",
    budgetRange: "$100 - $150",
    references: [],
  },
  aiConversation: [
    {
      role: "bot",
      content: "Hello! Welcome to SkyScale. How can I assist you today?",
    },
    { role: "user", content: "I want to start a custom order" },
    { role: "user", content: "I want to start a custom order" },
  ],
  invoice: null as any, // Placeholder for type inference
};

const STEPS = [
  {
    id: "enquiry_received",
    label: "Enquiry Received",
    completed: true,
    date: "Jan 15",
  },
  {
    id: "pending_admin_review",
    label: "Admin Review",
    completed: false,
  },
  { id: "quote_ready", label: "Quote Ready", completed: false },
  { id: "quote_accepted", label: "Quote Accepted", completed: false },
  { id: "in_production", label: "Production", completed: false },
  { id: "shipped", label: "Shipped", completed: false },
];

export default function OrderDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");
  const [order, setOrder] = useState(MOCK_ORDER_DETAILS);
  const [showQuestionnaireBuilder, setShowQuestionnaireBuilder] =
    useState(false);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(false);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [quotes, setQuotes] = useState<any[]>([]);

  React.useEffect(() => {
    const findOrder = () => {
      try {
        const stored = localStorage.getItem("mock_custom_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find(
            (o: any) => o.id === params.id || o.orderReference === params.id
          );

          if (found) {
            const detailShape = {
              id: found.id,
              status: found.status,
              customer: found.customer || {
                name: "Guest User",
                email: found.email,
                avatar: "GU",
                history: "New Customer",
              },
              requirements: {
                type: found.type || found.modelName || "Armor",
                scale: found.scale || "1/72",
                description:
                  found.description || found.requirements?.description,
                submittedAt: found.submittedAt || "Just now",
                budgetRange: found.budget || "Pending Quote",
                references: found.references || [],
              },
              aiConversation: found.aiConversation || [
                {
                  role: "bot",
                  content:
                    "Hello! Welcome to SkyScale. [Transcript Placeholder]",
                },
              ],
            };
            // @ts-ignore
            setOrder(detailShape);
          } else {
            if (params.id === "CO-2024-001") {
              setOrder(MOCK_ORDER_DETAILS);
            }
          }
        }
      } catch (e) {
        console.error("Error loading specific order", e);
      }
    };
    findOrder();
    findOrder();
  }, [params.id]);

  // Fetch Sent Questionnaire if applicable
  React.useEffect(() => {
    const fetchQ = async () => {
      if (
        order.status === "questionnaire_sent" ||
        order.status === "questionnaire_completed"
      ) {
        setLoadingQuestionnaires(true);
        try {
          const qs = await getOrderQuestionnaires(order.id);
          console.log("Fetched Qs:", qs);
          setQuestionnaires(qs || []);

          const fetchedQuotes = await getQuotesForOrder(order.id);
          setQuotes(fetchedQuotes || []);
        } catch (error) {
          console.error("Failed to fetch questionnaires", error);
        } finally {
          setLoadingQuestionnaires(false);
        }
      }
    };
    fetchQ();
  }, [order.id, order.status]);

  /* State for Contact Modal */
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);

  const handleStatusUpdate = (newStatus: string) => {
    // 1. Update local state
    setOrder((prev) => ({ ...prev, status: newStatus }));

    // 2. Persist to localStorage
    try {
      const stored = localStorage.getItem("mock_custom_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        const idx = parsed.findIndex(
          (o: any) => o.id === order.id || o.orderReference === order.id
        );
        if (idx !== -1) {
          parsed[idx].status = newStatus;
          if (newStatus === "questionnaire_sent") {
            parsed[idx].questionnaireSent = true;
          }
          localStorage.setItem("mock_custom_orders", JSON.stringify(parsed));
          window.dispatchEvent(new Event("storage"));
        }
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this order?")) {
      handleStatusUpdate("cancelled");
    }
  };

  const handleSendQuery = () => {
    if (!queryMessage.trim()) return;
    setIsSubmittingQuery(true);

    setTimeout(() => {
      const newMessage = {
        role: "admin",
        content: queryMessage,
        timestamp: new Date().toISOString(),
      };

      const updatedConversation = [...order.aiConversation, newMessage];

      // Update Local State
      setOrder((prev) => ({
        ...prev,
        aiConversation: updatedConversation,
      }));

      // Persist
      try {
        const stored = localStorage.getItem("mock_custom_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          const idx = parsed.findIndex(
            (o: any) => o.id === order.id || o.orderReference === order.id
          );
          if (idx !== -1) {
            parsed[idx].aiConversation = updatedConversation;
            localStorage.setItem("mock_custom_orders", JSON.stringify(parsed));
            window.dispatchEvent(new Event("storage"));
          }
        }
      } catch (e) {
        console.error("Failed to save query", e);
      }

      setIsContactModalOpen(false);
      setQueryMessage("");
      setIsSubmittingQuery(false);
      setActiveTab("chat");
    }, 800);
  };

  const handleGenerateInvoice = async (quote: any) => {
    const res = await generateInvoice(quote.orderId);
    if (res.success) {
      toast.success("Invoice generated successfully");
      // Reload or update local state
      setOrder((prev) => ({ ...prev, invoice: res.invoice }));
    } else {
      toast.error("Failed to generate invoice");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Questionnaire Builder Modal Integration */}
      {showQuestionnaireBuilder && (
        <QuestionnaireBuilder
          orderId={order.id}
          onClose={() => setShowQuestionnaireBuilder(false)}
          onSuccess={() => {
            setShowQuestionnaireBuilder(false);
            handleStatusUpdate("questionnaire_sent");
            toast.success("Questionnaire sent successfully");
          }}
        />
      )}

      {/* Quote Builder Modal (Portal) */}
      {showQuoteBuilder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <QuoteBuilder
              orderId={order.id}
              onSuccess={() => {
                setShowQuoteBuilder(false);
                toast.success("Quote created successfully");
                // Force full reload to ensure data is fresh
                window.location.reload();
              }}
              onCancel={() => setShowQuoteBuilder(false)}
            />
          </div>
        </div>
      )}

      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-6">
        <Link
          href="/admin/custom-orders"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Back to Orders</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                Order {order.id}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === "cancelled"
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}
              >
                {STEPS.find((s) => s.id === order.status)?.label ||
                  order.status}
              </span>
            </div>
            <p className="text-slate-500 flex items-center gap-2 text-sm">
              <Clock className="w-3.5 h-3.5" />
              Submitted {order.requirements.submittedAt}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Phase 2: Start Admin Review Button */}
            {order.status === "enquiry_received" && (
              <button
                onClick={() => handleStatusUpdate("pending_admin_review")}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                Start Review
              </button>
            )}

            {/* Phase 2: Questionnaire Button */}
            {order.status === "pending_admin_review" && (
              <button
                onClick={() => setShowQuestionnaireBuilder(true)}
                className="px-5 py-2.5 bg-white border-2 border-indigo-600 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Request Details
              </button>
            )}

            {order.status !== "cancelled" && (
              <button
                onClick={handleReject}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all shadow-sm"
              >
                Reject Order
              </button>
            )}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4" />
              Contact Customer
            </button>
          </div>
        </div>
      </div>

      {/* Premium Horizontal Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative">
        <div className="flex justify-between items-start relative px-4">
          <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-slate-100 z-0"></div>

          <div
            className="absolute left-6 top-5 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
            style={{
              width: `${
                (STEPS.findIndex((s) => s.id === order.status) /
                  (STEPS.length - 1)) *
                96
              }%`,
            }}
          ></div>

          {STEPS.map((step, idx) => {
            const currentIdx = STEPS.findIndex((s) => s.id === order.status);
            const isCompleted = idx <= currentIdx;
            const isActive = step.id === order.status;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer w-24"
                onClick={() => handleStatusUpdate(step.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
                    isActive
                      ? "bg-indigo-600 border-indigo-100 text-white shadow-xl shadow-indigo-500/40 ring-4 ring-indigo-50 scale-110"
                      : isCompleted
                      ? "bg-indigo-600 border-white text-white shadow-md ring-2 ring-indigo-50"
                      : "bg-white border-slate-100 text-slate-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="text-center">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive
                        ? "text-indigo-700"
                        : isCompleted
                        ? "text-indigo-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Profile */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Customer Profile
              </h3>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-indigo-600 mb-3 border-4 border-white shadow-lg shadow-indigo-500/10">
                {order.customer.avatar}
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {order.customer.name}
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                {order.customer.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Spent
                </p>
                <p className="text-sm font-bold text-slate-900">$1,450</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Orders
                </p>
                <p className="text-sm font-bold text-slate-900">12</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  Customer Since
                </span>
                <span className="font-bold text-slate-700">Dec 2023</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-bold text-slate-700">New York, USA</span>
              </div>
            </div>
          </div>

          {/* --- Phase 3: Quote Section (Moved to Sidebar) --- */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Quotes
              </h3>
              {!showQuoteBuilder && order.status !== "cancelled" && (
                <button
                  onClick={() => setShowQuoteBuilder(true)}
                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                  title="Create New Quote"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-6 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs">No quotes created yet</p>
                <button
                  onClick={() => setShowQuoteBuilder(true)}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
                >
                  Create One
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote: any) => (
                  <div
                    key={quote.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 hover:border-emerald-200 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {quote.amount} {quote.currency}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {quote.timeline} • Ver. {quote.version}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          quote.status === "accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : quote.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>

                    {/* Invoice Button if Accepted */}
                    {quote.status === "accepted" && !order.invoice && (
                      <button
                        onClick={() => handleGenerateInvoice(quote)}
                        className="w-full py-1.5 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Receipt className="w-3 h-3" />
                        Generate Invoice
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Requirements & Chat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "details"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Requirements
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "chat"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Communication Log
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Model Type
                  </label>
                  <div className="text-xl font-display font-bold text-slate-900">
                    {order.requirements.type}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Target Scale
                  </label>
                  <div className="text-xl font-display font-bold text-slate-900">
                    {order.requirements.scale}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Description / Specifics
                  </label>
                  <div className="p-6 bg-slate-50/80 rounded-2xl text-slate-700 leading-relaxed border border-slate-100 shadow-inner">
                    {order.requirements.description}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    AI Estimated Budget
                  </label>
                  <div className="flex items-center gap-3 text-emerald-700 font-bold bg-emerald-50/50 px-5 py-4 rounded-2xl w-full border border-emerald-100/50">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg">
                        {order.requirements.budgetRange}
                      </p>
                      <p className="text-xs text-emerald-600/80 font-medium">
                        Estimated based on complexity and scale
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Reference Attachments
                  </label>
                  {order.requirements.references &&
                  order.requirements.references.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {order.requirements.references.map(
                        (ref: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                          >
                            <img
                              src={ref}
                              alt={`Reference ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <a
                                href={ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white rounded-xl text-slate-900 hover:scale-110 transition-transform shadow-xl"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group">
                      <div className="w-12 h-12 bg-white text-slate-400 rounded-xl border border-slate-200 flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        No References
                      </h4>
                      <p className="text-xs text-slate-500 font-medium max-w-[200px]">
                        Customer did not upload any reference images for this
                        order.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sent Questionnaires Section */}
                {loadingQuestionnaires && (
                  <div className="md:col-span-2 mt-8 pt-8 border-t border-slate-100 flex items-center gap-2 text-slate-500">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">
                      Loading questionnaire details...
                    </span>
                  </div>
                )}

                {!loadingQuestionnaires && questionnaires.length > 0 && (
                  <div className="md:col-span-2 mt-8 pt-8 border-t border-slate-100 space-y-8">
                    {questionnaires.map((qItem: any, idx: number) => (
                      <div key={qItem.id || idx}>
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                              <List className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">
                                {qItem.title || "Sent Questionnaire"}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium">
                                {new Date(qItem.createdAt).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(qItem.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-200 px-2 py-1 rounded bg-slate-50">
                            ID: {qItem.id}
                          </span>
                        </div>

                        <div className="grid gap-3">
                          {qItem.questions.map((q: any, i: number) => {
                            // Determine Icon based on type
                            let TypeIcon = List;
                            if (q.type === "text" || q.type === "textarea")
                              TypeIcon = FileText;
                            if (q.type === "file_upload") TypeIcon = Paperclip; // Or Image if available
                            if (
                              q.type === "single_select" ||
                              q.type === "multiple_select"
                            )
                              TypeIcon = CheckCircle2;

                            // Get Answer from responses map if available
                            const answer = qItem.responses
                              ? qItem.responses[q.id]
                              : null;

                            return (
                              <div
                                key={q.id}
                                className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors shrink-0">
                                    <span className="text-xs font-bold">
                                      {i + 1}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-bold text-slate-900">
                                        {q.text}
                                      </p>
                                      {q.required && (
                                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                          Required
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                      <TypeIcon className="w-3 h-3" />
                                      <span className="uppercase tracking-wider">
                                        {q.type.replace("_", " ")}
                                      </span>
                                    </div>

                                    {/* Show Response if available */}
                                    {answer && (
                                      <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                                        {q.type === "file_upload" ? (
                                          <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm group/file">
                                            {typeof answer === "object" &&
                                            answer.data &&
                                            answer.type?.startsWith(
                                              "image/"
                                            ) ? (
                                              // Image Preview
                                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group-hover/file:ring-2 ring-indigo-500/20 transition-all">
                                                <img
                                                  src={answer.data}
                                                  alt={answer.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            ) : (
                                              // File Icon
                                              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                                                <Paperclip className="w-5 h-5" />
                                              </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-bold text-slate-800 truncate">
                                                {typeof answer === "object"
                                                  ? answer.name
                                                  : typeof answer === "string"
                                                  ? answer
                                                  : "Attached File"}
                                              </p>
                                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                {typeof answer === "object"
                                                  ? answer.type?.split(
                                                      "/"
                                                    )[1] || "FILE"
                                                  : "FILE"}
                                              </p>
                                            </div>

                                            {typeof answer === "object" &&
                                            answer.data ? (
                                              <a
                                                href={answer.data}
                                                download={answer.name}
                                                className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                              >
                                                Download
                                              </a>
                                            ) : (
                                              <button
                                                disabled
                                                className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                                              >
                                                Unavailable
                                              </button>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="text-sm text-slate-700 font-medium bg-white p-3 rounded-md border border-emerald-100/50 shadow-sm whitespace-pre-wrap">
                                            {typeof answer === "object"
                                              ? JSON.stringify(answer)
                                              : answer}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* --- Phase 3: Quote Section --- */}
                {/* --- Phase 3: Quote Section (Duplicate Hidden) --- */}
                <div className="hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        Quote & Negotiation
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Manage price proposals and timeline
                      </p>
                    </div>
                    {!showQuoteBuilder && (
                      <button
                        onClick={() => setShowQuoteBuilder(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        Create New Quote
                      </button>
                    )}
                  </div>

                  {/* Builder Modal (Inline) */}
                  {showQuoteBuilder && (
                    <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                      <QuoteBuilder
                        orderId={order.id}
                        onSuccess={() => {
                          setShowQuoteBuilder(false);
                          window.location.reload(); // Quick refresh to show new quote
                        }}
                        onCancel={() => setShowQuoteBuilder(false)}
                      />
                    </div>
                  )}

                  {/* Quote History */}
                  {quotes.length > 0 ? (
                    <div className="space-y-4">
                      {quotes.map((quote: any) => (
                        <div
                          key={quote.id}
                          className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4 transition-all hover:border-indigo-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-lg ${
                                quote.status === "accepted"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : quote.status === "rejected"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {quote.status === "accepted" ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : quote.status === "rejected" ? (
                                <X className="w-5 h-5" />
                              ) : (
                                <FileText className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-display font-bold text-slate-900 text-lg">
                                  ${quote.amount.toLocaleString()}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                                    quote.status === "accepted"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : quote.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-50 text-blue-600"
                                  }`}
                                >
                                  {quote.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {quote.timeline}
                                </span>
                                <span>•</span>
                                <span>Ver {quote.version}</span>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    quote.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {quote.status === "accepted" && !order.invoice && (
                              <button
                                onClick={async () => {
                                  toast.loading("Generating Invoice...");
                                  const res = await generateInvoice(order.id);
                                  if (res.success) {
                                    toast.success(
                                      "Invoice generated successfully!"
                                    );
                                    window.location.reload();
                                  } else {
                                    toast.error(
                                      res.error || "Failed to generate invoice"
                                    );
                                  }
                                }}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 bg-emerald-50 rounded-lg flex items-center gap-1.5 border border-emerald-100 shadow-sm"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                Generate Invoice
                              </button>
                            )}
                            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 bg-indigo-50 rounded-lg">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !showQuoteBuilder && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300 mb-3 shadow-sm">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          No Quotes Sent Yet
                        </p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                          Create a quote to start the negotiation phase.
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
                {order.aiConversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                        msg.role === "bot"
                          ? "bg-white border-slate-200 text-indigo-600"
                          : msg.role === "admin"
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <Sparkles className="w-5 h-5" />
                      ) : msg.role === "admin" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`flex flex-col max-w-[80%] ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                        {msg.role === "bot"
                          ? "AI Assistant"
                          : msg.role === "admin"
                          ? "Support Agent"
                          : "Customer"}
                      </span>
                      <div
                        className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.role === "bot"
                            ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                            : msg.role === "admin"
                            ? "bg-indigo-600 text-white rounded-tl-sm"
                            : "bg-slate-800 text-white rounded-tr-sm"
                        }`}
                      >
                        {msg.content &&
                        (msg.content.startsWith("data:image") ||
                          msg.content.match(/^https?:\/\//i)) ? (
                          <img
                            src={msg.content}
                            alt="Content"
                            className="max-w-full rounded-lg mix-blend-multiply bg-white"
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Customer Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-slate-900">
                Contact Customer
              </h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 text-indigo-900 text-sm">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <p>
                  Your message will be sent to the customer via email and also
                  added to the order&apos;s communication log.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none text-sm"
                  placeholder="Type your query or update here..."
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="px-5 py-2.5 font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuery}
                disabled={!queryMessage.trim() || isSubmittingQuery}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingQuery ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
