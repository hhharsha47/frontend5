"use client";

import Chatbot, { ChatbotHandle } from "@/components/Chatbot";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Plus,
  Package,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ChatbotPage() {
  const chatbotRef = useRef<ChatbotHandle>(null);
  return (
    <main className="bg-slate-50 min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-linear-to-b from-indigo-50 to-slate-50 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[10%] left-[-10%] w-[30vw] h-[30vw] bg-violet-200/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 relative z-10 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 hover:border-indigo-200 font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">
                Concierge
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                AI Assistance
              </p>
            </div>
          </div>
        </header>

        {/* Chat Layout */}
        <div className="flex-1 flex gap-8 relative z-10 min-h-0 pb-8">
          {/* Context Sidebar (Desktop) */}
          <div className="hidden lg:block w-72 shrink-0 space-y-6 pt-4">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-lg shadow-slate-200/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
                Concierge Actions
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: <Plus className="w-5 h-5 text-white" />,
                    label: "Start New Order",
                    desc: "Custom commission",
                    action: "start_order",
                    gradient: "from-indigo-500 to-violet-600",
                    shadow: "shadow-indigo-500/20",
                  },
                  {
                    icon: <Package className="w-5 h-5 text-white" />,
                    label: "Track Order",
                    desc: "Check status",
                    action: "check_status",
                    gradient: "from-emerald-400 to-teal-500",
                    shadow: "shadow-emerald-500/20",
                  },
                  {
                    icon: <HelpCircle className="w-5 h-5 text-white" />,
                    label: "Shipping Info",
                    desc: "Policy & rates",
                    action: "shipping_policy",
                    gradient: "from-amber-400 to-orange-500",
                    shadow: "shadow-amber-500/20",
                  },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    onClick={() =>
                      chatbotRef.current?.triggerAction(item.action)
                    }
                    className="w-full group relative flex items-center gap-4 p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-left overflow-hidden"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-md ${item.shadow} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0 z-10">
                      <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-900 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {item.desc}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-sm border border-slate-100">
                      <ChevronRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="font-bold text-lg mb-2">Need a Human?</p>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                  Our master modelers are available for complex consultations.
                </p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-lg text-sm font-semibold transition-colors">
                  Request Callback
                </button>
              </div>
            </div>
          </div>

          {/* Chatbot Container */}
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 relative">
            <Chatbot ref={chatbotRef} inline={true} />
          </div>
        </div>
      </div>
    </main>
  );
}
