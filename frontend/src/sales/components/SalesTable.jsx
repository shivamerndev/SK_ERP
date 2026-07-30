import { Clock, Printer, Trash2, AlertCircle, User } from "lucide-react";

const SalesTable = ({
  filteredSales,
  totalRecordsCount,
  onPrintClick,
  onDeleteClick
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

      {/* Table Element */}
      <div className="overflow-x-auto">
        {filteredSales.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Bill No & Date</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Items Worksheet</th>
                <th className="px-6 py-4 text-center">Net Wt</th>
                <th className="px-6 py-4 text-center">Fine Wt</th>
                <th className="px-6 py-4 text-center">Labor Cash</th>
                <th className="px-6 py-4 text-right">Final Baki</th>
                <th className="px-6 py-4 text-center">Ledger</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSales.map((s) => {
                const bakiAmt = s.finalBaki?.amount || 0;
                const bakiFine = s.finalBaki?.fine || 0;

                return (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">

                    {/* Bill No & Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded-md w-fit ">
                          #{s.billNo}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1.5 ">
                          <Clock className="w-3 h-3" />
                          {s.date}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium ">{s.time}</span>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-xs flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {s.customerName}
                        </span>
                        {s.customerPhone && (
                          <span className="text-[10px] text-slate-500 font-medium  mt-0.5">
                            {s.customerPhone}
                          </span>
                        )}
                        {s.customerAddress && (
                          <span className="text-[9px] text-slate-400 font-medium truncate max-w-[150px]">
                            {s.customerAddress}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Items worksheet summary */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-2">
                        {s.items && s.items.map((it, idx) => (
                          <div key={idx} className="text-[10px] text-slate-500 leading-tight">
                            <span className="font-bold text-slate-700">{it.item}</span>
                            <span className="">
                              ({it.weight || 0}g {it.less ? `-${it.less}` : ""})
                            </span>
                            {it.tunch && <span className="text-amber-600 font-semibold "> T:{it.tunch}%</span>}
                            {it.lab && <span className="text-indigo-500 font-semibold "> L:{it.lab}</span>}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Net weight */}
                    <td className="px-6 py-4 text-center font-bold text-slate-700 text-xs ">
                      {s.totals?.netWt || 0} g
                    </td>

                    {/* Fine weight */}
                    <td className="px-6 py-4 text-center font-bold text-slate-600 text-xs ">
                      {s.totals?.fine || 0} g
                    </td>

                    {/* Labor cash */}
                    <td className="px-6 py-4 text-center text-emerald-600 font-bold text-xs ">
                      ₹{s.totals?.amount || 0}
                    </td>

                    {/* Final Baki */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        {bakiAmt > 0 ? (
                          <span className="font-black text-rose-600 text-xs ">
                            ₹{Math.round(bakiAmt).toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold ">₹0</span>
                        )}
                        {bakiFine > 0 ? (
                          <span className="font-bold text-purple-600 text-[10px]  mt-0.5">
                            {bakiFine.toFixed(2)}g Fine
                          </span>
                        ) : (
                          bakiAmt === 0 && <span className="text-[10px] text-emerald-600 font-black uppercase text-[9px] tracking-wider">Settled</span>
                        )}
                      </div>
                    </td>

                    {/* Posted status */}
                    <td className="px-6 py-4 text-center">
                      {s.postedToUdhaar ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full uppercase tracking-wider border border-emerald-200">
                          Udhaar
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-full uppercase tracking-wider border border-slate-200">
                          Cash
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Print Invoice */}
                        <button
                          onClick={() => onPrintClick(s)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Bill
                        </button>

                        {/* Delete / Cancel */}
                        <button
                          onClick={() => onDeleteClick(s)}
                          className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Estimate Bill"
                        >
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
            <span className="text-base font-semibold">No billing records found matching the filters</span>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter search options above</p>
          </div>
        )}
      </div>

      {/* Directory Footer Info */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
        <span>Displaying {filteredSales.length} of {totalRecordsCount} registered invoices</span>
        <span>Automatic ledger balance posting and database sync enabled</span>
      </div>

    </div>
  );
};

export default SalesTable;
