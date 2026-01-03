"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "text" | "options";
  options?: { label: string; value: string }[];
};

type OrderState = {
  type?: string;
  scale?: string;
  description?: string;
  email?: string;
};

// Animation Variants
const chatContainerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

const typingDotVariants = {
  initial: { y: 0 },
  animate: {
    y: -5,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! Welcome to SkyScale. How can I assist you today?",
      type: "options",
      options: [
        { label: "Start Custom Order", value: "start_order" },
        { label: "Ask a Question", value: "ask_question" },
      ],
    },
  ]);
  const [mode, setMode] = useState<"init" | "order" | "chat">("init");
  const [orderStep, setOrderStep] = useState(0);
  const [orderData, setOrderData] = useState<OrderState>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Audio effect helper (optional, placeholder)
  const playSound = (type: "send" | "receive") => {
    // const audio = new Audio(type === 'send' ? '/sounds/pop-up-on.mp3' : '/sounds/pop-up-off.mp3');
    // audio.play().catch(() => {}); // Ignore errors if file not found
  };

  const handleOptionClick = async (option: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content:
        option === "start_order"
          ? "I want to start a custom order"
          : option === "ask_question"
          ? "I have a question"
          : option,
    };
    setMessages((prev) => [...prev, userMsg]);
    playSound("send");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      processResponse(option);
      playSound("receive");
    }, 1000); // Slightly longer delay for "realism"
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    playSound("send");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      processResponse(inputValue, true);
      playSound("receive");
    }, 1200);
  };

  const processResponse = (input: string, isFreeText: boolean = false) => {
    // 1. INITIAL MODE
    if (mode === "init") {
      if (input === "start_order") {
        setMode("order");
        setOrderStep(1);
        addBotMessage(
          "Great! I can help you create a custom 3D model. First, what type of model are you looking for?",
          "options",
          [
            { label: "Aircraft", value: "aircraft" },
            { label: "Armor/Tank", value: "armor" },
            { label: "Ship", value: "ship" },
            { label: "Sci-Fi/Space", value: "scifi" },
            { label: "Other", value: "other" },
          ]
        );
      } else if (input === "ask_question") {
        setMode("chat");
        addBotMessage(
          "Sure! I can answer questions about shipping, returns, custom orders, or product details. What would you like to know?"
        );
      } else {
        addBotMessage("Please select an option to get started.", "options", [
          { label: "Start Custom Order", value: "start_order" },
          { label: "Ask a Question", value: "ask_question" },
        ]);
      }
      return;
    }

    // 2. ORDER MODE
    if (mode === "order") {
      if (orderStep === 1) {
        // Type
        setOrderData((prev) => ({ ...prev, type: input }));
        setOrderStep(2);
        addBotMessage("Got it. What scale would you prefer?", "options", [
          { label: "1/32", value: "1/32" },
          { label: "1/48", value: "1/48" },
          { label: "1/72", value: "1/72" },
          { label: "Custom/Other", value: "custom" },
        ]);
      } else if (orderStep === 2) {
        // Scale
        setOrderData((prev) => ({ ...prev, scale: input }));
        setOrderStep(3);
        addBotMessage(
          'Understood. Please describe the specific model, variant, or any special details (e.g., "F-14A Tomcat Jolly Rogers").'
        );
      } else if (orderStep === 3) {
        // Description
        setOrderData((prev) => ({ ...prev, description: input }));
        setOrderStep(4);
        addBotMessage(
          "Almost done! Please provide your email address so we can send you a quote."
        );
      } else if (orderStep === 4) {
        // Email
        if (!validateEmail(input)) {
          addBotMessage(
            "That doesn't look like a valid email. Please try again."
          );
          return;
        }
        setOrderData((prev) => ({ ...prev, email: input }));
        setOrderStep(5);
        addBotMessage(
          "Thank you! Your custom order request has been received. Our team will review the details and contact you shortly with a quote."
        );

        setTimeout(() => {
          setMode("init");
          setOrderStep(0);
          setOrderData({});
          addBotMessage(
            "Is there anything else I can help you with?",
            "options",
            [
              { label: "Start Another Order", value: "start_order" },
              { label: "Ask a Question", value: "ask_question" },
            ]
          );
        }, 3000);
      }
      return;
    }

    // 3. CHAT/QUERY MODE
    if (mode === "chat") {
      const lowerInput = input.toLowerCase();

      if (
        checkKeywords(lowerInput, [
          "ship",
          "shipping",
          "delivery",
          "time",
          "long",
        ])
      ) {
        addBotMessage(
          "We ship worldwide! Standard shipping takes 5-10 business days, while customized models typically take 2-4 weeks to design and print."
        );
      } else if (
        checkKeywords(lowerInput, ["return", "refund", "broken", "damage"])
      ) {
        addBotMessage(
          "If your model arrives damaged, please contact us within 48 hours with photos, and we will arrange a replacement free of charge."
        );
      } else if (
        checkKeywords(lowerInput, [
          "price",
          "cost",
          "quote",
          "expensive",
          "cheap",
        ])
      ) {
        addBotMessage(
          "Our prices vary based on the complexity and scale of the model. Custom orders start at $50. You can start a custom order to get a specific quote."
        );
      } else if (
        checkKeywords(lowerInput, ["material", "resin", "plastic", "print"])
      ) {
        addBotMessage(
          "We use high-quality, industrial-grade UV resin for maximum detail and durability."
        );
      } else if (
        checkKeywords(lowerInput, ["track", "order status", "where is my"])
      ) {
        addBotMessage(
          'You can track your order in the "Orders" section of your profile. Alternatively, provide your order ID here and I can check (feature coming soon!).'
        );
      } else if (
        checkKeywords(lowerInput, ["hello", "hi", "hey", "greetings"])
      ) {
        addBotMessage("Hello! How can I help you with SkyScale models today?");
      } else if (
        checkKeywords(lowerInput, [
          "bye",
          "exit",
          "quit",
          "thanks",
          "thank you",
        ])
      ) {
        addBotMessage("You're welcome! Happy modeling.");
        setTimeout(() => setMode("init"), 1500);
      } else {
        addBotMessage(
          "I apologize, but I can only answer questions related to SkyScale models, orders, and shipping. Would you like to start a custom order?",
          "options",
          [
            { label: "Start Custom Order", value: "start_order" },
            { label: "Back to Menu", value: "init" },
          ]
        );
      }
    }
  };

  const addBotMessage = (
    text: string,
    type: "text" | "options" = "text",
    options?: { label: string; value: string }[]
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        content: text,
        type,
        options,
      },
    ]);
  };

  const checkKeywords = (text: string, keywords: string[]) => {
    return keywords.some((keyword) => text.includes(keyword));
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={chatContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-4 w-[380px] h-[600px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
              >
                {/* Header */}
                <div className="relative bg-white/50 backdrop-blur-md p-4 flex items-center justify-between shrink-0 border-b border-indigo-50/50">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-violet-500/10 opacity-50" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-bold text-sm">
                        SkyScale Assistant
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-slate-500 text-xs font-medium">
                          Online
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="relative p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        "flex w-full gap-2",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "bot" && (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-auto">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm backdrop-blur-sm",
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-tr-sm shadow-indigo-500/20"
                            : "bg-white/80 text-slate-700 border border-white/50 rounded-tl-sm shadow-slate-200/50"
                        )}
                      >
                        <p className="leading-relaxed">{msg.content}</p>

                        {/* Options rendering */}
                        {msg.type === "options" && msg.options && (
                          <div className="mt-3 flex flex-col gap-2">
                            {msg.options.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() =>
                                  handleOptionClick(
                                    opt.value === "init"
                                      ? "ask_question"
                                      : opt.value
                                  )
                                }
                                className="w-full text-left text-xs font-medium bg-white/50 hover:bg-white text-indigo-700 px-4 py-3 rounded-xl transition-all border border-indigo-50 hover:border-indigo-200 hover:shadow-sm active:scale-[0.98] flex items-center justify-between group"
                              >
                                {opt.label}
                                <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {msg.role === "user" && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-auto opacity-50">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-auto">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                      </div>
                      <div className="bg-white/80 p-4 rounded-2xl rounded-tl-sm border border-white/50 shadow-sm flex items-center gap-1.5 h-10 w-16 justify-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            variants={typingDotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: i * 0.15 }} // Staggered start
                            className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-indigo-50 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-inner">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder={
                        mode === "order"
                          ? "Type your answer..."
                          : "Ask us anything..."
                      }
                      className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 min-w-0"
                      disabled={mode === "order" && [1, 2].includes(orderStep)}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className={cn(
                        "p-2.5 rounded-full transition-all flex items-center justify-center",
                        inputValue.trim()
                          ? "bg-linear-to-tr from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-center mt-2">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      Powered by{" "}
                      <span className="font-semibold text-indigo-500">
                        SkyAI
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAB */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
