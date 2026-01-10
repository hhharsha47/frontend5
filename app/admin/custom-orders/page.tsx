"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock Data
const MOCK_CUSTOM_ORDERS = [
  {
    id: "CO-2024-001",
    customer: { name: "John Doe", email: "john@example.com", avatar: "JD" },
    modelName: "F-14A Tomcat Jolly Rogers",
    scale: "1/48",
    status: "quote_ready",
    submittedDate: "Jan 15, 2024",
    lastUpdated: "2 hours ago",
    budget: "$120 - $150",
    priority: "normal",
  },
  {
    id: "CO-2024-002",
    customer: { name: "Sarah Smith", email: "sarah@example.com", avatar: "SS" },
    modelName: "USS Enterprise (CVN-65)",
    scale: "1/350",
    status: "in_production",
    submittedDate: "Jan 10, 2024",
    lastUpdated: "1 day ago",
    budget: "$450",
    priority: "high",
  },
  {
    id: "CO-2024-003",
    customer: { name: "Mike Johnson", email: "mike@example.com", avatar: "MJ" },
    modelName: "M1A2 Abrams TUSK II",
    scale: "1/35",
    status: "enquiry_received",
    submittedDate: "Jan 20, 2024",
    lastUpdated: "5 mins ago",
    budget: "Unknown",
    priority: "normal",
  },
  {
    id: "CO-2024-004",
    customer: { name: "Alice Brown", email: "alice@example.com", avatar: "AB" },
    modelName: "Saturn V Rocket",
    scale: "1/72",
    status: "completed",
    submittedDate: "Dec 05, 2023",
    lastUpdated: "1 week ago",
    budget: "$800",
    priority: "low",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "enquiry_received":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          <Clock className="w-3 h-3" />
          New Enquiry
        </span>
      );
    case "quote_ready":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          <DollarSign className="w-3 h-3" />
          Quote Ready
        </span>
      );
    case "in_production":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Package className="w-3 h-3" />
          In Production
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
          {status}
        </span>
      );
  }
};

export default function AdminCustomOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState(MOCK_CUSTOM_ORDERS);

  React.useEffect(() => {
    // Load persisted orders
    const loadOrders = () => {
      try {
        const stored = localStorage.getItem("mock_custom_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          const formatted = parsed.map((o: any) => ({
            id: o.id,
            customer: o.customer || {
              name: "Guest",
              email: o.email,
              avatar: "GU",
            },
            modelName: o.modelName || o.description || o.type,
            scale: o.scale,
            status: o.status,
            submittedDate: o.submittedAt || o.date,
            lastUpdated: "Just now",
            budget: o.budget || "Pending",
            priority: "normal",
          }));
          // Remove duplicates and merge
          const newOrders = [...formatted, ...MOCK_CUSTOM_ORDERS];
          const unique = Array.from(
            new Map(newOrders.map((item) => [item.id, item])).values()
          );
          setOrders(unique);
        }
      } catch (e) {
        console.error("Failed to load admin orders", e);
      }
    };
    loadOrders();
    window.addEventListener("storage", loadOrders);
    return () => window.removeEventListener("storage", loadOrders);
  }, []);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all" && order.submittedDate !== "N/A") {
      const orderDate = new Date(order.submittedDate);
      const now = new Date();
      // Handle "N/A" or invalid dates gracefully by just including them if check is lax,
      // but strictly we want to filter relative to now.
      // Assuming mock data format "Jan 15, 2024" is parseable.
      if (!isNaN(orderDate.getTime())) {
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === "7d") matchesDate = diffDays <= 7;
        if (dateFilter === "30d") matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExport = () => {
    // Generate CSV
    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Model",
      "Scale",
      "Status",
      "Date",
      "Budget",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map((o) =>
        [
          o.id,
          o.customer.name,
          o.customer.email,
          `"${o.modelName}"`,
          o.scale,
          o.status,
          `"${o.submittedDate}"`,
          `"${o.budget}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `custom_orders_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Custom Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage bespoke model requests and production workflow.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-xs">
            <span className="font-semibold text-slate-900">
              {filteredOrders.length}
            </span>{" "}
            Total Orders
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-all"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, customers, or models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>
        <div className="md:col-span-7 flex flex-wrap items-center justify-end gap-3 relative">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusFilter(!showStatusFilter);
                setShowDateFilter(false);
              }}
              className={`flex items-center gap-2 px-3 py-2.5 bg-white border rounded-lg text-sm font-medium transition-all shadow-xs ${
                statusFilter !== "all"
                  ? "border-indigo-200 text-indigo-700 bg-indigo-50/50"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              {statusFilter === "all"
                ? "Filter Status"
                : statusFilter
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
            {showStatusFilter && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 font-medium"
                >
                  All Statuses
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("enquiry_received");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  Enquiry Received
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("quote_ready");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  Quote Ready
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("in_production");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  In Production
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("completed");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("cancelled");
                    setShowStatusFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  Cancelled
                </button>
              </div>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateFilter(!showDateFilter);
                setShowStatusFilter(false);
              }}
              className={`flex items-center gap-2 px-3 py-2.5 bg-white border rounded-lg text-sm font-medium transition-all shadow-xs ${
                dateFilter !== "all"
                  ? "border-indigo-200 text-indigo-700 bg-indigo-50/50"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {dateFilter === "all"
                ? "Date Range"
                : dateFilter === "7d"
                ? "Last 7 Days"
                : "Last 30 Days"}
            </button>
            {showDateFilter && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setDateFilter("all");
                    setShowDateFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 font-medium"
                >
                  All Time
                </button>
                <button
                  onClick={() => {
                    setDateFilter("7d");
                    setShowDateFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => {
                    setDateFilter("30d");
                    setShowDateFilter(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                >
                  Last 30 Days
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Model Details
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {order.id}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {order.submittedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                          {order.customer.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700">
                            {order.customer.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">
                          {order.modelName}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          Scale:{" "}
                          <span className="font-semibold text-slate-600">
                            {order.scale}
                          </span>{" "}
                          • Est: {order.budget}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/custom-orders/${order.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
