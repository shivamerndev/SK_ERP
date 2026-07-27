import { DollarSign, Scale, FileText } from "lucide-react";

const KpiStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Cash/Labor Revenue */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Labor Revenue (Cash)</span>
          <h3 className="text-2xl font-extrabold text-slate-800">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </h3>
          <p className="text-[10px] text-slate-400">Sum of cash labor charges</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <DollarSign className="w-5.5 h-5.5" />
        </div>
      </div>

      {/* KPI 2: Sales Fine Weight */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Sales Fine Wt.</span>
          <h3 className="text-2xl font-extrabold text-slate-800">
            {stats.totalFine.toFixed(2)} g
          </h3>
          <p className="text-[10px] text-amber-500 font-bold">Metal credit fine weight</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Scale className="w-5.5 h-5.5" />
        </div>
      </div>

      {/* KPI 3: Net Silver Weight */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Net Silver Weight</span>
          <h3 className="text-2xl font-extrabold text-slate-800">
            {(stats.totalWeight / 1000).toFixed(3)} kg
          </h3>
          <p className="text-[10px] text-indigo-500 font-bold">
            {stats.totalWeight.toLocaleString("en-IN")} grams sold
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <Scale className="w-5.5 h-5.5" />
        </div>
      </div>

      {/* KPI 4: Active Invoices */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Active Invoices</span>
          <h3 className="text-2xl font-extrabold text-slate-800">{stats.activeInvoices}</h3>
          <p className="text-[10px] text-emerald-600 font-bold">Estimate sheets logged</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <FileText className="w-5.5 h-5.5" />
        </div>
      </div>
    </div>
  );
};

export default KpiStats;
