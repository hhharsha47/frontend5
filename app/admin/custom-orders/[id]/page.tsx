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
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  ],
};

const STEPS = [
  {
    id: "enquiry_received",
    label: "Enquiry Received",
    completed: true,
    date: "Jan 15",
  },
  { id: "quote_ready", label: "Quote Ready", completed: true, date: "Today" },
  { id: "quote_accepted", label: "Quote Accepted", completed: false },
  { id: "in_production", label: "Production", completed: false },
  { id: "shipped", label: "Shipped", completed: false },
];

export default function OrderDetailPage() {
  const params = useParams(); // params.id will be available
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");
  const [order, setOrder] = useState(MOCK_ORDER_DETAILS);

  React.useEffect(() => {
    const findOrder = () => {
      try {
        const stored = localStorage.getItem("mock_custom_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find((o: any) => o.id === params.id);

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
                type: found.type || found.modelName,
                scale: found.scale,
                description: found.description,
                submittedAt: found.submittedAt || "Just now",
                budgetRange: found.budget || "Pending Quote",
                references: found.references || [], // Map references
              },
              aiConversation: found.aiConversation || [
                {
                  role: "bot",
                  content:
                    "Hello! Welcome to SkyScale. [Transcript Placeholder]",
                },
                { role: "user", content: found.description },
              ],
            };
            setOrder(detailShape as any);
          } else {
            // Fallback to mock data if ID matches mock ID, otherwise keep default or show error
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
  }, [params.id]);

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
        const idx = parsed.findIndex((o: any) => o.id === order.id);
        if (idx !== -1) {
          parsed[idx].status = newStatus;
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

    // Simulate network delay
    setTimeout(() => {
      const newMessage = {
        role: "admin", // New role for explicit Admin queries
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
          const idx = parsed.findIndex((o: any) => o.id === order.id);
          if (idx !== -1) {
            parsed[idx].aiConversation = updatedConversation;
            // Also update status to "Action Required" if needed, but keeping it simple
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
      setActiveTab("chat"); // Switch to chat to show the new message
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
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
          {/* Connecting Line */}
          <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-slate-100 z-0"></div>

          {/* Progress Line */}
          <div
            className="absolute left-6 top-5 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
            style={{
              width: `${
                (STEPS.findIndex((s) => s.id === order.status) /
                  (STEPS.length - 1)) *
                96
              }%`, // Approx percentage width
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-indigo-600 mb-3 border-4 border-white shadow-lg shadow-indigo-500/10">
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

            <button className="w-full mt-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              View Full CRM Profile
            </button>
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
                            {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                      <div className="w-12 h-12 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">
                        No images uploaded by customer
                      </p>
                    </div>
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
                        <User className="w-5 h-5" /> /* Admin icon */
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
                          // eslint-disable-next-line @next/next/no-img-element
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
                  added to the order&apos;s communication log logs.
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
