import { Search, X } from "lucide-react";

const SalesFilterToolbar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  bakiFilter,
  setBakiFilter,
  onClearFilters,
  showClearButton
}) => {
  return (
    <div className="p-4 md:p-6 border border-slate-100 rounded-2xl bg-white shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bill number, customer name, phone..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Order Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="date">Invoice Date</option>
            <option value="weight">Net Weight</option>
            <option value="amount">Labor Cash</option>
            <option value="fine">Fine Weight</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold cursor-pointer"
            title="Toggle Sort Order"
          >
            {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
          </button>
        </div>

      </div>

      {/* Advanced Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baki / Ledger Status</label>
          <select
            value={bakiFilter}
            onChange={(e) => setBakiFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="all">All Records</option>
            <option value="outstanding_amt">Outstanding Cash Dues</option>
            <option value="outstanding_fine">Outstanding Metal Fine</option>
            <option value="no_outstanding">Fully Settled / No Baki</option>
          </select>
        </div>

        {/* Clear Filters (if active) */}
        {showClearButton && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SalesFilterToolbar;
