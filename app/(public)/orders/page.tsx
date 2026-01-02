"use client";

import {
  Package,
  CheckCircle,
  Clock,
  Search,
  Box,
  Star,
  X,
  Hammer,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { products } from "@/components/shop/shop-data";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
type CustomRequestStatus =
  | "Pending Approval"
  | "In Progress"
  | "Quote Ready"
  | "Completed";
type TabType = "active" | "past" | "custom";

interface OrderItem {
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
  trackingNumber?: string;
  steps: { label: string; date: string; completed: boolean }[];
}

const mockOrders: Order[] = [
  {
    id: "ORD-9921-MC",
    date: "March 10, 2024",
    total: "$143.49",
    status: "Shipped",
    trackingNumber: "1Z999AA10123456784",
    steps: [
      { label: "Order Placed", date: "Mar 10, 10:00 AM", completed: true },
      { label: "Processing", date: "Mar 11, 2:30 PM", completed: true },
      { label: "Shipped", date: "Mar 12, 9:15 AM", completed: true },
      { label: "Out for Delivery", date: "Estimated Mar 14", completed: false },
      { label: "Delivered", date: "Estimated Mar 14", completed: false },
    ],
    items: [
      {
        name: "M1A2 SEPv3 Abrams",
        price: "$74.50",
        image: "/images/products/m1a2_abrams_model.png",
        quantity: 1,
      },
      {
        name: "Tiger I Late Production",
        price: "$68.99",
        image: "/images/products/tiger_tank_model.png",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-7782-XJ",
    date: "March 15, 2024",
    total: "$89.99",
    status: "Processing",
    steps: [
      { label: "Order Placed", date: "Mar 15, 8:00 PM", completed: true },
      { label: "Processing", date: "In Progress", completed: true },
      { label: "Shipped", date: "Pending", completed: false },
      { label: "Delivered", date: "Pending", completed: false },
    ],
    items: [
      {
        name: "F-14D Super Tomcat 'Grim Reapers'",
        price: "$89.99",
        image: "/images/products/f14_tomcat_model.png",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-3321-KL",
    date: "February 28, 2024",
    total: "$54.99",
    status: "Delivered",
    steps: [
      { label: "Order Placed", date: "Feb 28", completed: true },
      { label: "Processing", date: "Feb 29", completed: true },
      { label: "Shipped", date: "Mar 1", completed: true },
      { label: "Delivered", date: "Mar 3", completed: true },
    ],
    items: [
      {
        name: "P-51D Mustang 'Big Beautiful Doll'",
        price: "$54.99",
        image: "/images/products/p51d_mustang_model.png",
        quantity: 1,
      },
    ],
  },
];

interface CustomRequestStep {
  label: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}

interface QuoteDetail {
  description: string;
  amount: number;
}

interface CustomRequest {
  id: string;
  projectTitle: string;
  status: CustomRequestStatus;
  date: string;
  thumbnail: string;
  description: string;
  estimatedCost?: string;
  steps: CustomRequestStep[];
  quoteDetails?: {
    items: QuoteDetail[];
    total: number;
    validUntil: string;
  };
}

const mockCustomRequests: CustomRequest[] = [
  {
    id: "REQ-2024-001",
    projectTitle: "1/32 F-14 Tomcat Jolly Rogers",
    status: "In Progress",
    date: "Submitted Mar 18, 2024",
    thumbnail: "/images/products/f14_tomcat_model.png",
    description:
      "Custom weathering and specific tail markings requested for VF-84. High-visibility scheme with light weathering.",
    estimatedCost: "$450.00",
    steps: [
      { label: "Request Submitted", date: "Mar 18", completed: true },
      { label: "Quote Approved", date: "Mar 19", completed: true },
      { label: "Materials Sourced", date: "Mar 20", completed: true },
      { label: "Assembly", completed: true, current: true },
      { label: "Painting & Weathering", completed: false },
      { label: "Final QC", completed: false },
      { label: "Shipping", completed: false },
    ],
  },
  {
    id: "REQ-2024-002",
    projectTitle: "Millennium Falcon 'Battle Of Hoth'",
    status: "Quote Ready",
    date: "Submitted Mar 20, 2024",
    thumbnail: "/images/products/millennium_falcon_model.png",
    description:
      "Snow diorama base with battle damage and LED lighting kit. Requesting 'Empire Strikes Back' configuration.",
    estimatedCost: "$680.00",
    steps: [
      { label: "Request Submitted", date: "Mar 20", completed: true },
      { label: "Feasibility Check", date: "Mar 21", completed: true },
      { label: "Quote Ready", date: "Mar 22", completed: true, current: true },
      { label: "Production", completed: false },
    ],
    quoteDetails: {
      items: [
        { description: "Base Model (Millennium Falcon PG 1/72)", amount: 350 },
        { description: "LED Lighting Kit", amount: 80 },
        { description: "Custom Diorama Base (Snow/Hoth)", amount: 120 },
        { description: "Labor (Paint, Assembly, Weathering)", amount: 130 },
      ],
      total: 680,
      validUntil: "April 05, 2024",
    },
  },
  {
    id: "REQ-2024-003",
    projectTitle: "P-51D Mustang 'Red Tails'",
    status: "Pending Approval",
    date: "Submitted Mar 22, 2024",
    thumbnail: "/images/products/p51d_mustang_model.png",
    description:
      "Historical Tuskegee Airmen glossy red tail finish. Pilot figure included to match reference photo #3.",
    steps: [
      {
        label: "Request Submitted",
        date: "Mar 22",
        completed: true,
        current: true,
      },
      { label: "Reviewing Requirements", completed: false },
      { label: "Quote Generation", completed: false },
    ],
  },
  {
    id: "REQ-2024-004",
    projectTitle: "USS Enterprise (CV-6) 1/350",
    status: "Completed",
    date: "Submitted Feb 10, 2024",
    thumbnail: "/images/products/uss_enterprise_model.png",
    description:
      "Full detail set with photo-etch parts and wooden deck. Pacific Theater 1942 camouflage.",
    estimatedCost: "$1,200.00",
    steps: [
      { label: "Request Submitted", date: "Feb 10", completed: true },
      { label: "Quote Approved", date: "Feb 12", completed: true },
      { label: "Production", date: "Feb 15 - Mar 20", completed: true },
      { label: "Shipped", date: "Mar 22", completed: true },
      { label: "Delivered", date: "Mar 25", completed: true, current: true },
    ],
  },
  {
    id: "REQ-2024-005",
    projectTitle: "Tiger I Late Production Diorama",
    status: "In Progress",
    date: "Submitted Apr 05, 2024",
    thumbnail: "/images/products/tiger_tank_model.png",
    description:
      "Winter camouflage with muddy terrain base and 5 crew figures.",
    estimatedCost: "$550.00",
    steps: [
      { label: "Request Submitted", date: "Apr 05", completed: true },
      { label: "Quote Approved", date: "Apr 06", completed: true },
      { label: "Production", completed: true, current: true },
      { label: "Final QC", completed: false },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("custom");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  // Modal States
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Custom Request Modals
  const [viewRequest, setViewRequest] = useState<CustomRequest | null>(null);
  const [quoteRequest, setQuoteRequest] = useState<CustomRequest | null>(null);

  const filteredStandardOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (activeTab === "active") {
      return matchesSearch && ["Processing", "Shipped"].includes(order.status);
    } else if (activeTab === "past") {
      return matchesSearch && ["Delivered", "Cancelled"].includes(order.status);
    }
    return false;
  });

  const filteredCustomRequests = mockCustomRequests.filter((req) => {
    const matchesSearch =
      req.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Add status filtering if needed, currently showing all custom requests
    return matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "Shipped":
        return "text-indigo-600 bg-indigo-50 border-indigo-100";
      case "Delivered":
        return "text-green-600 bg-green-50 border-green-100";
      case "Cancelled":
        return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  const getCustomStatusColor = (status: CustomRequestStatus) => {
    switch (status) {
      case "Pending Approval":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "In Progress":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "Quote Ready":
        return "text-green-600 bg-green-50 border-green-100";
      case "Completed":
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  const handleBuyAgain = (itemName: string) => {
    const product = products.find((p) => p.title === itemName);
    if (product) {
      addToCart(product, 1);
      toast.success(`Added ${product.title} to your cart`);
    } else {
      toast.error("Product details not found");
    }
  };

  const handleViewInvoice = (orderId: string) => {
    toast.info(`Downloading Invoice #${orderId}...`);
    setTimeout(() => {
      toast.success("Invoice downloaded successfully");
    }, 1500);
  };

  const handleAcceptQuote = () => {
    toast.success("Quote accepted! Proceeding to payment...");
    setQuoteRequest(null);
    // In a real app, update state or redirect to checkout
  };

  const handleDeclineQuote = () => {
    toast.info("Sales team notified. We will contact you shortly.");
    setQuoteRequest(null);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewItem) return;

    const newReview = {
      id: Date.now(),
      action: "New Review",
      user: "Current User", // In a real app this would be dynamic
      detail: `left a review on '${reviewItem.name}'`,
      amount: "⭐".repeat(rating),
      time: "Just now",
      initials: "CU",
      color: "bg-green-100 text-green-700",
      rating,
      comment: reviewText,
      productName: reviewItem.name,
    };

    // Save to localStorage so Admin Dashboard can pick it up
    const existingReviews = JSON.parse(
      localStorage.getItem("adminRecentActivity") || "[]"
    );
    localStorage.setItem(
      "adminRecentActivity",
      JSON.stringify([newReview, ...existingReviews])
    );

    toast.success("Review submitted successfully!");
    setReviewItem(null);
    setRating(0);
    setReviewText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">
          My Orders
        </h1>
        <p className="text-slate-500 mb-8">
          Manage your purchases and track shipments.
        </p>

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("custom")}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
              activeTab === "custom"
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Hammer className="w-4 h-4" />
            Custom Requests
            {activeTab === "custom" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
              activeTab === "active"
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Box className="w-4 h-4" />
            Active Orders
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
              activeTab === "past"
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            Past Orders
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {activeTab === "custom" ? (
            filteredCustomRequests.length > 0 ? (
              filteredCustomRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-48 aspect-4/3 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={request.thumbnail}
                        alt={request.projectTitle}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-mono text-slate-400 uppercase">
                              {request.id}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">
                              {request.date}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {request.projectTitle}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {request.description}
                          </p>
                          {request.estimatedCost && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Est. Cost
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {request.estimatedCost}
                              </p>
                            </div>
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap ${getCustomStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status === "In Progress" && (
                            <Hammer className="w-3.5 h-3.5" />
                          )}
                          {request.status === "Quote Ready" && (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          {request.status === "Pending Approval" && (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {request.status === "Completed" && (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          {request.status}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                        <div className="text-sm font-medium text-slate-500">
                          {/* Placeholder for additional info */}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setViewRequest(request)}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            View Details
                          </button>
                          {request.status === "Quote Ready" && (
                            <button
                              onClick={() => setQuoteRequest(request)}
                              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                            >
                              Review Quote
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Status Bar */}
                  {request.status === "In Progress" && (
                    <div className="bg-blue-50/50 px-6 py-3 border-t border-blue-100 flex items-center gap-3">
                      <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="w-[60%] h-full bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-blue-700 whitespace-nowrap">
                        60% Complete
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hammer className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No custom requests
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm
                    ? "No custom requests match your search."
                    : "You haven't submitted any custom requests yet."}
                </p>
                <Link
                  href="/custom-model"
                  className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Start a Custom Project
                </Link>
              </div>
            )
          ) : filteredStandardOrders.length > 0 ? (
            filteredStandardOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/50 p-6 flex flex-wrap gap-y-4 gap-x-12 items-center justify-between border-b border-slate-100">
                  <div className="flex gap-12">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Order Placed
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {order.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Total Amount
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {order.total}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Order ID
                      </p>
                      <p className="text-sm font-mono text-slate-600">
                        #{order.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Package className="w-3.5 h-3.5" />
                      )}
                      {order.status}
                    </div>
                    {order.status !== "Delivered" &&
                      order.status !== "Cancelled" && (
                        <button
                          onClick={() => setTrackingOrder(order)}
                          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                        >
                          Track Package
                        </button>
                      )}
                    {order.status === "Delivered" && (
                      <button
                        onClick={() => handleViewInvoice(order.id)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        View Invoice
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 mb-6 last:mb-0">
                      <div className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-base">
                            {item.name}
                          </h4>
                          <span className="font-bold text-slate-900">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                          Quantity: {item.quantity}
                        </p>

                        <div className="flex gap-4">
                          <button
                            onClick={() => handleBuyAgain(item.name)}
                            className="text-indigo-600 text-sm font-bold hover:text-indigo-700 hover:underline"
                          >
                            Buy Again
                          </button>
                          {order.status === "Delivered" && (
                            <button
                              onClick={() => {
                                setReviewItem(item);
                                setRating(0); // Reset rating when opening
                                setReviewText(""); // Reset text
                              }}
                              className="text-slate-500 text-sm font-medium hover:text-slate-800 hover:underline"
                            >
                              Write a Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No orders found
              </h3>
              <p className="text-slate-500 mb-6">
                You don&apos;t have any {activeTab} orders.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Tracking Details
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {trackingOrder.trackingNumber || "Pending Tracking"}
                </p>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {trackingOrder.steps.map((step, i) => (
                  <div key={i} className="relative">
                    <div
                      className={`absolute -left-[31px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                        step.completed
                          ? "bg-indigo-600 ring-2 ring-indigo-100"
                          : "bg-slate-200"
                      }`}
                    >
                      {step.completed && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          step.completed ? "text-slate-900" : "text-slate-400"
                        }`}
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

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setTrackingOrder(null)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-xl mx-auto mb-4 overflow-hidden relative border border-slate-100">
                <Image
                  src={reviewItem.image}
                  alt={reviewItem.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                Rate this item
              </h3>
              <p className="text-sm text-slate-500 mb-6">{reviewItem.name}</p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-colors focus:outline-none transform active:scale-110 ${
                      star <= rating ? "text-yellow-400" : "text-slate-200"
                    } hover:text-yellow-400`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? "fill-current" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <textarea
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  placeholder="Share your thoughts..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <button
                  onClick={handleSubmitReview}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setReviewItem(null)}
                  className="w-full py-2 text-slate-500 font-bold text-sm hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Request Details Modal */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-xl text-slate-900">
                    Project Details
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getCustomStatusColor(
                      viewRequest.status
                    )}`}
                  >
                    {viewRequest.status}
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-mono">
                  {viewRequest.id} • {viewRequest.date}
                </p>
              </div>
              <button
                onClick={() => setViewRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="w-full md:w-1/3 shrink-0">
                  <div className="aspect-4/3 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-4">
                    <Image
                      src={viewRequest.thumbnail}
                      alt={viewRequest.projectTitle}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">
                    {viewRequest.projectTitle}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {viewRequest.description}
                  </p>
                  {viewRequest.estimatedCost && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Estimated Cost
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        {viewRequest.estimatedCost}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {viewRequest.steps && viewRequest.steps.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
                    Project Timeline
                  </h4>
                  <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {viewRequest.steps.map((step, i) => (
                      <div key={i} className="relative">
                        <div
                          className={`absolute -left-[31px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                            step.completed
                              ? "bg-indigo-600 ring-2 ring-indigo-100"
                              : step.current
                              ? "bg-white border-indigo-600 ring-2 ring-indigo-100"
                              : "bg-slate-200"
                          }`}
                        >
                          {step.completed && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                          {step.current && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              step.completed || step.current
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {step.date}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setViewRequest(null)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Review Modal */}
      {quoteRequest && quoteRequest.quoteDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Review Quote
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Valid until {quoteRequest.quoteDetails.validUntil}
                </p>
              </div>
              <button
                onClick={() => setQuoteRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-0">
              <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-b border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">
                  Total Project Cost
                </p>
                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                  ${quoteRequest.quoteDetails.total.toFixed(2)}
                </p>
              </div>
              <div className="p-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Cost Breakdown
                </h4>
                <div className="space-y-3">
                  {quoteRequest.quoteDetails.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-slate-600">{item.description}</span>
                      <span className="font-bold text-slate-900">
                        ${item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-indigo-600">
                      ${quoteRequest.quoteDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button
                onClick={handleDeclineQuote}
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors text-sm"
              >
                Decline Quote
              </button>
              <button
                onClick={handleAcceptQuote}
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm"
              >
                Accept & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
