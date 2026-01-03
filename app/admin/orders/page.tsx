"use client";

import {
  ShoppingBag,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  MapPin,
  Mail,
  LayoutGrid,
  List,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Order Interface
interface Order {
  id: string;
  customer: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  date: string;
  shipping: string;
  tracking?: string;
  address: string;
  messages?: { sender: "user" | "admin"; text: string; time: string }[];
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const columns = ["Processing", "Shipped", "Delivered"]; // Columns for Board View

  // Initial State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      customer: "Michael Chen",
      email: "michael@example.com",
      items: [
        { name: "1/48 F-14 Tomcat", quantity: 1, price: 129.99 },
        { name: "Weathering Set A", quantity: 2, price: 15.0 },
      ],
      total: 159.99,
      status: "Processing",
      date: "Jan 3, 2026",
      shipping: "Standard Shipping",
      address: "123 Maple Ave, New York, NY 10001",
    },
    {
      id: "ORD-2024-002",
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      items: [{ name: "1/35 Sherman Tank", quantity: 1, price: 89.99 }],
      total: 89.99,
      status: "Shipped",
      date: "Jan 2, 2026",
      shipping: "Express Shipping",
      tracking: "US992818273",
      address: "456 Oak Dr, Los Angeles, CA 90001",
    },
    {
      id: "ORD-2024-003",
      customer: "David Miller",
      email: "david@example.com",
      items: [{ name: "Custom B-17 Decals", quantity: 1, price: 24.99 }],
      total: 24.99,
      status: "Delivered",
      date: "Dec 29, 2025",
      shipping: "Standard Shipping",
      address: "789 Pine Ln, Chicago, IL 60601",
    },
    {
      id: "ORD-2024-004",
      customer: "Emily Davis",
      email: "emily@example.com",
      items: [{ name: "1/72 SR-71 Blackbird", quantity: 1, price: 65.0 }],
      total: 65.0,
      status: "Cancelled",
      date: "Dec 30, 2025",
      shipping: "Standard Shipping",
      address: "321 Cedar Blvd, Miami, FL 33101",
    },
    {
      id: "ORD-2024-005",
      customer: "James Wilson",
      email: "james.w@example.com",
      items: [{ name: "Custom 1/18 F-18 Hornet", quantity: 1, price: 450.0 }],
      total: 450.0,
      status: "Negotiating",
      date: "Jan 3, 2026",
      shipping: "Express Shipping",
      address: "Pending Address",
      messages: [
        {
          sender: "user",
          text: "Hi, I noticed the price is $450. Can we remove the extra weathering package to bring it under $400?",
          time: "10:30 AM",
        },
      ],
    },
  ]);

  const filteredOrders =
    activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Shipped":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-3.5 h-3.5" />;
      case "Shipped":
        return <Truck className="w-3.5 h-3.5" />;
      case "Delivered":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "Cancelled":
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // Create Order Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    email: "",
    item: "",
    price: "",
    status: "Processing",
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: `ORD-2026-${Math.floor(Math.random() * 1000)}`,
      customer: newOrder.customer,
      email: newOrder.email,
      items: [
        { name: newOrder.item, quantity: 1, price: parseFloat(newOrder.price) },
      ],
      total: parseFloat(newOrder.price),
      status: newOrder.status,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      shipping: "Standard Shipping",
      address: "123 New St, New York, NY",
    };
    setOrders([order, ...orders]);
    setIsCreateOpen(false);
    setNewOrder({
      customer: "",
      email: "",
      item: "",
      price: "",
      status: "Processing",
    });
    toast.success("Order created successfully");
  };

  const handlePrintLabel = () => {
    window.print();
    toast.success("Printing label...");
  };

  const handleContactCustomer = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("orderId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.status !== newStatus) {
          toast.success(`Order ${orderId} moved to ${newStatus}`);
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
            Orders
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and fulfill customer orders.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "board"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200"
          >
            Create Order
          </button>
        </div>
      </div>

      {/* Stats/Filters (List View Only) */}
      {viewMode === "list" && (
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all relative",
                activeTab === tab
                  ? "text-slate-900 bg-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full mb-1" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* BOARD VIEW */}
      {viewMode === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)] overflow-x-auto pb-4">
          {columns.map((status) => (
            <div
              key={status}
              className="bg-slate-50/50 rounded-2xl border border-slate-200 flex flex-col h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur z-10 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      status === "Processing"
                        ? "bg-blue-500"
                        : status === "Shipped"
                        ? "bg-purple-500"
                        : "bg-green-500"
                    )}
                  />
                  <h3 className="font-bold text-slate-900">{status}</h3>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">
                    {orders.filter((o) => o.status === status).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                {orders
                  .filter((o) => o.status === status)
                  .map((order) => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          {order.id}
                        </span>
                        <div className="bg-slate-50 rounded-full py-0.5 px-2 text-[10px] text-slate-500 font-bold border border-slate-100">
                          ${order.total}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-0.5">
                        {order.items[0].name}
                      </h4>
                      {order.items.length > 1 && (
                        <p className="text-xs text-slate-400">
                          + {order.items.length - 1} more items
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                            {order.customer.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[80px]">
                            {order.customer}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {order.date}
                        </span>
                      </div>
                    </div>
                  ))}
                {orders.filter((o) => o.status === status).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                    <p className="text-xs text-slate-400 font-medium">Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW (Original) */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={cn(
                "bg-white rounded-2xl border transition-all overflow-hidden",
                expandedOrder === order.id
                  ? "border-indigo-200 shadow-md ring-1 ring-indigo-100"
                  : "border-slate-200 shadow-sm hover:border-indigo-100"
              )}
            >
              {/* Header Row */}
              <div
                className="p-6 flex flex-col md:flex-row items-center cursor-pointer hover:bg-slate-50/50 transition-colors gap-4"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{order.id}</h3>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5",
                          getStatusColor(order.status)
                        )}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {order.items.length} items • {order.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {order.customer}
                    </p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-bold text-slate-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 transition-transform",
                      expandedOrder === order.id && "rotate-180"
                    )}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="bg-slate-50/50 border-t border-slate-100 p-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {item.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                          Shipping Details
                        </h4>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                Address
                              </p>
                              <p className="text-sm text-slate-700 font-medium">
                                {order.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Truck className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                Method
                              </p>
                              <p className="text-sm text-slate-700 font-medium">
                                {order.shipping}
                              </p>
                              {order.tracking && (
                                <p className="text-xs text-indigo-600 font-bold mt-1 cursor-pointer hover:underline">
                                  Track: {order.tracking}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrintLabel}
                          className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm active:scale-95"
                        >
                          Print Label
                        </button>
                        <button
                          onClick={() => handleContactCustomer(order.email)}
                          className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 active:scale-95"
                        >
                          Contact Customer
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message / Negotiation Section */}
                  {order.messages && order.messages.length > 0 && (
                    <div className="mt-8 border-t border-slate-200 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                        Negotiation History
                      </h4>

                      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                        <div className="space-y-4">
                          {order.messages.map((msg, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex gap-4 max-w-2xl",
                                msg.sender === "admin"
                                  ? "ml-auto flex-row-reverse"
                                  : ""
                              )}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                  msg.sender === "admin"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-500"
                                )}
                              >
                                <span className="text-xs font-bold">
                                  {msg.sender === "admin" ? "A" : "U"}
                                </span>
                              </div>
                              <div>
                                <div
                                  className={cn(
                                    "p-4 rounded-2xl text-sm font-medium",
                                    msg.sender === "admin"
                                      ? "bg-indigo-600 text-white"
                                      : "bg-slate-50 text-slate-600"
                                  )}
                                >
                                  {msg.text}
                                </div>
                                <p
                                  className={cn(
                                    "text-[10px] text-slate-400 mt-1",
                                    msg.sender === "admin" ? "text-right" : ""
                                  )}
                                >
                                  {msg.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-6">
                          <div className="flex gap-4">
                            <textarea
                              placeholder="Type your reply or new quote details..."
                              className="flex-1 bg-white border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none h-24"
                            />
                            <div className="flex flex-col gap-2">
                              <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-sm transition-colors">
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  toast.success("Quote updated successfully")
                                }
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 p-3 rounded-lg shadow-sm transition-colors text-xs font-bold whitespace-nowrap"
                              >
                                Update Quote
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold">No orders found</h3>
              <p className="text-slate-500 text-sm">
                There are no orders with this status.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Order Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-900">
                Create New Order
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Customer Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  value={newOrder.customer}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customer: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  value={newOrder.email}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Product
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  value={newOrder.item}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, item: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    value={newOrder.price}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                    value={newOrder.status}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, status: e.target.value })
                    }
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all mt-4"
              >
                Create Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
