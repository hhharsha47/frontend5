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

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "text" | "options" | "image";
  options?: { label: string; value: string }[];
};

type OrderState = {
  type?: string;
  scale?: string;
  description?: string;
  email?: string;
};

// --- Animations ---
const chatContainerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    filter: "blur(4px)",
    transition: { duration: 0.2 },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

const optionVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

const typingDotVariants = {
  initial: { y: 0, opacity: 0.4 },
  animate: {
    y: -5,
    opacity: 1,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  },
};

export type ChatbotHandle = {
  triggerAction: (action: string) => void;
};

type ChatbotProps = {
  inline?: boolean;
  initialMessages?: Message[];
  initialMode?: "init" | "order" | "chat";
  initialOrderStep?: number;
  initialOrderData?: OrderState;
  onStateChange?: (state: {
    messages: Message[];
    mode: "init" | "order" | "chat";
    orderStep: number;
    orderData: OrderState;
  }) => void;
};

const Chatbot = React.forwardRef<ChatbotHandle, ChatbotProps>(
  (
    {
      inline = false,
      initialMessages,
      initialMode,
      initialOrderStep,
      initialOrderData,
      onStateChange,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(inline);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>(
      initialMessages || [
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
      ]
    );
    const [mode, setMode] = useState<"init" | "order" | "chat">(
      initialMode || "init"
    );
    const [orderStep, setOrderStep] = useState(initialOrderStep || 0);
    const [orderData, setOrderData] = useState<OrderState>(
      initialOrderData || {}
    );

    // Notify parent of state changes
    useEffect(() => {
      if (onStateChange) {
        onStateChange({
          messages,
          mode,
          orderStep,
          orderData,
        });
      }
    }, [messages, mode, orderStep, orderData, onStateChange]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        chatContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    };

    useEffect(() => {
      // Only auto-scroll if we are NOT inline (popover mode) OR if it's a new message
      // preventing aggressive scroll on mount for inline mode unless necessary
      if (!inline || messages.length > 1) {
        scrollToBottom();
      }
    }, [messages, isTyping, isOpen, inline]);

    // Audio effect helper (optional, placeholder)
    const playSound = (type: "send" | "receive") => {
      // const audio = new Audio(type === 'send' ? '/sounds/pop-up-on.mp3' : '/sounds/pop-up-off.mp3');
      // audio.play().catch(() => {}); // Ignore errors if file not found
    };

    const handleOptionClick = async (option: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content:
          option === "start_order"
            ? "I want to start a custom order"
            : option === "ask_question"
            ? "I have a question"
            : option === "check_status"
            ? "Check Order Status"
            : option === "shipping_policy"
            ? "Shipping Policy"
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
        id: crypto.randomUUID(),
        role: "user",
        content: inputValue,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      playSound("send"); // Fixed lint
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        processResponse(inputValue, true);
        playSound("receive"); // Fixed lint
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
        } else if (input === "check_status") {
          addBotMessage(
            'You can track your order in the "Orders" section of your profile. Alternatively, provide your order ID here.'
          );
        } else if (input === "shipping_policy") {
          addBotMessage(
            "We ship worldwide! Standard shipping takes 5-10 business days, while customized models typically take 2-4 weeks to design and print."
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
          addBotMessage(
            "Hello! How can I help you with SkyScale models today?"
          );
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
          id: crypto.randomUUID(),
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

    React.useImperativeHandle(ref, () => ({
      triggerAction: (action: string) => {
        handleOptionClick(action);
      },
    }));

    return (
      <>
        <div
          className={cn(
            "z-50 flex flex-col items-end pointer-events-none",
            inline
              ? "relative w-full h-full pointer-events-auto"
              : "fixed bottom-6 right-6"
          )}
        >
          <div
            className={cn(
              "pointer-events-auto",
              inline ? "w-full h-full flex flex-col min-h-0" : ""
            )}
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={chatContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "flex flex-col overflow-hidden",
                    inline
                      ? "w-full h-full bg-transparent p-0 shadow-none border-none ring-0"
                      : "mb-6 w-[500px] h-[720px] max-h-[calc(100vh-6rem)] bg-white/60 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl ring-1 ring-white/40"
                  )}
                >
                  {/* Header */}
                  {!inline && (
                    <div className="relative p-5 flex items-center justify-between shrink-0 z-10">
                      <div className="absolute inset-0 bg-linear-to-b from-white/50 to-transparent pointer-events-none" />
                      <div className="relative flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20" />
                          <div className="relative w-11 h-11 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-slate-800 font-bold text-base tracking-tight">
                            Concierge
                          </h3>
                          <p className="text-indigo-600/80 text-xs font-semibold tracking-wide">
                            AI Assistance
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="relative p-2.5 bg-white/50 hover:bg-white hover:shadow-md text-slate-400 hover:text-slate-600 rounded-full transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Messages Area */}
                  <div
                    ref={chatContainerRef}
                    className="relative flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 scrollbar-thin scrollbar-thumb-indigo-200/50 scrollbar-track-transparent hover:scrollbar-thumb-indigo-300/80 transition-colors"
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={cn(
                          "flex w-full gap-4",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "bot" && (
                          <div className="w-9 h-9 rounded-2xl bg-white/80 border border-white/50 shadow-sm flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                          </div>
                        )}

                        <div className="flex flex-col gap-2 max-w-[85%]">
                          <div
                            className={cn(
                              "group relative px-6 py-3.5 text-sm md:text-base leading-relaxed shadow-sm transition-all duration-300",
                              msg.role === "bot"
                                ? "bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl rounded-tl-sm border border-white/60 hover:shadow-md"
                                : "bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white rounded-3xl rounded-tr-sm shadow-indigo-500/20 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30"
                            )}
                          >
                            <p className="whitespace-pre-wrap font-medium">
                              {msg.content}
                            </p>
                          </div>

                          {/* Options rendering */}
                          {msg.type === "options" && msg.options && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {msg.options.map((opt, idx) => (
                                <motion.button
                                  key={opt.value}
                                  custom={idx}
                                  variants={optionVariants}
                                  initial="hidden"
                                  animate="visible"
                                  onClick={() =>
                                    handleOptionClick(
                                      opt.value === "init"
                                        ? "ask_question"
                                        : opt.value
                                    )
                                  }
                                  className="group flex items-center gap-2 text-xs font-semibold bg-white/50 hover:bg-white text-indigo-700 px-4 py-2.5 rounded-xl transition-all border border-white/60 hover:border-indigo-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                  {opt.label}
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>

                        {msg.role === "user" && (
                          <div className="w-9 h-9 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 mt-auto opacity-80">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex justify-start gap-4"
                      >
                        <div className="w-9 h-9 rounded-2xl bg-white/80 border border-white/50 shadow-sm flex items-center justify-center shrink-0 mt-1">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl rounded-tl-sm border border-white/50 shadow-sm flex items-center gap-1.5 h-12">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              variants={typingDotVariants}
                              initial="initial"
                              animate="animate"
                              transition={{ delay: i * 0.15 }} // Staggered start
                              className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="w-full shrink-0 pb-8 pt-4 px-4 bg-linear-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pointer-events-none sticky bottom-0 z-20">
                    <div className="pointer-events-auto relative flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-white/60 p-2.5 shadow-xl shadow-indigo-500/10 ring-1 ring-white/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300 max-w-3xl mx-auto rounded-full hover:shadow-2xl hover:shadow-indigo-500/15 hover:bg-white/90">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={
                          mode === "order"
                            ? "Type your answer..."
                            : "Ask anything..."
                        }
                        className="flex-1 bg-transparent border-none pl-5 py-3 focus:outline-none text-base text-slate-800 placeholder:text-slate-400 font-medium"
                        disabled={
                          mode === "order" && [1, 2].includes(orderStep)
                        }
                      />
                      <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className={cn(
                          "p-2.5 rounded-2xl transition-all flex items-center justify-center",
                          inputValue.trim()
                            ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:scale-105 active:scale-95"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        )}
                      >
                        <Send
                          className="w-4 h-4"
                          fill={inputValue.trim() ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    {!inline && (
                      <div className="flex justify-center mt-3">
                        <p className="text-[10px] text-slate-400/80 font-semibold tracking-wider flex items-center gap-1.5">
                          Powered by{" "}
                          <span className="text-indigo-500">SkyAI</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!inline && (
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group pointer-events-auto relative flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-600/50 transition-all z-50"
            >
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-7 h-7" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <MessageCircle className="w-7 h-7" />
                  </motion.div>
                )}
              </AnimatePresence>

              {!isOpen && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white"></span>
                </span>
              )}
            </motion.button>
          )}
        </div>
      </>
    );
  }
);
Chatbot.displayName = "Chatbot";

export default Chatbot;
