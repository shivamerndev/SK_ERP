import { TrendingUp, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

const ChartsSection = ({ chartData, showCharts, setShowCharts }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setShowCharts(!showCharts)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-800">Visual Sales Trend & Item Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">{showCharts ? "Hide Charts" : "Show Charts"}</span>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCharts ? "rotate-180" : ""}`} />
        </div>
      </button>

      {showCharts && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">

          {/* Chart 1: Dual-Axis Cash Revenue vs Fine Weight trend */}
          <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 lg:col-span-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Daily Labor Cash (INR) vs. Sales Fine Weight Sold (Grams)</h4>
            <div className="h-72">
              {chartData.dailyTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData.dailyTrendData} margin={{ left: -10, right: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis yAxisId="left" label={{ value: "Labor Cash (₹)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#6366f1" }} tick={{ fill: "#6366f1", fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: "Fine Weight (grams)", angle: 90, position: "insideRight", fontSize: 10, fill: "#10b981" }} tick={{ fill: "#10b981", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area yAxisId="left" type="monotone" name="Labor Cash (₹)" dataKey="Revenue" fill="url(#colorRevenue)" stroke="#6366f1" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" name="Fine Weight (g)" dataKey="FineWeight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm font-semibold">No transactions available.</div>
              )}
            </div>
          </div>

          {/* Chart 2: Item distribution (Revenue & Weight) */}
          <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Top Item Performance</h4>
              <div className="h-56">
                {chartData.itemPerformanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.itemPerformanceData} margin={{ left: -15, right: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Revenue" name="Labor (₹)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Weight" name="Net Wt (g)" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-slate-400 text-xs text-center pt-20 font-semibold">No item stats.</div>
                )}
              </div>
            </div>
            <div className="max-h-24 overflow-y-auto text-[10px] space-y-1.5 border-t border-slate-200/50 pt-2.5 mt-2">
              {chartData.itemPerformanceData.slice(0, 5).map((d, index) => (
                <div key={index} className="flex items-center justify-between font-semibold">
                  <span className="text-slate-600 truncate">{d.name}:</span>
                  <span className="text-slate-700 ">₹{d.Revenue.toLocaleString("en-IN")} ({d.Weight.toFixed(1)}g)</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChartsSection;
