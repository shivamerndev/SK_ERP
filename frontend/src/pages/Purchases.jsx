import {
  Search,
  Plus,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Clock,
  AlertCircle,
  Filter,
  ChevronDown,
  Scale,
  Sparkles,
  Package,
  Printer
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area,
  Line
} from "recharts";
import { showToast } from "../utils/toast.utils";
import AddPurchase from "../purchase/components/AddPurchase.jsx";
import ConfirmModal from "../utils/ConfirmModal.jsx";
import usePurchase from "../purchase/usePurchase";


const Purchases = () => {


  const { productsList, isLoading,
    // Filters state
    searchQuery, setSearchQuery, paymentFilter, setPaymentFilter, dateRangePreset, setDateRangePreset, customStartDate,
    setCustomStartDate, customEndDate, setCustomEndDate, sortBy, setSortBy, sortOrder, setSortOrder,
    // UI state
    showCharts, setShowCharts, isRecordOpen, setIsRecordOpen, selectedPurchase, setSelectedPurchase, isBillOpen,
    setIsBillOpen, isDeleteConfirmOpen, setIsDeleteConfirmOpen,
    // Form state
    purchaseForm, setPurchaseForm,
    // Computed values
    calculatedFormValues, filteredPurchases, stats, comparisons, chartData,
    // Actions
    handleRecordPurchaseSubmit, handleDeleteConfirm, handleExportCSV

  } = usePurchase();

  
  return (
    <div className="space-y-6">

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">Wholesale Purchases Ledger & Restock</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Log raw jewelry batch replenishment costs against metal weights, maintain supplier accounts, and print purchase vouchers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Record Purchase */}
          <button
            onClick={() => {
              setIsRecordOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Record restock bill
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            title="Download CSV purchases ledger"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date presets row */}
      <div className="bg-white border border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Date Range filter (Cost & Weight calculations)</h3>
          </div>

          {dateRangePreset === "Custom" && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold uppercase">From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold uppercase">To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100/50 pt-3">
          {[
            { label: "All Purchase Logs", val: "All" },
            { label: "Today", val: "Today" },
            { label: "Yesterday", val: "Yesterday" },
            { label: "This Week", val: "ThisWeek" },
            { label: "This Month", val: "ThisMonth" },
            { label: "Custom Dates...", val: "Custom" }
          ].map(p => (
            <button
              key={p.val}
              onClick={() => {
                setDateRangePreset(p.val);
                if (p.val !== "Custom") {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${dateRangePreset === p.val
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Purchase Expense</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.totalCost.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Net expenditure (3% GST inc)</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Net Weight Bought</span>
            <h3 className="text-2xl font-extrabold text-slate-800">
              {(stats.totalWeight / 1000).toFixed(2)} kg
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold">{stats.totalWeight.toLocaleString("en-IN")} grams added</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Scale className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Units Restocked</span>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.totalPieces}</h3>
            <p className="text-[10px] text-slate-400">Total jewelry pieces restocked</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Package className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Avg Cost per Gram</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.valPerGram}/g</h3>
            <p className="text-[10px] text-emerald-600 font-bold">Average wholesale rate paid</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Weekly Restock Comparison</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">7d vs Prev 7d</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Expenditure</span>
              <strong className="text-base text-slate-800">₹{comparisons.week.cost.toLocaleString("en-IN")}</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.week.costChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.week.costChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.week.costChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs ₹{comparisons.week.lastCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Silver Weight Bought</span>
              <strong className="text-base text-slate-800">{comparisons.week.weight.toLocaleString("en-IN")} g</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.week.weightChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.week.weightChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.week.weightChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs {comparisons.week.lastWeight.toLocaleString("en-IN")}g</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Monthly Restock Comparison</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">This Month vs Prev Month</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Expenditure</span>
              <strong className="text-base text-slate-800">₹{comparisons.month.cost.toLocaleString("en-IN")}</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.month.costChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.month.costChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.month.costChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs ₹{comparisons.month.lastCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Silver Weight Bought</span>
              <strong className="text-base text-slate-800">{comparisons.month.weight.toLocaleString("en-IN")} g</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.month.weightChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.month.weightChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.month.weightChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs {comparisons.month.lastWeight.toLocaleString("en-IN")}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Visual Restock Analysis (Weight vs. Cost)</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{showCharts ? "Hide Charts" : "Show Charts"}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCharts ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showCharts && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 lg:col-span-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Daily Purchase Cost (INR) vs. Net Silver Weight Bought (Grams)</h4>
              <div className="h-72">
                {chartData.dailyTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.dailyTrendData} margin={{ left: -10, right: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis yAxisId="left" label={{ value: "Cost (₹)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#6366f1" }} tick={{ fill: "#6366f1", fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: "Weight (grams)", angle: 90, position: "insideRight", fontSize: 10, fill: "#10b981" }} tick={{ fill: "#10b981", fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area yAxisId="left" type="monotone" name="Cost (₹)" dataKey="Cost" fill="url(#colorCost)" stroke="#6366f1" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" name="Net Weight (g)" dataKey="Weight (g)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">No transaction dates.</div>
                )}
              </div>
            </div>

            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Category Expenditure</h4>
                <div className="h-56">
                  {chartData.categoryPurchasesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.categoryPurchasesData} margin={{ left: -15, right: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="Cost" name="Cost (₹)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Weight (g)" name="Weight (g)" fill="#10b981" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-xs text-center pt-12">No category purchases.</div>
                  )}
                </div>
              </div>
              <div className="max-h-24 overflow-y-auto text-[10px] space-y-1.5 border-t border-slate-200/50 pt-2.5 ">
                {chartData.categoryPurchasesData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between font-semibold">
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="text-slate-700">₹{Math.round(d.Cost).toLocaleString("en-IN")} ({Math.round(d["Weight (g)"])}g)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Directory Table Area */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bill, items, or supplier..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="date">Bill Date</option>
                <option value="weight">Net Weight Bought</option>
                <option value="cost">Bill Expenditure</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold cursor-pointer"
              >
                {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment channel</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All channels</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {(paymentFilter !== "All" || dateRangePreset !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setPaymentFilter("All");
                  setDateRangePreset("All");
                  setCustomStartDate("");
                  setCustomEndDate("");
                  setSearchQuery("");
                }}
                className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Purchase table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-semibold">Loading purchases from fullstack server...</div>
          ) : filteredPurchases.length > 0 ? (
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date & Bill Code</th>
                  <th className="px-6 py-4">Supplier Vendor</th>
                  <th className="px-6 py-4">Items count</th>
                  <th className="px-6 py-4 text-center">Net Weight (g)</th>
                  <th className="px-6 py-4 text-center">Bhaw rate (Rs/g)</th>
                  <th className="px-6 py-4 text-right">Payable Cost</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPurchases.map((p) => {
                  const netWeight = p.totals?.netWt || p.totalWeight || 0;
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-xs">{p.billCode}</span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {p.date}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800 text-xs uppercase">
                        {p.supplierName}
                      </td>

                      <td className="px-6 py-4 text-slate-600 font-semibold text-xs">
                        {p.items ? p.items.length : 1} products
                      </td>

                      <td className="px-6 py-4 text-center font-bold text-slate-700 text-xs">
                        {netWeight.toFixed(2)} g
                      </td>

                      <td className="px-6 py-4 text-center text-slate-500 font-medium text-xs">
                        ₹{(p.silverRate / 1000).toFixed(2)}/g
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-rose-600 text-xs">
                          ₹{p.cost.toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedPurchase(p);
                              setIsBillOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Bill Voucher
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPurchase(p);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Cancel Purchase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (<div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
            <span className="text-base font-semibold">No purchase records found matching the filters</span>
            <p className="text-xs text-slate-400 mt-1">Try expanding the date range filter above</p>
          </div>
          )}
        </div>
      </div>



      {isRecordOpen && (
        <AddPurchase
          purchaseForm={purchaseForm}
          setPurchaseForm={setPurchaseForm}
          setIsRecordOpen={setIsRecordOpen}
          productsList={productsList}
          calculatedFormValues={calculatedFormValues}
          handleRecordPurchaseSubmit={handleRecordPurchaseSubmit}
        />
      )}


      {isDeleteConfirmOpen && (
        <ConfirmModal
          title="Delete Purchase"
          message="Are you sure you want to delete this purchase?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteConfirmOpen(false);
            setSelectedPurchase(null);
          }}
        />
      )}


      {/* --- SLIDE OUT DRAWER / BILL VOUCHER VIEW --- */}
      {isBillOpen && selectedPurchase && (() => {
        const silverRate = selectedPurchase.silverRate || 0;
        const oldBalFine = selectedPurchase.oldBalanceFine || 0;
        const oldBalAmt = selectedPurchase.oldBalanceAmount || 0;

        const totalLabor = (selectedPurchase.totals?.amount || 0) + oldBalAmt;
        const ratePerGram = silverRate / 1000;

        const jamaDetails = selectedPurchase.jamaDetails || [];
        const cashJamaList = selectedPurchase.cashJamaList || [];

        const jamaFineTotal = jamaDetails.reduce((acc, curr) => acc + (curr.fine || 0), 0);
        const totalFineWeight = (selectedPurchase.totals?.fine || 0) + oldBalFine;

        const outstandingFine = Math.max(0, totalFineWeight - jamaFineTotal);
        const silverCost = outstandingFine * ratePerGram;
        const totalBeforeGST = silverCost + totalLabor;
        const gst = selectedPurchase.cost - totalBeforeGST;

        return (
          <div className="fixed inset-0 z-45 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
            {/* Direct CSS injection for high fidelity printing */}
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #print-bill-area-container, #print-bill-area-container * {
                  visibility: visible !important;
                }
                #print-bill-area-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  background: white !important;
                  color: black !important;
                  box-shadow: none !important;
                  border: none !important;
                  padding: 20px !important;
                }
                .no-print-action {
                  display: none !important;
                }
              }
            `}</style>

            <div
              className="flex-1 cursor-pointer no-print-action"
              onClick={() => setIsBillOpen(false)}
            />

            <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden no-print:w-full no-print:max-w-none">

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 no-print-action">
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">Wholesale Restock Bill</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Estimate Format Viewer</span>
                </div>
                <button
                  onClick={() => setIsBillOpen(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100/50">

                {/* Printable receipt pad container */}
                <div
                  id="print-bill-area-container"
                  className="bg-[#faf9f5] p-6 sm:p-8 rounded-xl border border-neutral-300 space-y-5 relative shadow-md text-neutral-900 "
                >
                  {/* Faded diagonal red watermark stamp */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none z-0">
                    <div className="border-[6px] border-red-600 text-red-600 font-extrabold px-8 py-3 text-5xl uppercase tracking-widest rotate-[-12deg] rounded-xl">
                      ROUGH ESTIMATE
                    </div>
                  </div>

                  {/* Header stamp / invocation */}
                  <div className="text-center pb-2 border-b-2 border-double border-neutral-800 relative z-10">
                    <h4 className="font-bold tracking-widest text-sm text-neutral-950 font-serif">SHREE GANESHAYA NAMAH</h4>
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider block mt-1">
                      {"<< ROUGH ESTIMATE >>"}
                    </span>
                  </div>

                  {/* Metadata fields */}
                  <div className="flex justify-between items-start text-xs relative z-10 pt-2 ">
                    <div className="space-y-1">
                      <div>
                        <span className="text-neutral-500 font-semibold">SL. NO. - </span>
                        <strong className="underline text-neutral-950 font-bold">{selectedPurchase.billCode}</strong>
                      </div>
                      <div className="pt-2 font-serif text-sm font-black text-neutral-900 tracking-wide uppercase">
                        {selectedPurchase.supplierName}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-neutral-500 block">2:18 pm</span>
                      <strong className="text-neutral-900 font-bold">{selectedPurchase.date}</strong>
                    </div>
                  </div>

                  {/* Bill grid table */}
                  <div className="relative z-10 pt-3 overflow-x-auto">
                    <table className="w-full text-center border-collapse text-[10px] sm:text-xs">
                      <thead>
                        <tr className="border-t border-b-2 border-neutral-800 text-neutral-950 font-extrabold">
                          <th className="py-2 pr-1.5 text-right border-r border-neutral-300 w-[14%]">Amount</th>
                          <th className="py-2 px-2 text-center border-r border-neutral-300 w-[24%]">Item</th>
                          <th className="py-2 px-1.5 text-center border-r border-neutral-300 w-[10%]">Weight</th>
                          <th className="py-2 px-1.5 text-center border-r border-neutral-300 w-[8%]">Less</th>
                          <th className="py-2 px-1.5 text-center border-r border-neutral-300 w-[11%]">Net Wt.</th>
                          <th className="py-2 px-1.5 text-center border-r border-neutral-300 w-[12%]">Tunch</th>
                          <th className="py-2 px-1.5 text-center border-r border-neutral-300 w-[10%]">Lab.</th>
                          <th className="py-2 pl-2 text-right w-[11%]">Fine</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-300 font-semibold text-neutral-800">
                        {selectedPurchase.items && selectedPurchase.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-neutral-200">
                            <td className="py-2 pr-1.5 text-right font-bold border-r border-neutral-300 text-neutral-950">
                              {Math.round(item.amount).toLocaleString("en-IN")}
                            </td>
                            <td className="py-2 px-2 text-center border-r border-neutral-300 leading-tight">
                              <span className="font-bold block text-neutral-950">{item.productName}</span>
                              <span className="text-[9px] text-neutral-500  block mt-0.5">({item.quantity} pcs)</span>
                            </td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300">
                              {item.weight.toFixed(2)}
                            </td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300">
                              {item.less > 0 ? item.less.toFixed(2) : "-"}
                            </td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300 font-bold text-neutral-950">
                              {item.netWeight.toFixed(2)}
                            </td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300  text-[10px]">
                              {item.tunch}
                            </td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300 text-[10px]">
                              {item.labRateType === "PER_GRAM" ? `${item.labRate}/g` : item.labRateType === "PER_KG" ? `${item.labRate}/kg` : `${item.labRate}`}
                            </td>
                            <td className="py-2 pl-2 text-right font-bold text-neutral-950">
                              {Math.round(item.fine)}
                            </td>
                          </tr>
                        ))}

                        {/* New Total Row */}
                        <tr className="border-b border-neutral-400 bg-neutral-100/40">
                          <td className="py-2 pr-1.5 text-right font-extrabold border-r border-neutral-300 text-neutral-900">
                            {Math.round(selectedPurchase.totals?.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-2 px-2 text-center font-bold border-r border-neutral-300">New Total</td>
                          <td className="py-2 px-1.5 text-center font-bold border-r border-neutral-300">{(selectedPurchase.totals?.weight || 0).toFixed(2)}</td>
                          <td className="py-2 px-1.5 text-center border-r border-neutral-300">{(selectedPurchase.totals?.less || 0).toFixed(2)}</td>
                          <td className="py-2 px-1.5 text-center font-bold border-r border-neutral-300">{(selectedPurchase.totals?.netWt || 0).toFixed(2)}</td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 pl-2 text-right font-extrabold text-neutral-900">{(selectedPurchase.totals?.fine || 0).toFixed(2)}</td>
                        </tr>

                        {/* Old Balance Row */}
                        <tr className="border-b border-neutral-300 text-neutral-600">
                          <td className="py-2 pr-1.5 text-right border-r border-neutral-300">
                            {oldBalAmt > 0 ? oldBalAmt.toLocaleString("en-IN") : ""}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-neutral-300 text-[10px]">Old Balance (Pending)</td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 pl-2 text-right text-neutral-500">{oldBalFine.toFixed(2)}</td>
                        </tr>

                        {/* Total Row */}
                        <tr className="border-b-2 border-neutral-800 bg-neutral-200/20 font-black">
                          <td className="py-2 pr-1.5 text-right border-r border-neutral-300 text-neutral-950">
                            {totalLabor.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-neutral-300 text-neutral-950">Total</td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 pl-2 text-right text-neutral-950">{totalFineWeight.toFixed(2)}</td>
                        </tr>

                        {/* Jama details / Kachhi returns */}
                        {jamaDetails.length > 0 && (
                          <tr className="border-none">
                            <td className="py-1 pr-1.5 border-r border-neutral-300"></td>
                            <td className="py-1 px-2 text-center font-extrabold text-[9px] text-neutral-500 border-r border-neutral-300 tracking-wider">Jama Detail (Credit Items)</td>
                            <td className="py-1 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-1 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-1 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-1 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-1 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-1 pl-2 text-right"></td>
                          </tr>
                        )}

                        {jamaDetails.map((jama, idx) => (
                          <tr key={idx} className="border-b border-neutral-200 text-neutral-600">
                            <td className="py-2 pr-1.5 text-right border-r border-neutral-300 text-neutral-400">-</td>
                            <td className="py-2 px-2 text-center border-r border-neutral-300 text-[10px]">{jama.description || "KACHHI / Exchange"}</td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300">{jama.weight.toFixed(2)}</td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300">{jama.less > 0 ? jama.less.toFixed(2) : "-"}</td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300">{jama.netWeight.toFixed(2)}</td>
                            <td className="py-2 px-1.5 text-center border-r border-neutral-300">{jama.tunch}%</td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 pl-2 text-right text-neutral-800">{jama.fine.toFixed(2)}</td>
                          </tr>
                        ))}

                        {jamaDetails.length > 0 && (
                          <tr className="border-b-2 border-neutral-800 bg-neutral-100/40">
                            <td className="py-2 pr-1.5 text-right border-r border-neutral-300 text-neutral-500">0</td>
                            <td className="py-2 px-2 text-center border-r border-neutral-300 font-bold">Jama Total</td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 pl-2 text-right text-neutral-800">{jamaFineTotal.toFixed(2)}</td>
                          </tr>
                        )}

                        {/* Bhaw Calculation row */}
                        <tr className="border-b border-neutral-300 bg-amber-50/20 font-black">
                          <td className="py-2 pr-1.5 text-right border-r border-neutral-300 text-indigo-700">
                            {Math.round(silverCost).toLocaleString("en-IN")}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-neutral-300 leading-tight">
                            <span className="font-bold text-neutral-900">Bhaw @ {(silverRate / 1000).toFixed(2)}/g</span>
                            <span className="text-[9px] text-neutral-400 block font-normal ">({silverRate.toLocaleString("en-IN")} Rs. Per Kg.)</span>
                          </td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 pl-2 text-right text-indigo-700">{outstandingFine.toFixed(2)}</td>
                        </tr>

                        {/* GST tax */}
                        <tr className="border-b border-neutral-300 text-neutral-600">
                          <td className="py-2 pr-1.5 text-right border-r border-neutral-300">
                            {gst.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-neutral-300 text-[10px]">
                            GST Stamp Structure (3% Included)
                          </td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 pl-2 text-right"></td>
                        </tr>

                        {/* Grand Total */}
                        <tr className="border-b-2 border-neutral-800 text-neutral-950 font-black text-xs sm:text-sm bg-rose-50/20">
                          <td className="py-2 pr-1.5 text-right border-r border-neutral-300 text-rose-700">
                            ₹{selectedPurchase.cost.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-neutral-300 uppercase tracking-wide text-rose-700">Grand Total Net</td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2 pl-2 text-right text-rose-700"></td>
                        </tr>

                        {/* Cash Jama / Bank Transfer Payments list */}
                        {cashJamaList.map((cash, idx) => (
                          <tr key={idx} className="border-b border-neutral-800 font-extrabold bg-emerald-50/30">
                            <td className="py-2 pr-1.5 text-right border-r border-neutral-300 text-emerald-700">
                              {cash.amount.toLocaleString("en-IN")}
                            </td>
                            <td className="py-2 px-2 text-center border-r border-neutral-300 text-emerald-800 uppercase tracking-wide">
                              {cash.type.replace("_", " ")} JAMA {cash.description ? `(${cash.description})` : ""}
                            </td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 px-1.5 border-r border-neutral-300"></td>
                            <td className="py-2 pl-2 text-right"></td>
                          </tr>
                        ))}

                        {/* Final Outstanding row */}
                        <tr className="font-black text-neutral-950 bg-neutral-200/50">
                          <td className="py-2.5 pr-1.5 text-right border-r border-neutral-300 text-neutral-950 ">
                            ₹{(selectedPurchase.finalOutstanding?.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-2.5 px-2 text-center border-r border-neutral-300 uppercase tracking-widest text-[10px] text-neutral-950">
                            Final Outstanding
                          </td>
                          <td className="py-2.5 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2.5 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2.5 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2.5 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2.5 px-1.5 border-r border-neutral-300"></td>
                          <td className="py-2.5 pl-2 text-right text-emerald-700 ">
                            {(selectedPurchase.finalOutstanding?.fine || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Foot Note stamp */}
                  <div className="pt-3 border-t border-dashed border-neutral-400 flex justify-between items-center text-[9px] text-neutral-500 font-semibold relative z-10">
                    <span>* System Generated Estimate Copy</span>
                    <span className="uppercase">Final Kachhi- 1 Dhada- {(selectedPurchase.totals?.weight || 0).toFixed(0)} Fine- {totalFineWeight.toFixed(0)}</span>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 no-print-action">
                <button
                  onClick={() => setIsBillOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Estimate
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Purchases;