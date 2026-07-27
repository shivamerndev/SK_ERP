import { Search, Filter, RotateCcw } from "lucide-react";

const ReportFilter = ({ searchQuery, setSearchQuery, startDate, setStartDate, endDate, setEndDate, bakiFilter, setBakiFilter, handleResetFilters, filteredHistory }) => {



    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 screen-only">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Filter className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm">Advanced Search & Report Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-black">
                {/* Text Search */}
                <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Client / Bill No</label>
                    <input type="text" placeholder="e.g. Vikash, #79..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    <Search className="absolute left-3 top-7 w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
                </div>

                {/* Outstanding Filter Dropdown */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outstanding Status</label>
                    <select value={bakiFilter} onChange={(e) => setBakiFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" >
                        <option value="all">All Invoices</option>
                        <option value="outstanding_amt">Outstanding Baki Amount &gt; 0</option>
                        <option value="outstanding_fine">Outstanding Baki Fine &gt; 0</option>
                        <option value="no_outstanding">Settled Bills (No Outstanding Dues)</option>
                    </select>
                </div>
            </div>

            {/* Filter Toolbar Actions */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <p className="text-[11px] text-slate-400 font-medium">
                    Showing <span className="font-bold text-slate-700">{filteredHistory.length}</span> of{" "}
                    <span className="font-bold text-slate-700">{history.length}</span> recorded invoices.
                </p>

                {(searchQuery || startDate || endDate || bakiFilter !== "all") && (
                    <button onClick={handleResetFilters} className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg px-2.5 py-1.5 transition-all" >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filters
                    </button>
                )}
            </div>
        </div>)
}

export default ReportFilter