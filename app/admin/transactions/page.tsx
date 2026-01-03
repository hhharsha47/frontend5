"use client";

import {
  Search,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [transactions, setTransactions] = useState([
    {
      id: "TRX-9821",
      user: "Michael Chen",
      email: "michael@example.com",
      amount: 129.99,
      status: "completed",
      date: "Jan 3, 2026",
      method: "Credit Card (**** 4242)",
    },
    {
      id: "TRX-9820",
      user: "Sarah Johnson",
      email: "sarah@example.com",
      amount: 245.0,
      status: "pending",
      date: "Jan 3, 2026",
      method: "PayPal",
    },
    {
      id: "TRX-9819",
      user: "David Miller",
      email: "david@example.com",
      amount: 59.5,
      status: "completed",
      date: "Jan 2, 2026",
      method: "Credit Card (**** 1234)",
    },
    {
      id: "TRX-9818",
      user: "Emily Davis",
      email: "emily@example.com",
      amount: 890.0,
      status: "completed",
      date: "Jan 2, 2026",
      method: "Bank Transfer",
    },
    {
      id: "TRX-9817",
      user: "Robert Wilson",
      email: "robert@example.com",
      amount: 12.99,
      status: "failed",
      date: "Jan 1, 2026",
      method: "Credit Card (**** 9876)",
    },
    {
      id: "TRX-9816",
      user: "Jessica Taylor",
      email: "jessica@example.com",
      amount: 156.0,
      status: "completed",
      date: "Jan 1, 2026",
      method: "Apple Pay",
    },
    {
      id: "TRX-9815",
      user: "James Anderson",
      email: "james@example.com",
      amount: 45.0,
      status: "refunded",
      date: "Dec 31, 2025",
      method: "PayPal",
    },
  ]);

  const handleExport = () => {
    let csv = "ID,User,Email,Amount,Status,Date,Method\n";
    filteredTransactions.forEach((t) => {
      csv += `${t.id},${t.user},${t.email},${t.amount},${t.status},${t.date},${t.method}\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transactions exported successfully");
  };

  const handleRefund = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "refunded" } : t))
    );
    toast.success(`Refund processed for ${id}`);
  };

  const filteredTransactions = transactions.filter(
    (trx) =>
      (statusFilter === "All" || trx.status === statusFilter.toLowerCase()) &&
      (trx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <ArrowDownLeft className="w-3 h-3" /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
            Transactions
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and view all payment transactions.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["All", "Completed", "Pending", "Failed", "Refunded"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  statusFilter === status
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600 font-mono">
                    {trx.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">
                        {trx.user}
                      </span>
                      <span className="text-xs text-slate-500">
                        {trx.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {trx.date}
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {trx.method}
                    </p>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(trx.status)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    ${trx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {trx.status === "completed" && (
                        <button
                          onClick={() => handleRefund(trx.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                        >
                          Refund
                        </button>
                      )}
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredTransactions.length}
            </span>{" "}
            results
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-50 disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
