import { Filter } from "lucide-react";

const DatePresets = ({
  dateRangePreset,
  setDateRangePreset,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate
}) => {
  const presets = [
    { label: "All Sales Logs", val: "All" },
    { label: "Today", val: "Today" },
    { label: "Yesterday", val: "Yesterday" },
    { label: "This Week", val: "ThisWeek" },
    { label: "This Month", val: "ThisMonth" },
    { label: "Custom Dates...", val: "Custom" }
  ];

  return (
    <div className="bg-white border border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4.5 h-4.5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">Date Range Filter (Revenue & Weight Calculations)</h3>
        </div>

        {dateRangePreset === "Custom" && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold uppercase">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold uppercase">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100/50">
        {presets.map((p) => (
          <button
            key={p.val}
            onClick={() => {
              setDateRangePreset(p.val);
              if (p.val !== "Custom") {
                setCustomStartDate("");
                setCustomEndDate("");
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              dateRangePreset === p.val
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePresets;
