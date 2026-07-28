import { useState, useMemo } from "react";
import useAuth from "../auth/useAuth.js";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
  Calendar as CalendarIcon,
  Clock,
  LineChart as LineIcon,
  Filter,
  Download,
  ChevronDown,
  Layers,
  CheckSquare,
  Square,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import KpiCards from "../dashboard/components/KpiCards.jsx";
import ChartArea from "../dashboard/components/ChartArea.jsx";
import GlassTooltip from "../dashboard/components/GlassTooltip.jsx";


const Dashboard = () => {

  const { user } = useAuth();
  const activeTab = "Overview"
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Jul 01, 2026 - Jul 31, 2026");
  const [monthlyFilter, setMonthlyFilter] = useState("Monthly");

  // Layout toggles
  const [layout, setLayout] = useState({
    kpiCards: true,
    revenueOverview: true,
    salesByCategory: true,
    topCustomers: true,
    inventorySummary: true,
    taskSummary: true,
    projectsOverview: true,
    calendar: true,
    notifications: true
  });

  // Modal temporary configuration state
  const [tempLayout, setTempLayout] = useState({ ...layout });

  // Interactive Checklist State
  const [tasks, setTasks] = useState([
    { id: 1, name: "Review Pending Invoices", status: "Completed" },
    { id: 2, name: "Stock Verification", status: "In Progress" },
    { id: 3, name: "Approve Leave Requests", status: "Pending" },
    { id: 4, name: "System Backup & Update", status: "Pending" },
    { id: 5, name: "Client Feedback Call", status: "Completed" },
    { id: 6, name: "Q2 Financial Report", status: "In Progress" }
  ]);

  // Calendar Event Selection State
  const [selectedDay, setSelectedDay] = useState(15);
  const calendarEvents = {
    15: "Meeting with Tech Solutions Inc. (2:00 PM)",
    16: "Inventory Audit & Reorder Check (10:00 AM)",
    22: "Website Redesign Go-Live & Review (4:30 PM)"
  };


  // Projects Progress Data
  const projects = [
    { name: "Website Redesign", progress: 75, color: "bg-emerald-500" },
    { name: "Mobile App Development", progress: 45, color: "bg-blue-500" },
    { name: "ERP Implementation", progress: 60, color: "bg-purple-500" },
    { name: "Marketing Campaign", progress: 30, color: "bg-orange-500" }
  ];

  // Date Range Picker Options
  const dateOptions = [
    "Jul 01, 2026 - Jul 31, 2026",
    "Last 30 Days",
    "This Quarter",
    "Year to Date"
  ];

  // Toggle tasks status
  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "Completed" ? "Pending" : t.status === "Pending" ? "In Progress" : "Completed";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };


  const dynamicTaskSummary = useMemo(() => {
    const counts = tasks.reduce(
      (acc, t) => {
        if (t.status === "Completed") acc.Completed++;
        else if (t.status === "In Progress") acc.InProgress++;
        else acc.Pending++;
        return acc;
      },
      { Completed: 0, InProgress: 0, Pending: 0 }
    );
    const total = tasks.length;
    return {
      total,
      chartData: [
        { name: "Completed", value: counts.Completed, color: "#10b981" },
        { name: "In Progress", value: counts.InProgress, color: "#3b82f6" },
        { name: "Pending", value: counts.Pending, color: "#f59e0b" }
      ]
    };
  }, [tasks]);



  const openLayoutModal = () => {
    setTempLayout({ ...layout });
    setShowCustomizeModal(true);
  };

  
  const applyLayoutChanges = () => {
    setLayout({ ...tempLayout });
    setShowCustomizeModal(false);
  };


  return (
    <div className="flex flex-col gap-6">
      {/* Sub-Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl text-slate-900/90 font-bold mt-1">
            Welcome, {user?.fullName || "Manager"}!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Selector */}
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="appearance-none pl-10 pr-9 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm shadow-slate-100"
            >
              {dateOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>

          {/* Dynamic Actions based on Tab selection */}
          {activeTab === "Overview" ? (
            <button
              onClick={openLayoutModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm hover:shadow transition-all"
            >
              <Layers className="w-4 h-4" />
              Customize
            </button>
          ) : (
            <>
              <button
                onClick={() => alert("Filter configuration opened.")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
              >
                <Filter className="w-4 h-4 text-slate-400" />
                Filters
              </button>
              <button
                onClick={() => alert("Exporting report...")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm hover:shadow transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === "Overview" && (
        <div className="flex flex-col gap-6 animate-fade-in">

          {layout.kpiCards && (<KpiCards selectedDateRange={selectedDateRange} />)}

          <ChartArea layout={layout} monthlyFilter={monthlyFilter} setMonthlyFilter={setMonthlyFilter} />


          {/* Lower Grid Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Inventory Summary Widget */}
            {layout.inventorySummary && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <Package className="w-4.5 h-4.5 text-blue-500" /> Inventory Summary
                  </h2>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Inventory report view opened.");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 my-auto">
                  {/* Total Items */}
                  <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <Package className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase">Total Items</span>
                      <strong className="text-sm font-extrabold text-slate-800 mt-0.5">1,245</strong>
                      <span className="text-slate-400 text-[9px] font-semibold mt-0.5">All Items</span>
                    </div>
                  </div>

                  {/* In Stock */}
                  <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase">In Stock</span>
                      <strong className="text-sm font-extrabold text-slate-800 mt-0.5">1,089</strong>
                      <span className="text-emerald-500 text-[9px] font-bold mt-0.5">87.4%</span>
                    </div>
                  </div>

                  {/* Low Stock */}
                  <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase">Low Stock</span>
                      <strong className="text-sm font-extrabold text-slate-800 mt-0.5">23</strong>
                      <span className="text-amber-500 text-[9px] font-bold mt-0.5">1.8%</span>
                    </div>
                  </div>

                  {/* Out of Stock */}
                  <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase">Out of Stock</span>
                      <strong className="text-sm font-extrabold text-slate-800 mt-0.5">133</strong>
                      <span className="text-rose-500 text-[9px] font-bold mt-0.5">10.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task Summary (Interactive Donut & Checklist) */}
            {layout.taskSummary && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-500" /> Tasks Status
                  </h2>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Tasks tracking page opened.");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </a>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Pie graphic */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<GlassTooltip isCurrency={false} />} />
                        <Pie
                          data={dynamicTaskSummary.chartData}
                          innerRadius={28}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dynamicTaskSummary.chartData.map((entry, index) => (
                            <Cell key={`cell-₹{index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[12px] font-extrabold text-slate-800 leading-none">
                        {dynamicTaskSummary.total}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold tracking-tight uppercase mt-0.5">Tasks</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    {dynamicTaskSummary.chartData.map((item, idx) => (
                      <div key={idx} className="flex flex-col text-xs leading-none">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] font-bold pl-4 mt-0.5">
                          {item.value} ({((item.value / dynamicTaskSummary.total) * 100 || 0).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Micro checklist interactive */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 max-h-[120px] overflow-y-auto scrollbar-thin">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-50/80 transition-colors"
                    >
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 text-left cursor-pointer animate-none"
                      >
                        {task.status === "Completed" ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : task.status === "In Progress" ? (
                          <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                        <span className={task.status === "Completed" ? "line-through text-slate-400" : ""}>
                          {task.name}
                        </span>
                      </button>
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ₹{task.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : task.status === "In Progress"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Overview progress list */}
            {layout.projectsOverview && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <LineIcon className="w-4 h-4 text-purple-500" /> Projects Overview
                  </h2>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Project management workspace opened.");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </a>
                </div>

                <div className="flex flex-col gap-3.5 my-auto">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="flex flex-col leading-none">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span className="truncate pr-2">{proj.name}</span>
                        <span className="text-slate-500 font-bold">{proj.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ₹{proj.color} rounded-full transition-all duration-500`}
                          style={{ width: `₹{proj.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Widget with selected event description */}
            {layout.calendar && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-blue-500" /> Calendar
                  </h2>
                </div>

                <div className="my-auto flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-800 mb-2">May 2025</span>

                  {/* Week Header */}
                  <div className="grid grid-cols-7 gap-1 w-full text-center text-[9px] font-bold text-slate-400 mb-1 border-b border-slate-100 pb-1">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 w-full text-center text-[10px] font-bold text-slate-700">
                    {/* Blanks */}
                    <span className="text-slate-200">27</span>
                    <span className="text-slate-200">28</span>
                    <span className="text-slate-200">29</span>
                    <span className="text-slate-200">30</span>
                    {/* Days */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const hasEvent = calendarEvents[day];
                      const isSelected = selectedDay === day;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`relative flex items-center justify-center rounded-full w-5 h-5 mx-auto cursor-pointer transition-colors text-[9px] ₹{isSelected
                            ? "bg-blue-600 text-white font-extrabold"
                            : hasEvent
                              ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                              : "hover:bg-slate-100"
                            }`}
                        >
                          {day}
                          {hasEvent && !isSelected && (
                            <span className="absolute bottom-0.5 w-1 h-1 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Day Event Banner */}
                <div className="mt-3 pt-2 border-t border-slate-100 min-h-[35px] text-center">
                  {calendarEvents[selectedDay] ? (
                    <div className="text-[10px] text-blue-600 font-semibold bg-blue-50/50 p-1.5 rounded-lg border border-blue-100">
                      {calendarEvents[selectedDay]}
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-400 font-semibold italic p-1.5">
                      No schedule for May {selectedDay}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMIZE MODAL POPUP                                     */}
      {/* ========================================================= */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowCustomizeModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Customize Layout</h3>
            <p className="text-xs text-slate-500 mb-4">
              Toggle the sections displayed in the operational summary overview dashboard.
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.kpiCards}
                  onChange={(e) => setTempLayout({ ...tempLayout, kpiCards: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                KPI Metric Cards (Revenue, Orders, Customers, etc.)
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.revenueOverview}
                  onChange={(e) => setTempLayout({ ...tempLayout, revenueOverview: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Revenue Overview Trend Area Chart
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.salesByCategory}
                  onChange={(e) => setTempLayout({ ...tempLayout, salesByCategory: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Sales by Category Donut Chart
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.topCustomers}
                  onChange={(e) => setTempLayout({ ...tempLayout, topCustomers: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Top Customers List
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.liveMetals}
                  onChange={(e) => setTempLayout({ ...tempLayout, liveMetals: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Live Metals Exchange Rates & Calculator
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.inventorySummary}
                  onChange={(e) => setTempLayout({ ...tempLayout, inventorySummary: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Inventory Summary Indicator Blocks
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.taskSummary}
                  onChange={(e) => setTempLayout({ ...tempLayout, taskSummary: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Interactive Task Checklist and Donut Chart
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.projectsOverview}
                  onChange={(e) => setTempLayout({ ...tempLayout, projectsOverview: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Projects Progress Bars
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempLayout.calendar}
                  onChange={(e) => setTempLayout({ ...tempLayout, calendar: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                />
                Interactive Event Calendar Widget
              </label>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applyLayoutChanges}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;