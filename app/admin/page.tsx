"use client";

import {
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  CreditCard,
  Package,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      trend: "up",
      icon: DollarSign,
      color: "indigo",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      label: "Active Orders",
      value: "156",
      change: "+12.5% from last month",
      trend: "up",
      icon: ShoppingBag,
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "New Customers",
      value: "89",
      change: "+4.3% from last month",
      trend: "up",
      icon: Users,
      color: "orange",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      label: "Pending Requests",
      value: "12",
      change: "-2 from yesterday",
      trend: "down",
      icon: Clock,
      color: "yellow",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      href: "/admin/custom-design",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New Order",
      user: "Michael Chen",
      detail: "purchased 1/48 F-14 Tomcat",
      amount: "$129.99",
      time: "2 hours ago",
      initials: "MC",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      action: "Commission Request",
      user: "Sarah Johnson",
      detail: "requested P-51D Mustang Restoration",
      amount: "Quote Pending",
      time: "4 hours ago",
      initials: "SJ",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      id: 3,
      action: "New Review",
      user: "David Miller",
      detail: "left a review on 'Modern Jet Fighter'",
      amount: "⭐⭐⭐⭐⭐",
      time: "6 hours ago",
      initials: "DM",
      color: "bg-green-100 text-green-700",
    },
    {
      id: 4,
      action: "System Update",
      user: "System Admin",
      detail: "Catalog updated with 5 new items",
      amount: "-",
      time: "1 day ago",
      initials: "SA",
      color: "bg-slate-100 text-slate-700",
    },
  ];

  const handleDownloadReport = () => {
    toast.success("Downloading Dashboard Report...");
    // Simulating download delay
    setTimeout(() => {
      toast.dismiss();
      toast.success("Report downloaded successfully");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of your store's performance.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95 transform"
          >
            Download Report
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-95 transform">
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Wrapper = stat.href ? Link : "div";
          return (
            <Wrapper
              key={stat.label}
              href={stat.href || ""}
              className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:border-slate-200 group cursor-default"
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <stat.icon className="w-7 h-7" />
                </div>
                {stat.trend === "up" ? (
                  <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +2.5%
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                  </div>
                )}
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium tracking-wide uppercase text-[11px]">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">
                  {stat.change}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>
            <button className="text-sm text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="p-6 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.action}
                    </h4>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">
                    <span className="font-medium text-slate-900">
                      {item.user}
                    </span>{" "}
                    {item.detail}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Top Products</h3>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                View Report
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "1/48 F-14 Tomcat",
                  sales: 24,
                  revenue: "$3,120",
                  color: "bg-slate-100",
                },
                {
                  name: "P-51D Mustang",
                  sales: 18,
                  revenue: "$1,890",
                  color: "bg-orange-50",
                },
                {
                  name: "T-90 Main Battle Tank",
                  sales: 12,
                  revenue: "$1,140",
                  color: "bg-green-50",
                },
              ].map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${product.color} flex items-center justify-center text-xs font-bold text-slate-500`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {product.revenue}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
              Manage Catalog
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6">Quick Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-100 rounded-lg text-green-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Monthly Goal
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">85%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full w-[85%] shadow-sm" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 rounded-lg text-purple-600">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Inventory
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Good
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full w-[92%] shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
