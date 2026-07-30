import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

const ComparisonStats = ({ comparisons }) => {
  const renderTrend = (value) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-emerald-600" : "text-rose-600";
    const prefix = isPositive ? "+" : "";

    return (
      <span className={`flex items-center gap-0.5 ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" />
        {prefix}{value}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Weekly Comparison */}
      <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Weekly Performance</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">7d vs Prev 7d</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Labor cash</span>
            <strong className="text-base text-slate-800">
              ₹{comparisons.week.rev.toLocaleString("en-IN")}
            </strong>
            <div className="flex items-center gap-1 mt-1 font-bold">
              {renderTrend(comparisons.week.revChange)}
              <span className="text-[10px] text-slate-400 font-medium ">
                vs ₹{comparisons.week.lastRev.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Fine Weight Sold</span>
            <strong className="text-base text-slate-800">
              {comparisons.week.fine.toLocaleString("en-IN")} g
            </strong>
            <div className="flex items-center gap-1 mt-1 font-bold">
              {renderTrend(comparisons.week.fineChange)}
              <span className="text-[10px] text-slate-400 font-medium ">
                vs {comparisons.week.lastFine.toLocaleString("en-IN")}g
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Monthly Performance</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">This Month vs Prev Month</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Labor Cash</span>
            <strong className="text-base text-slate-800">
              ₹{comparisons.month.rev.toLocaleString("en-IN")}
            </strong>
            <div className="flex items-center gap-1 mt-1 font-bold">
              {renderTrend(comparisons.month.revChange)}
              <span className="text-[10px] text-slate-400 font-medium ">
                vs ₹{comparisons.month.lastRev.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Fine Weight Sold</span>
            <strong className="text-base text-slate-800">
              {comparisons.month.fine.toLocaleString("en-IN")} g
            </strong>
            <div className="flex items-center gap-1 mt-1 font-bold">
              {renderTrend(comparisons.month.fineChange)}
              <span className="text-[10px] text-slate-400 font-medium ">
                vs {comparisons.month.lastFine.toLocaleString("en-IN")}g
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonStats;
