"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Camera,
  Plane,
  CheckCircle,
  Truck,
  ShoppingBag,
  Search,
  Clock,
  X,
  Check,
  Box,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  MapPin,
  HelpCircle,
  FileText,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import QuestionnaireResponder from "@/components/custom-order/QuestionnaireResponder";
import QuoteViewer from "@/components/custom-order/QuoteViewer";
import InvoiceViewer from "@/components/custom-order/InvoiceViewer";
import {
  getPendingQuestionnaire,
  getQuotesForOrder,
  syncOrderUpdates,
} from "@/app/actions/custom-order";

// Mock Data Types
type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface OrderStep {
  label: string;
  date: string;
  completed: boolean;
}

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  steps: OrderStep[];
}

interface PageCustomRequest {
  id: string;
  submittedDate: string;
  title: string;
  description: string;
  estCost: number;
  status:
    | "In Progress"
    | "Quote Ready"
    | "Pending Approval"
    | "Completed"
    | "Action Required"
    | "Cancelled";
  progress: number;
  image: string;
  steps: OrderStep[];
  pricing?: {
    base: number;
    labor: number;
    materials: number;
    shipping: number;
    tax: number;
    total: number;
  };
  aiConversation?: Array<{ role: string; content: string; timestamp?: string }>;
  quote?: any;
  invoice?: any;
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Get active tab from URL or default to 'overview'
  const activeTab = searchParams.get("tab") || "overview";

  const [orderFilter, setOrderFilter] = useState<"active" | "past" | "custom">(
    "custom"
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<PageCustomRequest | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<PageCustomRequest | null>(
    null
  );
  const [selectedInvoice, setSelectedInvoice] =
    useState<PageCustomRequest | null>(null);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<any | null>(
    null
  );

  const [replyInput, setReplyInput] = useState("");

  const handleSendReply = () => {
    if (!selectedRequest || !replyInput.trim()) return;

    try {
      const stored = localStorage.getItem("mock_custom_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((o: any) => {
          if (o.id === selectedRequest.id) {
            const newMsg = {
              role: "user",
              content: replyInput,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            };
            return {
              ...o,
              aiConversation: [...(o.aiConversation || []), newMsg],
            };
          }
          return o;
        });

        localStorage.setItem("mock_custom_orders", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));

        // Update local state immediately for UI responsiveness
        const newConversation = [
          ...(selectedRequest.aiConversation || []),
          {
            role: "user" as const,
            content: replyInput,
          },
        ];
        setSelectedRequest({
          ...selectedRequest,
          aiConversation: newConversation,
        });
        setReplyInput("");
      }
    } catch (e) {
      console.error("Failed to send reply", e);
    }
  };

  const [profileForm, setProfileForm] = useState({
    name: "Alex Pilot",
    email: "alex.pilot@skyscale.com",
    role: "Squadron Leader",
  });

  const user = {
    stats: {
      orders: 12,
      spent: "$1,450",
      saved: 8,
    },
  };

  const orders: Order[] = [
    {
      id: "ORD-9921",
      date: "Jan 2, 2026",
      status: "Shipped",
      total: 129.99,
      trackingNumber: "TRK-8821-XJ",
      items: [
        {
          name: "1/48 F-14 Tomcat Premium",
          image: "/images/products/f14_tomcat_model.png",
          price: 129.99,
          quantity: 1,
        },
      ],
      steps: [
        { label: "Order Placed", date: "Jan 2, 10:00 AM", completed: true },
        { label: "Processing", date: "Jan 2, 2:30 PM", completed: true },
        { label: "Shipped", date: "Jan 3, 9:15 AM", completed: true },
        { label: "Out for Delivery", date: "Est. Jan 5", completed: false },
        { label: "Delivered", date: "Pending", completed: false },
      ],
    },
    {
      id: "CUS-7782",
      date: "Jan 1, 2026",
      status: "Processing",
      total: 450.0,
      items: [
        {
          name: "Custom Build: 1/35 Leopard 2A7+ (Winter Camo)",
          image: "/images/products/m1a2_abrams_model.png",
          price: 450.0,
          quantity: 1,
        },
      ],
      steps: [
        { label: "Request Received", date: "Jan 1, 09:00 AM", completed: true },
        { label: "Consultation", date: "Jan 1, 11:30 AM", completed: true },
        {
          label: "Build In Progress",
          date: "Jan 3, 10:00 AM",
          completed: true,
        },
        { label: "Painting", date: "Pending", completed: false },
        { label: "Final Review", date: "Pending", completed: false },
      ],
    },
    {
      id: "ORD-9925",
      date: "Dec 28, 2025",
      status: "Shipped",
      total: 84.98,
      trackingNumber: "TRK-9925-AA",
      items: [
        {
          name: "T-34/85 Soviet Medium Tank",
          image: "/images/products/t34_85_tank_model.png",
          price: 49.99,
          quantity: 1,
        },
        {
          name: "X-Wing Starfighter",
          image: "/images/products/xwing_model.png",
          price: 34.99,
          quantity: 1,
        },
      ],
      steps: [
        { label: "Order Placed", date: "Dec 28, 2:00 PM", completed: true },
        { label: "Processing", date: "Dec 29, 9:00 AM", completed: true },
        { label: "Shipped", date: "Dec 30, 4:15 PM", completed: true },
        { label: "Out for Delivery", date: "Est. Jan 4", completed: false },
        { label: "Delivered", date: "Pending", completed: false },
      ],
    },
    {
      id: "ORD-9844",
      date: "Dec 15, 2025",
      status: "Delivered",
      total: 45.0,
      items: [
        {
          name: "Weathering Set B",
          image: "/images/products/tiger_tank_model.png", // Using Tiger Tank as placeholder for toolset if specific tool img missing
          price: 35.0,
          quantity: 1,
        },
      ],
      steps: [
        { label: "Order Placed", date: "Dec 15", completed: true },
        { label: "Processing", date: "Dec 16", completed: true },
        { label: "Shipped", date: "Dec 16", completed: true },
        { label: "Delivered", date: "Dec 18", completed: true },
      ],
    },
  ];

  const [customRequests, setCustomRequests] = useState<PageCustomRequest[]>([]);

  useEffect(() => {
    const loadCustomOrders = async () => {
      try {
        // Load from localStorage same as Admin
        const stored = localStorage.getItem("mock_custom_orders");
        if (stored) {
          let parsed = JSON.parse(stored);
          let hasUpdates = false;

          // SYNC CHECK: Bulk check backend for updates
          const orderIds = parsed.map((o: any) => o.orderReference || o.id);
          try {
            // Single Request for all updates
            const updates = await syncOrderUpdates(orderIds);

            if (updates && Object.keys(updates).length > 0) {
              parsed = parsed.map((o: any) => {
                const id = o.orderReference || o.id;
                const update = updates[id];

                if (update) {
                  // Sync Status
                  if (update.status && update.status !== o.status) {
                    // Only update if server status is "advanced" compared to local?
                    // or just trust server.
                    // For safe sync: if server says quote_sent, reflect it.
                    if (
                      update.status === "quote_sent" ||
                      update.status === "quote_ready"
                    ) {
                      o.status = "quote_sent";
                      hasUpdates = true;
                    }
                    // Sync other statuses
                    if (update.status !== o.status) {
                      o.status = update.status;
                      hasUpdates = true;
                    }
                  }

                  // Sync Questionnaire
                  if (update.questionnaireStatus === "completed") {
                    if (!o.questionnaireCompleted) {
                      o.questionnaireCompleted = true;
                      o.status = "questionnaire_completed";
                      hasUpdates = true;
                    }
                  } else if (update.questionnaireStatus === "sent") {
                    if (!o.questionnaireSent) {
                      o.questionnaireSent = true;
                      if (!o.questionnaireCompleted)
                        o.status = "questionnaire_sent";
                      hasUpdates = true;
                    }
                  }

                  // Sync Quote
                  if (update.quote) {
                    // Check if we need to attach or update quote
                    if (!o.quote || o.quote.id !== update.quote.id) {
                      o.quote = update.quote;
                      console.log("Synced quote for", id);
                      hasUpdates = true;
                    }
                  }
                }
                return o;
              });
            }
          } catch (err) {
            console.error("Bulk sync failed", err);
          }

          // If we found updates, save back to localStorage to keep sync
          if (hasUpdates) {
            localStorage.setItem("mock_custom_orders", JSON.stringify(parsed));
          }

          // Map to CustomRequest shape
          const mapped = parsed.map((o: any) => {
            // Handle both flat (Chatbot) and nested (Admin Mocks) structures
            const reqs = o.requirements || o;
            const refs = o.references || reqs.references || [];

            // Ensure we extract the correct image
            let displayImage = "/images/products/f14_tomcat_model.png";
            if (refs && refs.length > 0 && typeof refs[0] === "string") {
              displayImage = refs[0];
            }

            // Determine Status
            let statusLabel: PageCustomRequest["status"] = "In Progress";
            if (o.status === "cancelled") statusLabel = "Cancelled";
            else if (o.status === "quote_ready" || o.status === "quote_sent")
              statusLabel = "Quote Ready";
            else if (o.status === "questionnaire_completed")
              statusLabel = "In Progress"; // Or specific status
            else if (
              o.status === "questionnaire_sent" &&
              !o.questionnaireCompleted
            )
              statusLabel = "Action Required";
            else if (o.status === "pending_admin_review")
              statusLabel = "Pending Approval";
            else if (o.status === "quote_revision_requested")
              statusLabel = "Pending Approval"; // Or "Revision Requested"

            return {
              id: o.orderReference || o.id,
              submittedDate: o.submittedAt || reqs.submittedAt || "N/A",
              title: reqs.type
                ? `${reqs.scale || ""} ${reqs.type}`
                : "Custom Request",
              description: reqs.description || "No description provided.",
              estCost:
                o.quote?.amount ||
                parseInt((reqs.budgetRange || "0").replace(/[^0-9]/g, "")) ||
                0,
              status: statusLabel,
              progress:
                o.status === "quote_ready"
                  ? 50
                  : statusLabel === "Action Required"
                  ? 30
                  : o.status === "quote_revision_requested"
                  ? 40 // Retract progress slightly to show negotiation
                  : 20,
              image: displayImage,
              steps: [
                {
                  label: "Request Submitted",
                  date: o.submittedAt || reqs.submittedAt || "Pending",
                  completed: true,
                },
                {
                  label: "Review",
                  date: "In Progress",
                  completed: o.status !== "enquiry_received",
                },
              ],
              aiConversation: o.aiConversation || [],
              quote: o.quote, // PASS THE QUOTE OBJECT
            };
          });
          setCustomRequests(mapped);
        } else {
          // Fallback Mock Data if empty
          setCustomRequests([
            {
              id: "REQ-MOCK-1",
              submittedDate: "Jan 15, 2024",
              title: "1/48 F-14 Tomcat (Sample)",
              description: "Sample request for visualization.",
              estCost: 450,
              status: "In Progress",
              progress: 45,
              image: "/images/products/f14_tomcat_model.png",
              steps: [],
              aiConversation: [],
            },
          ]);
        }
      } catch (e) {
        console.error("Failed to load custom orders", e);
      }
    };

    // Initial load
    loadCustomOrders();

    // Auto-sync polling every 5 seconds to catch Admin updates fast
    // Auto-sync polling every 15 seconds (reduced frequency)
    // DISABLED FOR NOW AS PER USER REQUEST - MANUAL SYNC ONLY
    /*
    const interval = setInterval(() => {
      // Quietly reload
      console.log("Auto-syncing custom orders...");
      loadCustomOrders();
    }, 15000);
    */

    // Listen for updates from Admin page
    window.addEventListener("storage", loadCustomOrders);

    return () => {
      // clearInterval(interval);
      window.removeEventListener("storage", loadCustomOrders);
    };
  }, []);

  const wishlist = [
    {
      id: 1,
      name: "1/32 Spitfire Mk.IX",
      price: 145.0,
      category: "Aircraft",
      inStock: true,
      image: "/images/products/spitfire_model.png",
    },
    {
      id: 2,
      name: "1/350 USS Enterprise",
      price: 320.0,
      category: "Ships",
      inStock: false,
      image: "/images/products/uss_enterprise_model.png",
    },
    {
      id: 3,
      name: "T-34/85 Tank",
      price: 89.99,
      category: "Armor",
      inStock: true,
      image: "/images/products/t34_85_tank_model.png",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "active")
      return ["Processing", "Shipped"].includes(order.status);
    return ["Delivered", "Cancelled"].includes(order.status);
  });

  const handleBuyAgain = (item: OrderItem) => {
    // Mock Product object for Cart
    const product = {
      id: item.name, // Use name as ID for mock
      title: item.name,
      price: item.price,
      image: item.image,
      category: "Model Kit",
      subcategory: "General",
      topic: "General",
      scale: "N/A",
      year: new Date().getFullYear(),
      inStock: true,
    };
    addToCart(product, 1);
    toast.success(`Added ${item.name} to cart`);
  };

  const handleAddToCart = (item: any) => {
    addToCart(
      {
        id: item.name,
        title: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: 1, // Satisfy potential missing qty
        inStock: true, // Satisfy potential missing inStock
      } as any, // Temporary cast to avoid strict type mismatch during rapid fix
      1
    );
    toast.success("Added to flight deck (cart)");
  };

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile settings updated successfully.");
    }, 800);
  };

  const handleOpenQuestionnaire = async (request: PageCustomRequest) => {
    try {
      const q = await getPendingQuestionnaire(request.id);
      if (q) {
        setActiveQuestionnaire(q);
      } else {
        console.warn(`Questionnaire not found for order ${request.id}`);
        // Do not show error to user, just fail silently or maybe trigger a refresh
        // toast.error(`Could not load details for order ${request.id}. Please try again.`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error loading questionnaire");
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Mission Log", icon: Package },
    { id: "wishlist", label: "Hangar", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Questionnaire Modal */}
      {activeQuestionnaire && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
            <QuestionnaireResponder
              questionnaireId={activeQuestionnaire.id}
              questions={activeQuestionnaire.questions}
              title={activeQuestionnaire.title}
              description={activeQuestionnaire.description}
              onSuccess={() => {
                setActiveQuestionnaire(null);
                // Force refresh logic if needed
                const forcedEvent = new Event("storage");
                window.dispatchEvent(forcedEvent);
              }}
              onCancel={() => setActiveQuestionnaire(null)}
            />
          </div>
        </div>
      )}
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50/20 to-slate-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-slate-900 flex items-center gap-3">
              {getGreeting()},{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                {profileForm.name.split(" ")[0]}
              </span>
              <Sparkles className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
            </h1>
            <p className="text-slate-500 mt-1">Ready for your next mission?</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/60 ring-1 ring-slate-100 overflow-hidden relative group">
              <div className="absolute top-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              {/* Profile Header Block */}
              <div className="p-6 text-center border-b border-slate-100 bg-linear-to-b from-slate-50/50 to-transparent">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full p-1 bg-linear-to-br from-indigo-100 to-white shadow-lg mx-auto ring-4 ring-white">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white relative group-hover:scale-105 transition-transform duration-500">
                      <span className="text-2xl font-bold text-indigo-400 font-display">
                        {profileForm.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full shadow-md hover:scale-110 hover:bg-indigo-700 transition-all border-2 border-white cursor-pointer z-10">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-display mb-0.5">
                  {profileForm.name}
                </h2>
                <p className="text-xs text-slate-500 mb-3 font-medium">
                  {profileForm.email}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wide shadow-lg shadow-slate-200">
                  <Plane className="w-3 h-3 fill-current opacity-80" />
                  {profileForm.role}
                </div>
              </div>

              {/* Navigation */}
              <div className="p-3">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/profile?tab=${item.id}`}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                        activeTab === item.id
                          ? "bg-slate-50 text-indigo-600 shadow-inner"
                          : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            activeTab === item.id
                              ? "text-indigo-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {activeTab === item.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                <button className="w-full flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors px-2 py-1 group/logout">
                  <LogOut className="w-3.5 h-3.5 group-hover/logout:translate-x-0.5 transition-transform" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      label: "Total Orders",
                      value: user.stats.orders,
                      icon: Package,
                      color: "blue",
                      delay: "0",
                    },
                    {
                      label: "Total Spent",
                      value: user.stats.spent,
                      icon: Truck,
                      color: "emerald",
                      delay: "75",
                    },
                    {
                      label: "Saved Items",
                      value: user.stats.saved,
                      icon: Heart,
                      color: "pink",
                      delay: "150",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={cn(
                            "p-2.5 rounded-xl transition-colors",
                            `bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-100`
                          )}
                        >
                          <stat.icon className="w-5 h-5" />
                        </div>
                        {/* Simple visual indicator */}
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full ring-2 ring-white shadow-sm",
                            `bg-${stat.color}-400`
                          )}
                        ></div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 font-mono mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Mission - Enhanced */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        Current Mission
                      </h3>
                      <Link
                        href="/profile?tab=orders"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                      >
                        View Log{" "}
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-center">
                      {filteredOrders.filter((o) =>
                        ["Processing", "Shipped"].includes(o.status)
                      ).length > 0 ? (
                        <div className="flex items-start gap-5">
                          <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={orders[0].items[0].image}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt=""
                            />
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 shadow-sm">
                                IN PROGRESS
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1 truncate leading-tight">
                              {orders[0].items[0].name}
                            </h4>
                            <p className="text-xs text-slate-500 mb-4">
                              {orders[0].status} • Order #{orders[0].id}
                            </p>

                            <button
                              onClick={() => router.push("/profile?tab=orders")}
                              className="text-xs font-bold text-white bg-slate-900 px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 w-full md:w-auto"
                            >
                              Track Mission Status
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-500">
                            No active missions showing.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity Feed */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Recent Sorties
                    </h3>
                    <div className="space-y-0 relative ml-2">
                      <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100 rounded-full"></div>

                      {[
                        {
                          text: "Order #ORD-9921 Dispatched",
                          time: "2 hours ago",
                          icon: Truck,
                          color: "blue",
                          bg: "white",
                        },
                        {
                          text: "Saved 'Weathering Set B'",
                          time: "Yesterday",
                          icon: Heart,
                          color: "pink",
                          bg: "slate-50",
                        },
                        {
                          text: "Updated Pilot Profile",
                          time: "3 days ago",
                          icon: Settings,
                          color: "slate",
                          bg: "white",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="relative pl-14 py-3 group hover:bg-slate-50/50 -mx-6 px-6 transition-colors"
                        >
                          <div
                            className={cn(
                              "absolute left-6 top-4 w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-200 flex items-center justify-center bg-white z-10 shadow-sm"
                            )}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125",
                                `bg-${item.color}-500`
                              )}
                            ></div>
                          </div>
                          <p className="text-sm font-bold text-slate-800">
                            {item.text}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                            {item.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex gap-1 p-1 bg-slate-100/50 rounded-xl w-fit">
                    <button
                      onClick={() => setOrderFilter("custom")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                        orderFilter === "custom"
                          ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      <Sparkles className="w-3 h-3" />
                      Custom Requests
                    </button>
                    <button
                      onClick={() => setOrderFilter("active")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                        orderFilter === "active"
                          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Active Orders
                    </button>
                    <button
                      onClick={() => setOrderFilter("past")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                        orderFilter === "past"
                          ? "bg-white text-slate-900 shadow-sm  ring-1 ring-slate-100"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Past History
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-white transition-all flex items-center gap-2"
                      title="Force Sync with Server"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Sync
                    </button>
                  </div>
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search mission logs..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm font-medium outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {orderFilter === "custom" ? (
                    customRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-indigo-100 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="w-full md:w-48 h-32 bg-slate-50 rounded-xl flex-shrink-0 border border-slate-100 p-1">
                              <div className="w-full h-full relative rounded-lg overflow-hidden">
                                <img
                                  src={req.image}
                                  className="object-cover w-full h-full"
                                  alt=""
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                      {req.id} • SUBMITTED {req.submittedDate}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {req.title}
                                  </h3>
                                  <p className="text-sm text-slate-500 mt-1 max-w-xl">
                                    {req.description}
                                  </p>
                                </div>
                                <div>
                                  <span
                                    className={cn(
                                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5",
                                      req.status === "In Progress"
                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                        : req.status === "Quote Ready"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : req.status === "Pending Approval"
                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                        : req.status === "Action Required"
                                        ? "bg-red-50 text-red-600 border-red-100 animate-pulse"
                                        : "bg-slate-50 text-slate-600 border-slate-100"
                                    )}
                                  >
                                    {req.status === "In Progress" && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    )}
                                    {req.status}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-end justify-between mt-4">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                    EST. COST
                                  </p>
                                  <p className="text-xl font-bold text-slate-900 font-mono">
                                    ${req.estCost.toFixed(2)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedRequest(req)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                  >
                                    View Details
                                  </button>
                                  {req.status === "Quote Ready" && (
                                    <button
                                      onClick={() => setSelectedQuote(req)}
                                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                    >
                                      Review Quote
                                    </button>
                                  )}
                                  {req.status === "Action Required" && (
                                    <button
                                      onClick={() =>
                                        handleOpenQuestionnaire(req)
                                      }
                                      className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2 animate-bounce"
                                    >
                                      <FileText className="w-3 h-3" />
                                      Provide Info
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Progress Bar Footer matches screenshot style */}
                        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-3 flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                req.status === "Action Required"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              )}
                              style={{ width: `${req.progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-bold w-24 text-right",
                              req.status === "Action Required"
                                ? "text-red-600"
                                : "text-blue-600"
                            )}
                          >
                            {req.progress}% Complete
                          </span>
                        </div>
                      </div>
                    ))
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-indigo-100 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="flex flex-wrap items-start justify-between gap-6 mb-6 pb-6 border-b border-slate-50">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                                <Package className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-slate-900 text-base">
                                    Order #{order.id}
                                  </h4>
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                      order.status === "Shipped"
                                        ? "bg-blue-50 text-blue-700 border-blue-100"
                                        : order.status === "Delivered"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-slate-50 text-slate-700 border-slate-100"
                                    )}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                  {order.date} • Total: ${order.total}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {orderFilter === "active" && (
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                  Track Order
                                </button>
                              )}
                              {orderFilter === "past" && (
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                  Invoice
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Order Progress Bar */}
                          {orderFilter === "active" && (
                            <div className="mb-6 px-4">
                              <div className="relative pt-2">
                                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-200 -translate-y-1/2 rounded-full"></div>
                                <div
                                  className="absolute top-1/2 left-0 h-1.5 bg-indigo-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${
                                      order.status === "Delivered"
                                        ? "100%"
                                        : order.status === "Shipped"
                                        ? "66%"
                                        : order.status === "Processing"
                                        ? "33%"
                                        : "5%"
                                    }`,
                                  }}
                                ></div>
                                <div className="relative flex justify-between w-full">
                                  {[
                                    "Placed",
                                    "Processing",
                                    "Shipped",
                                    "Delivered",
                                  ].map((step, sIdx) => {
                                    let stepActive = false;
                                    if (order.status === "Delivered")
                                      stepActive = true;
                                    else if (
                                      order.status === "Shipped" &&
                                      sIdx <= 2
                                    )
                                      stepActive = true;
                                    else if (
                                      order.status === "Processing" &&
                                      sIdx <= 1
                                    )
                                      stepActive = true;
                                    else if (sIdx === 0) stepActive = true;

                                    return (
                                      <div
                                        key={step}
                                        className="flex flex-col items-center gap-2 relative z-10"
                                      >
                                        <div
                                          className={cn(
                                            "w-2.5 h-2.5 rounded-full ring-4 ring-white transition-colors duration-500",
                                            stepActive
                                              ? "bg-indigo-600"
                                              : "bg-slate-300"
                                          )}
                                        ></div>
                                        <span
                                          className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            stepActive
                                              ? "text-indigo-600"
                                              : "text-slate-400"
                                          )}
                                        >
                                          {step}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50/80 transition-colors"
                              >
                                <div className="w-16 h-16 bg-white rounded-lg border border-slate-100 p-0.5 shrink-0 shadow-sm">
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-bold text-slate-900">
                                    {item.name}
                                  </h5>
                                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Qty: {item.quantity} • ${item.price}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleBuyAgain(item)}
                                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline px-3 py-1 bg-indigo-50 rounded-lg"
                                >
                                  Buy Again
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 border-dashed">
                      <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        No order history found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
                    >
                      <div className="aspect-video bg-slate-100 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-pink-500 shadow-sm cursor-pointer hover:bg-pink-50 hover:scale-110 transition-all z-10">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="px-3 py-1 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-4 truncate text-lg group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-bold text-xl text-slate-900 font-mono">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-200 group-hover:shadow-indigo-200 transform duration-200"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
                    <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400 font-bold text-xl">
                        {profileForm.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        Pilot Profile
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Update your personal information and flight credentials.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Display Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Communication Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 flex items-center justify-center font-bold">
                          @
                        </div>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-50 pb-2">
                      Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Street Address
                        </label>
                        <input
                          type="text"
                          placeholder="123 Fighter Wing Way"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Base Location (City/State)
                        </label>
                        <input
                          type="text"
                          placeholder="San Diego, CA"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-slate-50">
                    <button
                      onClick={handleSaveProfile}
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Review Modal */}
      {selectedQuote && selectedQuote.quote && (
        <QuoteViewer
          quote={selectedQuote.quote}
          onClose={() => setSelectedQuote(null)}
          onStatusUpdate={() => {
            setSelectedQuote(null);
            // Force refresh
            const event = new Event("storage");
            window.dispatchEvent(event);
          }}
        />
      )}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Tracking Details
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedOrder.trackingNumber || "Pending Tracking"}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {selectedOrder.steps.map((step, i) => (
                  <div key={i} className="relative">
                    <div
                      className={cn(
                        "absolute -left-[31px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
                        step.completed
                          ? "bg-indigo-600 ring-2 ring-indigo-100"
                          : "bg-slate-200"
                      )}
                    >
                      {step.completed && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-bold",
                          step.completed ? "text-slate-900" : "text-slate-400"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Request Details
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {selectedRequest.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Info Section */}
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedRequest.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {selectedRequest.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {selectedRequest.description}
                    </p>
                  </div>
                </div>

                {/* Conversation Section */}
                {selectedRequest.aiConversation &&
                  selectedRequest.aiConversation.length > 0 && (
                    <div className="border-t border-slate-100 pt-8">
                      <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Messages & Updates
                      </h4>
                      <div className="bg-white rounded-2xl p-0 overflow-hidden border border-slate-200 shadow-sm flex flex-col h-[500px]">
                        {/* Chat Header - Optional Context */}
                        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Live Concierge
                          </span>
                        </div>

                        {/* Scrolling Message Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
                          <AnimatePresence initial={false}>
                            {selectedRequest.aiConversation
                              .filter((msg) => msg.role !== "bot")
                              .map((msg, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                  className={`flex gap-4 ${
                                    msg.role === "user"
                                      ? "flex-row-reverse"
                                      : ""
                                  }`}
                                >
                                  {/* Avatar */}
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                                      msg.role === "admin"
                                        ? "bg-white border border-slate-200 text-indigo-600"
                                        : "bg-indigo-600 text-white"
                                    }`}
                                  >
                                    {msg.role === "admin" ? (
                                      <Sparkles className="w-3.5 h-3.5" />
                                    ) : (
                                      <User className="w-3.5 h-3.5" />
                                    )}
                                  </div>

                                  {/* Message Content */}
                                  <div
                                    className={`flex flex-col max-w-[75%] ${
                                      msg.role === "user"
                                        ? "items-end"
                                        : "items-start"
                                    }`}
                                  >
                                    <div
                                      className={`px-5 py-3 text-[14px] leading-relaxed shadow-sm ${
                                        msg.role === "admin"
                                          ? "bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200"
                                          : "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                      }`}
                                    >
                                      {msg.content &&
                                      (msg.content.startsWith("data:image") ||
                                        msg.content.match(/^https?:\/\//i)) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={msg.content}
                                          alt="Content"
                                          className="max-w-full rounded-lg"
                                        />
                                      ) : (
                                        <p className="whitespace-pre-wrap font-regular break-words">
                                          {msg.content}
                                        </p>
                                      )}
                                    </div>
                                    {msg.timestamp && (
                                      <span className="text-[10px] text-slate-400 font-medium mt-1 px-1">
                                        {new Date(
                                          msg.timestamp
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>

                        {/* Input Area - Fixed at bottom of container */}
                        <div className="p-4 bg-white border-t border-slate-100">
                          <div className="group flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-sm hover:shadow-md">
                            <div className="pl-4 flex-1">
                              <input
                                type="text"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleSendReply()
                                }
                                placeholder="Type your message..."
                                className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 h-9"
                              />
                            </div>
                            <button
                              onClick={handleSendReply}
                              disabled={!replyInput.trim()}
                              className="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md transform active:scale-95"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedRequest.steps && selectedRequest.steps.length > 0 && (
                  <div className="border-t border-slate-100 pt-8">
                    <h4 className="text-sm font-bold text-slate-900 mb-6">
                      Tracking Status
                    </h4>
                    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      {selectedRequest.steps.map((step, i) => (
                        <div key={i} className="relative">
                          <div
                            className={cn(
                              "absolute -left-[31px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
                              step.completed
                                ? "bg-indigo-600 ring-2 ring-indigo-100"
                                : "bg-slate-200"
                            )}
                          >
                            {step.completed && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-sm font-bold",
                                step.completed
                                  ? "text-slate-900"
                                  : "text-slate-400"
                              )}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {step.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedInvoice && selectedInvoice.invoice && (
        <InvoiceViewer
          orderId={selectedInvoice.id}
          invoice={selectedInvoice.invoice}
          onClose={() => setSelectedInvoice(null)}
          onPaymentSuccess={() => {
            // Refresh data logic handled by component reload or context update usually
            // But for now we just verify status updates via revalidatePath
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
