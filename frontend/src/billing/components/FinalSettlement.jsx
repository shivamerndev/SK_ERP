import React from "react";
import { CheckCircle, AlertCircle, X, Save } from "lucide-react";

const FinalSettlement = ({
  totals,
  lastBalanceAmount,
  lastBalanceFine,
  jamaAmount,
  computedJamaFine,
  finalBaki,
  postToLedger,
  setPostToLedger,
  selectedCustomerId,
  handleClearForm,
  handleSaveInvoice
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 border-b border-slate-100 pb-3 mb-6">
          <CheckCircle className="w-5 h-5" />
          <h3 className="font-bold text-slate-800">Final Outstanding Balance (BAKI)</h3>
        </div>

        <div className="space-y-4">
          {/* Baki cash card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Baki Labor Amount</p>
              <p className="text-2xl font-black text-emerald-700 font-mono mt-1">₹{finalBaki.amount}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Sale: ₹{totals.amount}</p>
              <p className="mt-0.5">Bal: +₹{parseFloat(lastBalanceAmount) || 0}</p>
              <p className="mt-0.5">Jama: -₹{parseFloat(jamaAmount) || 0}</p>
            </div>
          </div>

          {/* Baki fine card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-purple-800 uppercase tracking-wide">Baki Fine Outstanding</p>
              <p className="text-2xl font-black text-purple-700 font-mono mt-1">{finalBaki.fine} g</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Sale: {totals.fine}g</p>
              <p className="mt-0.5">Bal: +{parseFloat(lastBalanceFine) || 0}g</p>
              <p className="mt-0.5">Jama: -{computedJamaFine}g</p>
            </div>
          </div>
        </div>

        {/* Posting Ledger Integrations */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={postToLedger}
              onChange={(e) => setPostToLedger(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-sm font-semibold text-slate-700">Update Udhaar Customer Profile & General Ledger</span>
          </label>
          
          {!selectedCustomerId && postToLedger && (
            <p className="text-xs text-amber-600 flex items-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Please select an existing customer from the autocomplete box above to post details to their statement.
            </p>
          )}
        </div>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-3 gap-3 mt-8">
        <button
          type="button"
          onClick={handleClearForm}
          className="flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl py-3 text-xs font-bold transition-colors"
        >
          <X className="w-4 h-4" />
          Reset
        </button>
        <button
          type="button"
          onClick={handleSaveInvoice}
          className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-blue-500/10 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save & Preview Invoice
        </button>
      </div>
    </div>
  );
};

export default FinalSettlement;
