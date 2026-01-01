"use client";

import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MapPin,
  Star,
  Download,
  X,
  ChevronRight,
  Box,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
type TabType = "active" | "past";

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
    total: "$45.00",
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
        name: "Weathering Pigment Set - Desert Sand",
        price: "$15.00",
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Pigments",
        quantity: 1,
      },
      {
        name: "Precision Modeling Nippers",
        price: "$30.00",
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Nippers",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-7782-XJ",
    date: "March 15, 2024",
    total: "$129.99",
    status: "Processing",
    steps: [
      { label: "Order Placed", date: "Mar 15, 8:00 PM", completed: true },
      { label: "Processing", date: "In Progress", completed: true },
      { label: "Shipped", date: "Pending", completed: false },
      { label: "Delivered", date: "Pending", completed: false },
    ],
    items: [
      {
        name: "1/48 F-14 Tomcat 'Top Gun'",
        price: "$129.99",
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=F-14+Tomcat",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-3321-KL",
    date: "February 28, 2024",
    total: "$250.00",
    status: "Delivered",
    steps: [
      { label: "Order Placed", date: "Feb 28", completed: true },
      { label: "Processing", date: "Feb 29", completed: true },
      { label: "Shipped", date: "Mar 1", completed: true },
      { label: "Delivered", date: "Mar 3", completed: true },
    ],
    items: [
      {
        name: "Custom Commission: P-51D Mustang",
        price: "$250.00",
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=P-51D+Mustang",
        quantity: 1,
      },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (activeTab === "active") {
      return matchesSearch && ["Processing", "Shipped"].includes(order.status);
    } else {
      return matchesSearch && ["Delivered", "Cancelled"].includes(order.status);
    }
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display mb-2">
              My Orders
            </h1>
            <p className="text-slate-500">
              Manage your purchases and track shipments.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8">
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
            <CheckCircle className="w-4 h-4" />
            Past Orders
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
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
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
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
                          <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700 hover:underline">
                            Buy Again
                          </button>
                          {order.status === "Delivered" && (
                            <button
                              onClick={() => setReviewItem(item)}
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
                You don't have any {activeTab} orders.
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
                    className="text-slate-200 hover:text-yellow-400 transition-colors focus:outline-none focus:text-yellow-400"
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <textarea
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  placeholder="Share your thoughts..."
                ></textarea>
                <button
                  onClick={() => {
                    toast.success("Review submitted successfully!");
                    setReviewItem(null);
                  }}
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
    </div>
  );
}
