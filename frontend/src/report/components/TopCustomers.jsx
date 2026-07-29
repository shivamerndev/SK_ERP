import { User } from "lucide-react";

const TopCustomers = ({ topClients }) => {


    return (<div className="xl:col-span-1 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <User className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm">Top Customer Accounts</h3>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                    By Sales Vol.
                </span>
            </div>

            {topClients.length > 0 ? (
                <div className="divide-y divide-slate-100 space-y-3.5">
                    {topClients.map((client, idx) => (
                        <div key={idx} className="pt-3.5 first:pt-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <span className="font-black text-slate-800 text-xs truncate max-w-[150px]">
                                    {client.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold font-mono">
                                    {client.billsCount} bills
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                                <div>
                                    <span className="block text-[8px] uppercase tracking-wider text-slate-400">Total Labor</span>
                                    <span className="font-bold text-emerald-600">₹{Math.round(client.totalLabor)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[8px] uppercase tracking-wider text-slate-400">Total Fine</span>
                                    <span className="font-bold text-amber-600">{client.totalFine.toFixed(2)}g</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-dashed border-slate-100 text-[10px] text-slate-500 font-mono">
                                <div>
                                    <span className="text-rose-500 font-semibold">Baki ₹{Math.round(client.bakiAmount)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-purple-600 font-semibold">Fine {client.bakiFine.toFixed(2)}g</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-400">
                    <p className="text-xs font-semibold">No transactions aggregate yet.</p>
                </div>
            )}
        </div>
    </div>
    )
}

export default TopCustomers