"use client";

import Chatbot, { ChatbotHandle } from "@/components/Chatbot";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import { ChatSidebar } from "@/components/ChatSidebar";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useCallback } from "react";

export default function ChatbotPage() {
  const chatbotRef = useRef<ChatbotHandle>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    conversations,
    activeId,
    selectChat,
    deleteChat,
    createNewChat,
    updateChat,
    getActiveConversation,
    isLoaded,
  } = useChatHistory();

  const activeConversation = getActiveConversation();

  const handleStateChange = useCallback(
    (state: {
      messages?: any[];
      mode?: any;
      orderStep?: number;
      orderData?: any;
    }) => {
      if (activeConversation?.id) {
        updateChat(activeConversation.id, state);
      }
    },
    [updateChat, activeConversation?.id]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-indigo-600 font-medium">
          <Sparkles className="w-5 h-5 animate-spin" />
          Loading your concierge...
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      {/* Background Decor - Deeper, richer tones for premium feel */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#FAFAFA]" />
      <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-blue-50/50 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:block h-full">
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={selectChat}
            onDelete={deleteChat}
            onNewChat={createNewChat}
            isOpen={true}
            setIsOpen={() => {}}
          />
        </div>

        {/* Mobile Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={selectChat}
          onDelete={deleteChat}
          onNewChat={createNewChat}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isMobile={true}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Chat Area */}
          <div className="flex-1 min-h-0 flex flex-col relative w-full h-full">
            {activeConversation && (
              <Chatbot
                ref={chatbotRef}
                inline={true}
                key={activeConversation.id} // Forces reset on switch
                initialMessages={activeConversation.messages}
                initialMode={activeConversation.mode}
                initialOrderStep={activeConversation.orderStep}
                initialOrderData={activeConversation.orderData}
                onStateChange={handleStateChange}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
