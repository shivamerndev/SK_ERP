import { Trash2, X, PhoneCall, Calendar, ArrowUpRight, ArrowDownRight, Clock, FileText } from "lucide-react";
import { useState } from "react";

const SlideDrawer = ({ setIsDrawerOpen, selectedCust }) => {


    const getLTV = (cust) => {
        if (!cust.transactions) return 0;
        return cust.transactions.reduce((sum, tx) => sum + (tx.type === "LENT" ? tx.amount : 0), 0);
    };

    const getPaid = (cust) => {
        if (!cust.transactions) return 0;
        return cust.transactions.reduce((sum, tx) => sum + (tx.type === "PAID" ? tx.amount : 0), 0);
    };

    const getTier = (cust) => {
        if (cust.creditLimit >= 15000) return "VIP";
        if (cust.creditLimit >= 5000) return "Regular";
        return "New";
    };

    const getRiskCategory = (cust) => {
        const bal = getBalance(cust);
        const limit = cust.creditLimit || 1;
        const ratio = bal / limit;
        if (ratio >= 0.95) return "Critical";
        if (ratio >= 0.75) return "Warning";
        return "Safe";
    };


    const getBalance = (cust) => {
        if (!cust.transactions) return 0;
        return cust.transactions.reduce((sum, tx) => sum + (tx.type === "LENT" ? tx.amount : -tx.amount), 0);
    };

    // Form states
    const [txForm, setTxForm] = useState({ type: "LENT", amount: "", description: "", method: "UPI" });

    // Validation errors
    const [txErrors, setTxErrors] = useState({});


    const handleRecordTransaction = (e) => {
        e.preventDefault();
        const errors = {};
        const amt = parseFloat(txForm.amount);

        if (isNaN(amt) || amt <= 0) {
            errors.amount = "Amount must be a positive number";
        }
        if (!txForm.description.trim()) {
            errors.description = "Provide a description (e.g. UPI payment, gold chain)";
        }

        if (Object.keys(errors).length > 0) {
            setTxErrors(errors);
            return;
        }

        setTxForm({ type: "LENT", amount: "", description: "", method: "UPI" });
        setTxErrors({});
    };


    return <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">

        <div className="flex-1 cursor-pointer" onClick={() => setIsDrawerOpen(false)} />

        <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                        {selectedCust.fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800 leading-tight">{selectedCust.fullName}</h3>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Statement Ledger Profile</span>
                    </div>
                </div>

                <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full text-xs border border-blue-200">
                            ID: {selectedCust._id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTier(selectedCust) === "VIP" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {getTier(selectedCust)} Loyalty
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskCategory(selectedCust) === "Critical" ? "bg-rose-100 text-rose-700 border-rose-200" : getRiskCategory(selectedCust) === "Warning" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
                            {getRiskCategory(selectedCust)} Risk Status
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Mobile Phone</span>
                            <a href={`tel:${selectedCust.phone}`} className="text-slate-700 hover:text-blue-600 font-semibold text-sm flex items-center gap-1">
                                <PhoneCall className="w-3.5 h-3.5" />
                                {selectedCust.phone}
                            </a>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Email address</span>
                            <span className="text-slate-700 font-semibold text-sm block truncate">
                                {selectedCust.email || "—"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Account Join Date</span>
                            <span className="text-slate-700 font-semibold text-sm flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {isNaN(new Date(selectedCust.joined).getTime()) ? "Older" : new Date(selectedCust.joined).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase block mb-0.5">Credit Exposure Limit</span>
                            <span className="text-slate-700 font-semibold text-sm block">
                                ₹{(selectedCust.creditLimit || 0).toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Internal notes */}
                    <div className="border-t border-slate-200/60 pt-3">
                        <span className="text-slate-400 font-bold text-[10px] uppercase block mb-1">Store Owner Notes:</span>
                        <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                            {selectedCust.notes}
                        </p>
                    </div>

                </div>

                {/* Credit Meter visualization card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-800">Current Credit Limit Usage</h4>
                        <span className="text-xs font-bold text-slate-400">₹{getBalance(selectedCust).toLocaleString("en-IN")} / ₹{(selectedCust.creditLimit || 0).toLocaleString("en-IN")}</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                        <div className={`h-full rounded-full transition-all duration-500 ${(getBalance(selectedCust) / (selectedCust.creditLimit || 1)) >= 0.95 ? "bg-rose-500" : (getBalance(selectedCust) / (selectedCust.creditLimit || 1)) >= 0.75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((getBalance(selectedCust) / (selectedCust.creditLimit || 1)) * 100, 100)}%` }} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-100 pt-3 text-xs">
                        <div>
                            <span className="text-slate-400 font-semibold block mb-0.5">Total Lent (Bought)</span>
                            <strong className="text-slate-700 font-extrabold block text-sm">₹{getLTV(selectedCust).toLocaleString("en-IN")}</strong>
                        </div>
                        <div>
                            <span className="text-slate-400 font-semibold block mb-0.5">Total Payments</span>
                            <strong className="text-slate-700 font-extrabold block text-sm">₹{getPaid(selectedCust).toLocaleString("en-IN")}</strong>
                        </div>
                        <div>
                            <span className="text-slate-400 font-semibold block mb-0.5">Outstanding Debt</span>
                            <strong className={`font-extrabold block text-sm ${getBalance(selectedCust) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                ₹{getBalance(selectedCust).toLocaleString("en-IN")}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Direct Ledger Transaction Recorder */}
                <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-4.5 h-4.5 text-indigo-600" />
                        <h4 className="text-sm font-bold text-slate-800">Quick Record Ledger Entry</h4>
                    </div>

                    <form onSubmit={handleRecordTransaction} className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-3">

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Entry Type</label>
                                <select value={txForm.type} onChange={(e) => setTxForm(prev => ({ ...prev, type: e.target.value }))} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold">
                                    <option value="LENT">LENT (Customer Credit Purchase)</option>
                                    <option value="PAID">PAID (Customer Settle/Payment)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Amount (₹) *</label>
                                <input type="number" placeholder="Amount" value={txForm.amount} onChange={(e) => setTxForm(prev => ({ ...prev, amount: e.target.value }))}
                                    className={`px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 ${txErrors.amount ? "border-rose-400" : "border-slate-200"}`} />
                                {txErrors.amount && <span className="text-[10px] text-rose-500 font-semibold">{txErrors.amount}</span>}
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Entry description *</label>
                                <input type="text" placeholder="e.g. 1x Gold Ring, UPI partial payment" value={txForm.description}
                                    onChange={(e) => setTxForm(prev => ({ ...prev, description: e.target.value }))}
                                    className={`px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 ${txErrors.description ? "border-rose-400" : "border-slate-200"}`} />
                                {txErrors.description && <span className="text-[10px] text-rose-500 font-semibold">{txErrors.description}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</label>
                                <select disabled={txForm.type !== "PAID"} value={txForm.method} onChange={(e) => setTxForm(prev => ({ ...prev, method: e.target.value }))}
                                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold disabled:bg-slate-50 disabled:text-slate-400">
                                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                                    <option value="Cash">Cash Handover</option>
                                    <option value="Card">Credit/Debit Card</option>
                                    <option value="Bank Transfer">Net Banking / NEFT</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-500/10 active:scale-[0.99]">Post Entry to Ledger Account</button>
                    </form>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-800">Ledger Audit Statements ({selectedCust.transactions?.length || 0})</h4>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Newest entries first</span>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">

                        {selectedCust.transactions && selectedCust.transactions.length > 0 ? <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">{selectedCust.transactions.map((tx) => <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-xs">

                            <div className="flex gap-3 items-start min-w-0">

                                <div className={`p-2 rounded-lg ${tx.type === "LENT" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                                    {tx.type === "LENT" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-slate-800 truncate">{tx.description}</span>
                                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 font-medium">
                                        <Clock className="w-3 h-3" />
                                        <span>{tx.date}</span>
                                        {tx.method && (
                                            <>
                                                <span>•</span>
                                                <span className="bg-slate-100 text-slate-500 px-1 rounded-sm text-[9px] uppercase font-bold">{tx.method}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`font-extrabold ${tx.type === "LENT" ? "text-amber-600" : "text-emerald-600"}`}>
                                    {tx.type === "LENT" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                                </span>
                                <button onClick={() => handleDeleteTx(tx.id)} className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors cursor-pointer" title="Delete Transaction Log">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                        </div>
                        )}
                        </div> : <div className="p-8 text-center text-slate-400">
                            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-1.5" />
                            <span className="text-xs font-semibold">No transactions registered for this account</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Use the ledger form above to post entries.</p>
                        </div>
                        }
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button type="button" onClick={() => { setIsDeleteConfirmOpen(true); }} className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer"> <Trash2 className="w-4 h-4" /> Remove Customer </button>
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"> Close Drawer </button>
            </div>
        </div>
    </div>
};

export default SlideDrawer;