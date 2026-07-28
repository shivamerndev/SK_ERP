import { RotateCcw } from "lucide-react";
import useBilling from "../useBilling";

const BalancesAndJama = () => {

  const { lastBalanceAmount, setLastBalanceAmount, lastBalanceFine, setLastBalanceFine, jamaDetails,
    setJamaDetails, jamaWeight, setJamaWeight, jamaNetWt, setJamaNetWt, jamaTunch, setJamaTunch, jamaAmount,
    setJamaAmount, computedJamaFine, silverRate, setSilverRate, convertedFineAmount, totals } = useBilling();


  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-3">
        <RotateCcw className="w-5 h-5" />
        <h3 className="font-bold text-slate-800">Balances & Jama Details</h3>
      </div>

      {/* Last Balance Inputs */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Last Balance</p>
        <div className="grid grid-cols-2 gap-4 text-black">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cash Balance (Amt)</label>
            <input type="number" name="lastBalanceAmount" value={lastBalanceAmount} placeholder="0" onChange={(e) => setLastBalanceAmount(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Fine Balance (g)</label>
            <input type="number" name="lastBalanceFine" value={lastBalanceFine} placeholder="0" onChange={(e) => setLastBalanceFine(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
        </div>
      </div>

      {/* Silver Rate / Bhaw Settlement */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Silver Rate & Fine Settle (Bhaw)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Silver Rate (Bhaw per kg)</label>
            <input type="number" name="silverRate" value={silverRate} placeholder="e.g. 223600" onChange={(e) => setSilverRate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
          {parseFloat(silverRate) > 0 && (
            <div className="flex flex-col justify-end pb-1 text-xs font-semibold text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Fine to Settle:</span>
                <span className="font-bold text-slate-800 font-mono">{(parseFloat(lastBalanceFine) || 0) + totals.fine - computedJamaFine} g</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1">
                <span>Converted Value:</span>
                <span className="font-bold text-emerald-600 font-mono">₹{convertedFineAmount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jama Deposit Inputs */}
      <div className="space-y-4 pt-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jama Detail (Credit / Payment)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Deposits Details / Description</label>
            <input type="text" name="jamaDetails" placeholder="e.g. KACHHI/807" value={jamaDetails} onChange={(e) => setJamaDetails(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Weight (g)</label>
            <input type="number" name="jamaWeight" placeholder="0" value={jamaWeight} onChange={(e) => { setJamaWeight(e.target.value); setJamaNetWt(e.target.value); }} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Net Wt (g)</label>
            <input type="number" name="jamaNetWt" placeholder="0" value={jamaNetWt} onChange={(e) => setJamaNetWt(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Tunch (%)</label>
            <input type="number" name="jamaTunch" placeholder="0.0" value={jamaTunch} onChange={(e) => setJamaTunch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Cash Deposit (Amt)</label>
            <input type="number" name="jamaAmount" placeholder="0" value={jamaAmount} onChange={(e) => setJamaAmount(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
          </div>
        </div>
        {/* Jama calculated fine details */}
        {(parseFloat(jamaNetWt || jamaWeight) > 0 || parseFloat(jamaTunch) > 0) && (
          <div className="text-xs bg-slate-50 p-2.5 rounded border border-dashed border-slate-200 text-slate-600 flex justify-between font-medium">
            <span>Calculated Jama Fine:</span>
            <span className="font-bold text-slate-800 font-mono">{computedJamaFine} g</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalancesAndJama;
