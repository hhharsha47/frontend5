"use client";

import React from "react";
import {
  MessageSquarePlus,
  MessageSquare,
  Trash2,
  History,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Conversation } from "@/hooks/use-chat-history";
import { motion, AnimatePresence } from "framer-motion";

type ChatSidebarProps = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile?: boolean;
};

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
  isOpen,
  setIsOpen,
  isMobile = false,
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "h-full bg-white/80 backdrop-blur-xl border-r border-indigo-50/50 flex flex-col shadow-xl lg:shadow-none z-50 overflow-hidden",
          isMobile ? "fixed inset-y-0 left-0" : "relative shrink-0",
          !isOpen && isMobile && "pointer-events-none"
        )}
      >
        <div className="flex-1 flex flex-col min-w-[280px] overflow-hidden">
          {/* Header */}
          <div className="p-4 space-y-4 shrink-0">
            <button
              onClick={() => {
                onNewChat();
                if (isMobile) setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <MessageSquarePlus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">New Conversation</span>
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 font-medium py-2 rounded-xl transition-colors text-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 pb-20 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center mb-3">
                  <History className="w-6 h-6 opacity-40" />
                </div>
                <p>No history yet</p>
              </div>
            ) : (
              conversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelect(chat.id);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={cn(
                    "group relative flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent",
                    activeId === chat.id
                      ? "bg-white shadow-sm border-indigo-100 ring-1 ring-indigo-50"
                      : "hover:bg-white/60 hover:border-white/60"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors mt-0.5",
                      activeId === chat.id
                        ? "bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20"
                        : "bg-indigo-50 text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                    )}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "font-medium text-sm truncate transition-colors leading-tight mb-1",
                        activeId === chat.id
                          ? "text-slate-900"
                          : "text-slate-600 group-hover:text-slate-900"
                      )}
                    >
                      {chat.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {formatTime(chat.updatedAt)}
                    </p>
                  </div>

                  {activeId === chat.id && (
                    <button
                      onClick={(e) => onDelete(chat.id, e)}
                      className="absolute right-2 top-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer / Branding */}
          <div className="p-4 border-t border-indigo-50/50 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Your chats are saved locally
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
