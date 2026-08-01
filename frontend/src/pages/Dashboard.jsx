import { useState, useMemo } from "react";
import useAuth from "../auth/useAuth.js";
import { Calendar as CalendarIcon, Filter, Download, ChevronDown, Layers, X } from "lucide-react";
import KpiCards from "../dashboard/components/KpiCards.jsx";
import ChartArea from "../dashboard/components/ChartArea.jsx";
import LowerGrid from "../dashboard/components/LowerGrid.jsx";


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

  // Date Range Picker Options
  const dateOptions = [
    "Jul 01, 2026 - Jul 31, 2026",
    "Last 30 Days",
    "This Quarter",
    "Year to Date"
  ];

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
              className="appearance-none pl-10 pr-9 py-2 border border-[#e8decb] bg-[#fffdfa] rounded-xl text-xs font-semibold text-[#2c1d11] focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 cursor-pointer shadow-xs"
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] rounded-xl text-xs font-bold cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60 transition-all"
            >
              <Layers className="w-4 h-4" />
              Customize
            </button>
          ) : (
            <>
              <button
                onClick={() => alert("Filter configuration opened.")}
                className="flex items-center gap-2 px-4 py-2 bg-[#fffdfa] border border-[#e8decb] text-[#2c1d11] rounded-xl text-xs font-semibold hover:bg-[#f7f0e3] cursor-pointer shadow-xs transition-all"
              >
                <Filter className="w-4 h-4 text-[#786452]" />
                Filters
              </button>
              <button
                onClick={() => alert("Exporting report...")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] rounded-xl text-xs font-bold cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60 transition-all"
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

          <LowerGrid layout={layout} selectedDateRange={selectedDateRange} />

        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMIZE MODAL POPUP                                     */}
      {/* ========================================================= */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0502]/60 backdrop-blur-sm p-4">
          <div className="bg-[#fffdfa] border border-[#e8decb] rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
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
                className="flex-1 py-2 bg-[#f7f0e3] border border-[#e8decb] text-[#2c1d11] rounded-xl text-xs font-semibold hover:bg-[#efe3d0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={applyLayoutChanges}
                className="flex-1 py-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] rounded-xl text-xs font-bold shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60 transition-all cursor-pointer"
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