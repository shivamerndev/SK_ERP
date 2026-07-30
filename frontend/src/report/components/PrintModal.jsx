import { FileText, X, User, Clock, ArrowUpRight } from "lucide-react";
import useReport from "../hook/useReport";


const PrintModal = ({ selectedBill }) => {

    const { handleSelectBill } = useReport()

    const handlePrint = (bill) => {
        handleSelectBill(bill);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs h-screen transition-opacity duration-300">
            <div className=" bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-scale-up">

                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-3 bg-slate-50 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-black text-slate-800">Invoice Draft Viewer</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold ">
                            #{selectedBill.billNo}
                        </span>
                    </div>
                    <button
                        onClick={() => handleSelectBill(null)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className=" scrollbar-none flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col lg:flex-row gap-6">
                    {/* Left Side: Summary and Meta details */}
                    <div className="lg:w-2/5 space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-indigo-500" />
                                Customer Details
                            </h4>
                            <div className="space-y-2 text-xs font-semibold text-slate-600">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Name:</span>
                                    <span className="text-slate-800 font-bold">{selectedBill.customerName}</span>
                                </div>
                                {selectedBill.customerPhone && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phone:</span>
                                        <span className=" text-slate-800">{selectedBill.customerPhone}</span>
                                    </div>
                                )}
                                {selectedBill.customerAddress && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Address:</span>
                                        <span className="text-slate-800">{selectedBill.customerAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                            <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                Invoice Metadata
                            </h4>
                            <div className="space-y-2 text-xs font-semibold text-slate-600">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Date:</span>
                                    <span className=" text-slate-800">{selectedBill.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Time:</span>
                                    <span className=" text-slate-800">{selectedBill.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Top Header:</span>
                                    <span className="text-slate-500 font-serif italic">{selectedBill.topHeader}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Invoice Title:</span>
                                    <span className="text-slate-800 font-bold uppercase">{selectedBill.title}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-100 p-5 rounded-2xl border border-indigo-950/20 shadow-lg space-y-3.5">
                            <h4 className="font-black text-white text-sm border-b border-indigo-800 pb-2">
                                Final Outstanding Balance
                            </h4>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-indigo-300 font-semibold">Baki Amount:</span>
                                <span className="text-lg font-black text-rose-300 ">
                                    ₹{selectedBill.finalBaki?.amount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-indigo-300 font-semibold">Baki Fine Wt.:</span>
                                <span className="text-lg font-black text-purple-300 ">
                                    {selectedBill.finalBaki?.fine}g
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Paper Aesthetics Invoice Preview */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-auto p-6 max-h-[500px]">
                        {/* Traditional Estimate Slip Replica */}
                        <div className="font-sans text-slate-900 leading-normal text-xs">
                            <div className="text-center mb-6 font-serif">
                                <p className="font-bold tracking-wider text-slate-600 text-[10px] uppercase">{selectedBill.topHeader}</p>
                                <h2 className="font-black text-base text-slate-900 border-b border-slate-900 inline-block pb-0.5 mt-1 tracking-widest">{selectedBill.title}</h2>
                            </div>

                            <div className="flex justify-between mb-4 font-bold border-b border-slate-100 pb-2">
                                <div>
                                    <p className="text-[10px] text-slate-400">BILL NO</p>
                                    <p className=" text-indigo-600 text-sm mt-0.5">#{selectedBill.billNo}</p>
                                    <p className="text-slate-800 text-[13px] mt-1.5 font-black uppercase">{selectedBill.customerName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">DATE & TIME</p>
                                    <p className=" text-slate-800 mt-0.5">{selectedBill.date}</p>
                                    <p className=" text-slate-500 mt-0.5">{selectedBill.time}</p>
                                </div>
                            </div>

                            <table className="w-full text-[11px] border-collapse">
                                <thead>
                                    <tr className="border-y border-slate-900/60 bg-slate-50 font-bold">
                                        <th className="p-2 text-center text-slate-600">Amount</th>
                                        <th className="p-2 text-left text-slate-800">Item</th>
                                        <th className="p-2 text-right text-slate-600">Weight</th>
                                        <th className="p-2 text-left text-slate-600">Panni Detail</th>
                                        <th className="p-2 text-right text-slate-600">Less</th>
                                        <th className="p-2 text-right text-slate-600">Net Wt</th>
                                        <th className="p-2 text-right text-slate-600">Tunch</th>
                                        <th className="p-2 text-right text-slate-600">Lab</th>
                                        <th className="p-2 text-right text-slate-800">Fine</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedBill.items?.map((row, idx) => (
                                        <tr key={idx} className="font-semibold text-slate-700">
                                            <td className="p-2 text-center  text-slate-500">{row.amount || "-"}</td>
                                            <td className="p-2 text-left font-black text-slate-800">{row.item}</td>
                                            <td className="p-2 text-right ">{row.weight}</td>
                                            <td className="p-2 text-left  text-[10px] text-slate-400">{row.panniDetail || "-"}</td>
                                            <td className="p-2 text-right  text-slate-400">{row.less || "-"}</td>
                                            <td className="p-2 text-right ">{row.netWt || "-"}</td>
                                            <td className="p-2 text-right ">{row.tunch}%</td>
                                            <td className="p-2 text-right  text-slate-500">{row.lab || "-"}</td>
                                            <td className="p-2 text-right  text-slate-800 font-bold">{row.fine || "-"}</td>
                                        </tr>
                                    ))}
                                    {/* TOTAL SALE ROW */}
                                    <tr className="border-t border-slate-900/60 font-black text-slate-800 bg-slate-50/50">
                                        <td className="p-2 text-center ">₹{selectedBill.totals?.amount}</td>
                                        <td className="p-2 text-left">TOTAL SALE</td>
                                        <td className="p-2 text-right ">{selectedBill.totals?.weight}</td>
                                        <td className="p-2"></td>
                                        <td className="p-2 text-right ">{selectedBill.totals?.less}</td>
                                        <td className="p-2 text-right ">{selectedBill.totals?.netWt}</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2 text-right ">{selectedBill.totals?.fine}g</td>
                                    </tr>
                                    {/* LAST BALANCE ROW */}
                                    <tr className="text-slate-500 font-semibold">
                                        <td className="p-2 text-center ">₹{selectedBill.lastBalance?.amount || 0}</td>
                                        <td className="p-2 text-left">Last Bal.</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2 text-right ">{selectedBill.lastBalance?.fine || 0}g</td>
                                    </tr>
                                    {/* TOTAL SALE + LAST BAL ROW */}
                                    <tr className="font-bold text-slate-800 border-t border-dashed border-slate-200">
                                        <td className="p-2 text-center ">₹{(selectedBill.totals?.amount || 0) + (selectedBill.lastBalance?.amount || 0)}</td>
                                        <td className="p-2 text-left">Total</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2 text-right ">{(selectedBill.totals?.fine || 0) + (selectedBill.lastBalance?.fine || 0)}g</td>
                                    </tr>
                                    {/* JAMA DETAIL ROW */}
                                    <tr className="text-indigo-900 bg-indigo-50/30">
                                        <td className="p-2 text-center ">₹{selectedBill.jamaDetail?.amount || 0}</td>
                                        <td className="p-2 text-left font-bold">
                                            Jama Detail
                                            {selectedBill.jamaDetail?.details && <span className="block text-[10px] text-indigo-500 font-normal">{selectedBill.jamaDetail.details}</span>}
                                        </td>
                                        <td className="p-2 text-right ">{selectedBill.jamaDetail?.weight}</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2 text-right ">{selectedBill.jamaDetail?.netWt}</td>
                                        <td className="p-2 text-right ">{selectedBill.jamaDetail?.tunch}%</td>
                                        <td className="p-2"></td>
                                        <td className="p-2 text-right  font-bold">{selectedBill.jamaDetail?.fine || 0}g</td>
                                    </tr>
                                    {/* BAKI FINAL ROW */}
                                    <tr className="border-y-2 border-slate-900 text-slate-900 bg-rose-50/20 font-black text-sm">
                                        <td className="p-2.5 text-center  text-rose-600">₹{selectedBill.finalBaki?.amount}</td>
                                        <td className="p-2.5 text-left font-black text-slate-800">BAKI FINAL</td>
                                        <td className="p-2.5"></td>
                                        <td className="p-2.5"></td>
                                        <td className="p-2.5"></td>
                                        <td className="p-2.5"></td>
                                        <td className="p-2.5 text-center text-xs font-semibold text-rose-500">(BAKI)</td>
                                        <td className="p-2.5"></td>
                                        <td className="p-2.5 text-right  text-purple-700">{selectedBill.finalBaki?.fine}g</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={() => handlePrint(selectedBill)} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Print Receipt
                    </button>
                </div>

            </div>
        </div>
    )
}

export default PrintModal