"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

// Mock Data for Custom Orders
const MOCK_ORDERS = [
  {
    id: "CO-2024-001",
    modelName: "F-14A Tomcat Jolly Rogers",
    scale: "1/48",
    status: "quote_ready",
    date: "2024-01-15",
    price: "$120.00",
    thumbnail: "/images/placeholder-jet.jpg", // Placeholder
  },
  {
    id: "CO-2024-002",
    modelName: "USS Enterprise (CVN-65)",
    scale: "1/350",
    status: "in_production",
    date: "2024-01-10",
    price: "$450.00",
    thumbnail: "/images/placeholder-ship.jpg",
  },
  {
    id: "CO-2024-003",
    modelName: "M1A2 Abrams TUSK II",
    scale: "1/35",
    status: "enquiry_received",
    date: "2024-01-20",
    price: "Pending",
    thumbnail: "/images/placeholder-tank.jpg",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "enquiry_received":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          <Clock className="w-3.5 h-3.5" />
          Enquiry Received
        </span>
      );
    case "quote_ready":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          <AlertCircle className="w-3.5 h-3.5" />
          Quote Ready
        </span>
      );
    case "in_production":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Package className="w-3.5 h-3.5" />
          In Production
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
          {status}
        </span>
      );
  }
};

export default function CustomOrdersPage() {
  const [orders, setOrders] = React.useState(MOCK_ORDERS);

  React.useEffect(() => {
    // Load persisted orders from "mock_custom_orders"
    const loadOrders = () => {
      try {
        const stored = localStorage.getItem("mock_custom_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          // Transform strict Match to UI shape if needed, currently they match roughly
          const formatted = parsed.map((o: any) => ({
            id: o.id,
            modelName: o.modelName || o.description || o.type,
            scale: o.scale,
            status: o.status,
            date: o.submittedAt || o.date,
            price: o.budget || "Pending Quote",
            thumbnail: null, // No real images yet
          }));

          setOrders([...formatted, ...MOCK_ORDERS]);
        }
      } catch (e) {
        console.error("Failed to load custom orders", e);
      }
    };

    loadOrders();

    // Listen for storage events (if tabs change) or custom events (same tab)
    window.addEventListener("storage", loadOrders);
    return () => window.removeEventListener("storage", loadOrders);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                My Custom Orders
              </h1>
              <p className="mt-2 text-slate-500 text-sm">
                Track and manage your bespoke model requests.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              New Custom Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Model Name..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
        </div>

        {/* Orders List */}
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon / Image Placeholder */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      {order.id}
                    </span>
                    <span className="text-sm font-medium text-slate-500 md:hidden">
                      {order.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {order.modelName}
                  </h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      Scale:{" "}
                      <span className="font-semibold text-slate-700">
                        {order.scale}
                      </span>
                    </span>
                    <span className="hidden md:block text-slate-300">•</span>
                    <span className="hidden md:block">{order.date}</span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-2">
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(order.status)}
                    {order.price !== "Pending" && (
                      <span className="text-sm font-bold text-slate-900 mt-1">
                        {order.price}
                      </span>
                    )}
                  </div>

                  <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline decoration-2 underline-offset-4">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State visual (if needed later) */}
        {/* <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No custom orders yet</h3>
            <p className="text-slate-500 mt-1 mb-6">Start a conversation with our AI concierge to request a quote.</p>
        </div> */}
      </div>
    </div>
  );
}
