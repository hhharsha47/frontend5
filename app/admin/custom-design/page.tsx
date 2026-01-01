"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  FileText,
  Plus,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { toast } from "sonner";

type RequestStatus =
  | "Pending"
  | "In Review"
  | "Approved"
  | "Completed"
  | "Rejected";

interface DesignRequest {
  id: string;
  clientName: string;
  email: string;
  subject: string;
  message?: string;
  status: RequestStatus;
  date: string;
  budget: string;
}

const initialRequests: DesignRequest[] = [
  {
    id: "REQ-001",
    clientName: "Michael Chen",
    email: "michael.chen@example.com",
    subject: "1/48 F-14 Tomcat - Top Gun Maverick",
    message:
      "I want a detailed replica of Maverick's F-14 from the new movie. Heavy weathering required.",
    status: "Pending",
    date: "2024-03-15",
    budget: "$850 - $1,200",
  },
  {
    id: "REQ-002",
    clientName: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "P-51D Mustang Restoration",
    message:
      "Restoration of a vintage kit my grandfather built. Needs new decals and paint.",
    status: "In Review",
    date: "2024-03-14",
    budget: "$400 - $600",
  },
  {
    id: "REQ-003",
    clientName: "David Miller",
    email: "d.miller@company.com",
    subject: "Modern Jet Fighter Collection Display",
    message:
      "Need 5 jets built for a corporate display case. High gloss finish.",
    status: "Approved",
    date: "2024-03-12",
    budget: "$2,500+",
  },
  {
    id: "REQ-004",
    clientName: "James Wilson",
    email: "j.wilson@example.com",
    subject: "Custom Sci-Fi Starship",
    status: "Rejected",
    date: "2024-03-10",
    budget: "$300",
  },
  {
    id: "REQ-005",
    clientName: "Emily Davis",
    email: "emily.d@studio.com",
    subject: "WWII Tank Diorama - Battle of the Bulge",
    status: "Completed",
    date: "2024-02-28",
    budget: "$1,500",
  },
];

export default function CustomDesignPage() {
  const [requests, setRequests] = useState<DesignRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Modal States
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // New Request Form State
  const [newRequest, setNewRequest] = useState<Partial<DesignRequest>>({
    clientName: "",
    email: "",
    subject: "",
    budget: "",
    status: "Pending",
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `REQ-00${requests.length + 1}`;
    const date = new Date().toISOString().split("T")[0];

    const request: DesignRequest = {
      id,
      date,
      clientName: newRequest.clientName || "",
      email: newRequest.email || "",
      subject: newRequest.subject || "",
      budget: newRequest.budget || "TBD",
      status: "Pending",
      message: newRequest.message || "",
    };

    setRequests([request, ...requests]);
    setIsNewRequestOpen(false);
    setNewRequest({
      clientName: "",
      email: "",
      subject: "",
      budget: "",
      message: "",
    });
    toast.success("New commission request created successfully!");
  };

  const handleDeleteRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this request?")) {
      setRequests(requests.filter((r) => r.id !== id));
      toast.error("Request deleted.");
      if (selectedRequest?.id === id) {
        setIsDetailsOpen(false);
        setSelectedRequest(null);
      }
    }
  };

  const handleStatusChange = (status: RequestStatus) => {
    if (selectedRequest) {
      const updatedRequests = requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status } : r
      );
      setRequests(updatedRequests);
      setSelectedRequest({ ...selectedRequest, status });
      toast.success(`Status updated to ${status}`);
    }
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Client",
      "Email",
      "Subject",
      "Date",
      "Budget",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredRequests.map((req) =>
        [
          req.id,
          `"${req.clientName}"`,
          req.email,
          `"${req.subject}"`,
          req.date,
          `"${req.budget}"`,
          req.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `custom_requests_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report exported successfully!");
  };

  const openDetails = (req: DesignRequest) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "In Review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Approved":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Custom Design Requests
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track custom model commissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search request ID, client, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {[
            "All",
            "Pending",
            "In Review",
            "Approved",
            "Completed",
            "Rejected",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                filterStatus === status
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-24">
                  Request ID
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Client
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Budget
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => openDetails(req)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-medium text-slate-500">
                      {req.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {req.clientName}
                      </p>
                      <p className="text-xs text-slate-500">{req.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className="text-sm font-medium text-slate-700 max-w-xs truncate"
                      title={req.subject}
                    >
                      {req.subject}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {req.budget}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(req);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRequest(req.id, e)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No requests found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">
                New Commission Request
              </h3>
              <button
                onClick={() => setIsNewRequestOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Client Name
                </label>
                <input
                  required
                  value={newRequest.clientName}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, clientName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={newRequest.email}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Subject
                </label>
                <input
                  required
                  value={newRequest.subject}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                  placeholder="e.g. 1/72 Millennium Falcon"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Estimated Budget
                  </label>
                  <input
                    value={newRequest.budget}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, budget: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                    placeholder="$500+"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Notes / Description
                </label>
                <textarea
                  rows={3}
                  value={newRequest.message}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm resize-none"
                  placeholder="Additional details..."
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Slide-over / Modal */}
      {isDetailsOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsDetailsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Request Details
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-slate-400">
                    {selectedRequest.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Selector */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Current Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Pending",
                    "In Review",
                    "Approved",
                    "Completed",
                    "Rejected",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(status as RequestStatus)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedRequest.status === status
                          ? getStatusColor(status as RequestStatus) +
                            " ring-2 ring-offset-1 ring-indigo-500/20"
                          : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Project Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <p className="font-medium text-slate-900">
                      {selectedRequest.subject}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedRequest.message || "No description provided."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Budget
                      </label>
                      <p className="font-medium text-slate-900">
                        {selectedRequest.budget}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Date
                      </label>
                      <p className="font-medium text-slate-900">
                        {selectedRequest.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Client Info
                </h3>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                      {selectedRequest.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {selectedRequest.clientName}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium">
                        {selectedRequest.email}
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-white border border-indigo-200 text-indigo-700 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors shadow-sm">
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
              <button
                onClick={(e) => handleDeleteRequest(selectedRequest.id, e)}
                className="w-full flex items-center justify-center gap-2 text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 py-3 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
