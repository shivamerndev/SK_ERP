import { FileText, Trash2, ExternalLink } from "lucide-react";
import useReport from "../hook/useReport";

const SavedInvoices = ({ filteredHistory }) => {

    const { handleDeleteBill, handleSelectBill } = useReport()

    return (<div className="xl:col-span-3">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-bold text-slate-800">Saved Invoices</h2>
                </div>
            </div>

            {/* List display */}
            {filteredHistory.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                                <th className="p-3">Bill No</th>
                                <th className="p-3">Client</th>
                                <th className="p-3">Date & Time</th>
                                <th className="p-3 text-right">Items Count</th>
                                <th className="p-3 text-right">Labor Total</th>
                                <th className="p-3 text-right font-semibold">Fine Total</th>
                                <th className="p-3 text-right text-rose-500 font-bold">Baki Amount</th>
                                <th className="p-3 text-right text-purple-600 font-bold">Baki Fine</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredHistory.map((bill) => (
                                <tr key={bill._id} className="hover:bg-slate-50/70 transition-colors font-semibold text-slate-700">
                                    <td className="p-3 text-indigo-600 font-bold ">#{bill.billNo}</td>
                                    <td className="p-3 font-bold text-slate-800">{bill.customerName}</td>
                                    <td className="p-3 text-slate-500 ">
                                        {bill.date} <span className="text-[10px] text-slate-400">({bill.time})</span>
                                    </td>
                                    <td className="p-3 text-right  text-slate-500">{bill.items?.length || 0} items</td>
                                    <td className="p-3 text-right  text-slate-500 font-semibold text-slate-700">₹{bill.totals?.amount || 0}</td>
                                    <td className="p-3 text-right  text-slate-500">{bill.totals?.fine || 0}g</td>
                                    <td className="p-3 text-right  text-rose-500 font-bold">₹{bill.finalBaki?.amount || 0}</td>
                                    <td className="p-3 text-right  text-purple-600 font-bold">{bill.finalBaki?.fine || 0}g</td>
                                    <td className="p-3 text-center flex items-center justify-center gap-1.5 font-bold">
                                        <button onClick={() => handleSelectBill(bill)} className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Open View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBill(bill._id)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-slate-500">No saved invoices found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or create a new invoice in the Billing page.</p>
                </div>
            )}
        </div>
    </div>)
}

export default SavedInvoices