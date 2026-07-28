import { Search, Trash2, X, PhoneCall, ChevronRight, AlertCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const CustomerTable = ({ customers, setIsDeleteConfirmOpen, setSelectedCust, setIsDrawerOpen }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [tierFilter, setTierFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [riskFilter, setRiskFilter] = useState("All");

    const openWhatsApp = (c) => {
        const bal = c.totalLend;
        if (bal <= 0) return;

        const prefilledText = `Dear *${c.fullName.toUpperCase()}*,\n\nThis is a friendly reminder from *SURUCHI JEWELLERS* regarding your outstanding balance of *₹${bal.toLocaleString("en-IN")}*.\n\nPlease clear it at your earliest convenience using UPI, cash, or bank transfer.\n\nThank you for your business!\n_Sent via SURUCHI JEWELLERS_`;

        const phoneClean = c.phone.toLocaleString().replace(/\D/g, "");
        const finalPhone = phoneClean.length === 10 ? "91" + phoneClean : phoneClean;
        const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(prefilledText)}`;

        return window.open(url, "_blank");
    };

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-4.5 h-4.5" />
                        </span>

                        <input
                            type="text"
                            placeholder="Search by name, phone or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10">
                            <option value="name">Name</option>
                            <option value="balance">Outstanding Udhaar</option>
                            <option value="ltv">Lifetime Lent Value</option>
                            <option value="joined">Join Date</option>
                        </select>
                        <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")} className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold cursor-pointer" title="Toggle Sort Order">
                            {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
                        </button>
                    </div>

                </div>

                {/* Filtering row */}
                <div className="flex flex-wrap items-center gap-3 pt-2 relative">

                    {/* Filter by Tier */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loyalty Tier</label>
                        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none">
                            <option value="All">All Tiers</option>
                            <option value="VIP">VIP (Limit ≥ ₹15k)</option>
                            <option value="Regular">Regular (₹5k - ₹15k)</option>
                            <option value="New">New (Limit &lt; ₹5k)</option>
                        </select>
                    </div>

                    {/* Filter by Debt Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ledger Balance</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none">
                            <option value="All">All Accounts</option>
                            <option value="Debtors">Outstanding Debt &gt; 0</option>
                            <option value="Cleared">Cleared (₹0 Debt)</option>
                            <option value="Over Limit">Over Credit Limit</option>
                        </select>
                    </div>

                    {/* Filter by Risk Level */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exposure Risk</label>
                        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none">
                            <option value="All">All Risk Profiles</option>
                            <option value="Safe">Safe (&lt;75% Limit)</option>
                            <option value="Warning">Warning (75-95%)</option>
                            <option value="Critical">Critical (≥95% Limit)</option>
                        </select>
                    </div>

                    {/* Clear Filters (if active) */}
                    {(tierFilter !== "All" || statusFilter !== "All" || riskFilter !== "All" || searchQuery) && (
                        <button onClick={() => {
                            setTierFilter("All");
                            setStatusFilter("All");
                            setRiskFilter("All");
                            setSearchQuery("");
                        }} className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                            Clear Filters
                        </button>
                    )}

                    <div className="flex items-center gap-1 absolute select-none right-0 top-0 text-green-600 bg-green-100/90 border border-green-300 px-3 py-2.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-green-200/95 transition-all"
                    >
                        <Send className="w-4 h-4" />
                        <h1>Send To All Debtors</h1>
                    </div>
                </div>
            </div>

            {/* Directory Table element */}
            <div className="overflow-x-auto">
                {customers.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Customer Details</th>
                                <th className="px-6 py-4">Outstanding debt</th>
                                <th className="px-6 py-4">Credit limit</th>
                                <th className="px-6 py-4 text-center">Loyalty tier</th>
                                <th className="px-6 py-4 text-center">Quick alert</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {customers.map((c) => {
                                const balance = c.totalLend;
                                const tier = (c.loyality || "regular").toUpperCase();
                                const limitUsage = c.creditLimit ? Math.round((balance / c.creditLimit) * 100) : 0;

                                return (
                                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">

                                        {/* Customer Details */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    {c._id}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span
                                                        onClick={() => {
                                                            setSelectedCust(c);
                                                            setIsDrawerOpen(true);
                                                        }}
                                                        className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer truncate"
                                                    >
                                                        {c.fullName}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        Joined {(() => {
                                                            const j = c.joinedAt || c.joined;
                                                            return (j === "Older" || j === "older" || !j || isNaN(new Date(j).getTime()))
                                                                ? "Older"
                                                                : new Date(j).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Outstanding Debt */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-extrabold ${balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                                    ₹{balance}
                                                </span>
                                                {balance < 0 && <span className="text-[10px] text-emerald-500 font-bold uppercase">Prepayment</span>}
                                            </div>
                                        </td>

                                        {/* Limit Utilization Progress Bar */}
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                                                    <span>{limitUsage}% used</span>
                                                    <span>{((c.creditLimit || 0) / 1000).toFixed(3).replace(/\.?0+$/, "")} kg</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                                                    <div className={`h-full rounded-full transition-all duration-500 ${limitUsage >= 95 ? "bg-rose-500" : limitUsage >= 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(limitUsage, 100)}%` }} />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${tier === "VIP"
                                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                                : tier === "REGULAR"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}>
                                                {tier}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">

                                                <a href={`tel:${c.phone}`} className="p-2 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 text-slate-500 rounded-xl transition-all" title={`Call ${c.fullName} (${c.phone})`}>
                                                    <PhoneCall className="w-4 h-4" />
                                                </a>

                                                <button onClick={() => openWhatsApp(c)} disabled={balance <= 0}
                                                    className={`p-2 border rounded-xl transition-all cursor-pointer ${balance > 0 ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"}`}
                                                    title={balance > 0 ? "Send Outstanding Debt Reminder on WhatsApp" : "No outstanding debt to remind"}>
                                                    <Send className="w-4 h-4" />
                                                </button>

                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">

                                                <button onClick={() => { setSelectedCust(c); setIsDrawerOpen(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                                                    Statement
                                                    <ChevronRight className="w-3 h-3" />
                                                </button>

                                                <button onClick={() => { setSelectedCust(c); setIsDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer" title="Remove Profile">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                        <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
                        <span className="text-base font-semibold">No customers found matching the search and filters</span>
                        <p className="text-xs text-slate-400 mt-1">Try resetting the loyalty, balance, or risk filter dropdowns above</p>
                    </div>
                )}
            </div>

            {/* Directory Footer info */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
                <span>Showing {customers.length} of {customers.length} registered customer accounts</span>
                <span>Syncing in real-time with Ledger data</span>
            </div>
        </div>
    );
};

export default CustomerTable;