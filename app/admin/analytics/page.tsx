"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
  Calendar,
  Download,
  Filter,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  // State for chart simulation
  const [chartData, setChartData] = useState([
    { day: "Mon", value: 4500 },
    { day: "Tue", value: 5200 },
    { day: "Wed", value: 3800 },
    { day: "Thu", value: 6500 },
    { day: "Fri", value: 8900 },
    { day: "Sat", value: 12000 },
    { day: "Sun", value: 10500 },
  ]);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // Simulate data update
    if (range === "Last 7 Days") {
      setChartData([
        { day: "Mon", value: 4500 },
        { day: "Tue", value: 5200 },
        { day: "Wed", value: 3800 },
        { day: "Thu", value: 6500 },
        { day: "Fri", value: 8900 },
        { day: "Sat", value: 12000 },
        { day: "Sun", value: 10500 },
      ]);
      toast.success("Data updated for Last 7 Days");
    } else if (range === "Last 30 Days") {
      setChartData([
        { day: "W1", value: 25000 },
        { day: "W2", value: 28000 },
        { day: "W3", value: 22000 },
        { day: "W4", value: 35000 },
        { day: "W5", value: 15000 }, // Fallback for 30 days visualization
      ]);
      toast.success("Data updated for Last 30 Days");
    } else if (range === "This Year") {
      setChartData([
        { day: "Q1", value: 120000 },
        { day: "Q2", value: 145000 },
        { day: "Q3", value: 110000 },
        { day: "Q4", value: 180000 },
      ]);
      toast.success("Data updated for This Year");
    }
  };

  const handleDownloadReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value,Change\n" +
      "Total Revenue,$124,500,+12.5%\n" +
      "Total Orders,1,482,+8.2%\n" +
      "Conversion Rate,3.24%,-0.4%\n" +
      "New Customers,342,+18.2%";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `analytics_report_${dateRange.replace(/ /g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded successfully");
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState("Revenue"); // Revenue, Orders, Growth

  // Close dropdowns on outside click
  const filterRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMetricColor = () => {
    switch (activeMetric) {
      case "Revenue":
        return {
          stroke: "#4f46e5",
          fill: "url(#gradientRevenue)",
          text: "text-indigo-600",
        };
      case "Orders":
        return {
          stroke: "#2563eb",
          fill: "url(#gradientOrders)",
          text: "text-blue-600",
        };
      case "Growth":
        return {
          stroke: "#059669",
          fill: "url(#gradientGrowth)",
          text: "text-emerald-600",
        };
      default:
        return {
          stroke: "#4f46e5",
          fill: "url(#gradientRevenue)",
          text: "text-indigo-600",
        };
    }
  };

  const maxSale = Math.max(...chartData.map((d) => d.value)) * 1.2; // Add headroom

  // Helper to generate smooth SVG path
  const getPath = (data: typeof chartData, height: number, width: number) => {
    if (data.length === 0) return "";

    // X spacing
    const stepX = width / (data.length - 1);

    // Map points
    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = height - (d.value / maxSale) * height; // Invert Y
      return [x, y];
    });

    // Generate Path Command
    return points.reduce((path, point, i, a) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;

      // Cubic Bezier Calculation
      const current = a[i - 1];
      const next = point;
      const reverse = a[i + 1]; // Future point for tangent

      // Simple smoothing: use 20% of the distance as control point offset
      const smoothing = 0.2;
      const line = (point[0] - current[0]) * smoothing;
      const startCp = [current[0] + line, current[1]];
      const endCp = [point[0] - line, point[1]];

      // If we want real catmull-rom, it's more complex, but simple bezier works well for this:
      // Actually, standard "smooth line" usually takes average of slopes.
      // Let's use a simpler quadratic curve approach or simplified bezier for stability

      const p0 = a[i - 2] || a[i - 1];
      const p1 = a[i - 1];
      const p2 = point;
      const p3 = a[i + 1] || point;

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;

      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      return `${path} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point[0]},${point[1]}`;
    }, "");
  };

  const chartHeight = 240;
  const chartWidth = 800; // Viewbox width, scalable via CSS
  const areaPath = `${getPath(
    chartData,
    chartHeight,
    chartWidth
  )} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
  const linePath = getPath(chartData, chartHeight, chartWidth);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
            Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            Detailed performance metrics and insights.
          </p>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  isCalendarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCalendarOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                {["Last 7 Days", "Last 30 Days", "This Year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      handleDateRangeChange(range);
                      setIsCalendarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center justify-between group ${
                      dateRange === range
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {range}
                    {dateRange === range && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 border rounded-lg shadow-sm transition-colors ${
                isFilterOpen
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Metric View
                </div>
                {["Revenue", "Orders", "Growth"].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => {
                      setActiveMetric(metric);
                      setIsFilterOpen(false);
                      toast.success(`Viewing ${metric} Analytics`);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center justify-between ${
                      activeMetric === metric
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {metric}
                    {activeMetric === metric && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* AI Insights Widget */}
      <div className="bg-linear-to-r from-indigo-900 via-violet-900 to-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-white">SkyAI Insights</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
                Beta
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wide">
                  <TrendingUp className="w-3 h-3" />
                  Revenue Projection
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sales are trending up. Projected to hit{" "}
                  <span className="text-white font-bold">$145k</span> by month
                  end based on current velocity.
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wide">
                  <Lightbulb className="w-3 h-3" />
                  Inventory Alert
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-white font-bold">1/48 F-14 Tomcat</span>{" "}
                  stock is low relative to high demand. Consider restocking
                  soon.
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wide">
                  <Users className="w-3 h-3" />
                  Customer Tip
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  60% of your sales happen on weekends. Consider scheduling a{" "}
                  <span className="text-white font-bold">Flash Sale</span> for
                  Saturday.
                </p>
              </div>
            </div>
          </div>
          <button className="hidden lg:flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-white transition-colors mt-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            value: "$124,500",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Total Orders",
            value: "1,482",
            change: "+8.2%",
            trend: "up",
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Conversion Rate",
            value: "3.24%",
            change: "-0.4%",
            trend: "down",
            icon: Eye,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "New Customers",
            value: "342",
            change: "+18.2%",
            trend: "up",
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card (Sales) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className={getMetricColor().text}>{activeMetric}</span>{" "}
              Overview
            </h3>
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-100 cursor-pointer hidden"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Custom CSS Bar Chart */}
          <div className="h-80 w-full relative group">
            {/* Chart Data Points / Hover Overlay */}
            <div className="absolute inset-0 z-20 flex items-end justify-between px-2 pb-6 pointer-events-none">
              {/* Invisible columns for hover detection could go here, but pure SVG hover is smoother */}
            </div>

            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="gradientRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradientOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradientGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={chartHeight * p}
                  x2={chartWidth}
                  y2={chartHeight * p}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill */}
              <path d={areaPath} fill={getMetricColor().fill} />

              {/* Main Line */}
              <path
                d={linePath}
                fill="none"
                stroke={getMetricColor().stroke}
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-md"
              />

              {/* Data Points */}
              {chartData.map((d, i) => {
                const stepX = chartWidth / (chartData.length - 1);
                const x = i * stepX;
                const y = chartHeight - (d.value / maxSale) * chartHeight;
                return (
                  <g key={i} className="group/point">
                    {/* Hover Interaction Area */}
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Visible Point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="white"
                      stroke={getMetricColor().stroke}
                      strokeWidth="2"
                      className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200"
                    />

                    {/* Tooltip */}
                    <foreignObject
                      x={x - 40}
                      y={y - 50}
                      width="80"
                      height="40"
                      className="overflow-visible pointer-events-none opacity-0 group-hover/point:opacity-100 transition-all duration-200 -translate-y-2 group-hover/point:translate-y-0"
                    >
                      <div className="bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg text-center shadow-xl">
                        ${d.value.toLocaleString()}
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between mt-2 px-0 text-xs font-bold text-slate-400">
              {chartData.map((d, i) => (
                <div key={i} className="text-center w-8">
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Traffic Sources
          </h3>
          <div className="space-y-6">
            {[
              { label: "Direct", value: 45, color: "bg-indigo-500" },
              { label: "Social Media", value: 32, color: "bg-pink-500" },
              { label: "Organic Search", value: 15, color: "bg-emerald-500" },
              { label: "Referral", value: 8, color: "bg-orange-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-4">
              Device Breakdown
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Desktop</p>
                <p className="font-bold text-slate-900">58%</p>
              </div>
              <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Mobile</p>
                <p className="font-bold text-slate-900">42%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
