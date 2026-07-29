import { FileText, TrendingUp, Scale, Coins } from 'lucide-react';

const SummaryCard = ({ metrics }) => {



    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 screen-only">
        {/* Total Bills */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bills</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileText className="w-4 h-4" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-800">{metrics.totalInvoices}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Invoices in selected period</p>
            </div>
        </div>

        {/* Total Labor Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Labor Cash</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-800">₹{metrics.totalLaborAmt}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Total compiled labor charges</p>
            </div>
        </div>

        {/* Total Fine Weight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sales Fine Wt.</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Scale className="w-4 h-4" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-800">{metrics.totalFineWt}g</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Total sale fine credit weight</p>
            </div>
        </div>

        {/* Outstanding cash dues */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider font-semibold">Baki Amount</span>
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <Coins className="w-4 h-4" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-black text-rose-600">₹{metrics.outstandingBakiAmt}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Unpaid labor balance</p>
            </div>
        </div>

        {/* Outstanding fine dues */}
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider font-semibold">Baki Fine</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Scale className="w-4 h-4" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-black text-purple-600">{metrics.outstandingBakiFine}g</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Unreturned metal fine balance</p>
            </div>
        </div>
    </div>
    )
}

export default SummaryCard