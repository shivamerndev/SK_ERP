import { X, Printer } from "lucide-react";

const InvoiceDrawer = ({ isOpen, onClose, selectedSale, onPrint }) => {
  if (!isOpen || !selectedSale) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in screen-only">
      
      {/* Backdrop Closer */}
      <div 
        className="flex-1 cursor-pointer" 
        onClick={onClose} 
      />

      {/* Drawer Panel Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden text-xs">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800 leading-tight">Rough Estimate Slip</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Invoice Statement Voucher</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Receipt Voucher */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 space-y-5 relative">
            
            {/* Top Store Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5 tracking-wider font-mono">
                {selectedSale.topHeader || "|| SHREE GANESHAYAA NAMAH ||"}
              </span>
              <h4 className="font-extrabold text-slate-800 tracking-tight text-base">
                {selectedSale.title || "ROUGH ESTIMATE"}
              </h4>
              <div className="mt-3 flex justify-center">
                <span className="px-3 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full border border-blue-200 uppercase tracking-wider font-mono">
                  BILL NO: {selectedSale.billNo}
                </span>
              </div>
            </div>

            {/* Final Balance outstanding overview */}
            <div className="text-center py-2">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1">
                Outstanding Balance (Baki)
              </span>
              <strong className="text-3xl font-black block tracking-tight text-rose-600 font-mono">
                ₹{Math.round(selectedSale.finalBaki?.amount || 0).toLocaleString("en-IN")}
              </strong>
              {selectedSale.finalBaki?.fine > 0 && (
                <span className="block text-[11px] text-purple-600 font-bold font-mono mt-0.5">
                  + {selectedSale.finalBaki.fine.toFixed(2)}g Fine Outstanding
                </span>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="space-y-3.5 border-t border-slate-200 pt-4 font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Customer Name</span>
                <span className="text-slate-800 font-bold text-sm">{selectedSale.customerName}</span>
              </div>
              {selectedSale.customerPhone && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Phone</span>
                  <span className="text-slate-700 font-mono">{selectedSale.customerPhone}</span>
                </div>
              )}
              {selectedSale.customerAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Address</span>
                  <span className="text-slate-700">{selectedSale.customerAddress}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Date & Time</span>
                <span className="text-slate-700 font-mono">{selectedSale.date} | {selectedSale.time}</span>
              </div>
            </div>

            {/* Items table list */}
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block mb-1">
                Itemized Worksheet Logs
              </span>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                {selectedSale.items && selectedSale.items.map((it, idx) => (
                  <div key={idx} className="py-2 first:pt-0 flex items-start justify-between font-medium">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-[11px]">{it.item}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Gross: {it.weight}g {it.less ? `| Less: ${it.less}g` : ""} | Net: {it.netWt}g
                      </span>
                    </div>
                    <div className="text-right font-mono text-[10px] flex flex-col">
                      {it.amount > 0 && <span className="text-emerald-600 font-bold">₹{it.amount} L</span>}
                      {it.fine > 0 && <span className="text-indigo-600 font-bold">{it.fine}g F</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 font-bold font-mono text-slate-700">
              <div className="flex justify-between items-center">
                <span>Total Net Wt:</span>
                <span>{selectedSale.totals?.netWt || 0} g</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Labor Amount:</span>
                <span className="text-emerald-600">₹{selectedSale.totals?.amount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Fine Weight:</span>
                <span className="text-indigo-600">{selectedSale.totals?.fine || 0} g</span>
              </div>
            </div>

            {/* Jama Details */}
            {selectedSale.jamaDetail && (selectedSale.jamaDetail.amount > 0 || selectedSale.jamaDetail.fine > 0 || selectedSale.jamaDetail.details) && (
              <div className="border-t border-slate-200 pt-3 space-y-2 bg-slate-100/50 p-3 rounded-xl border border-slate-200/50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block mb-1">
                  Deposited / Jama Details
                </span>
                {selectedSale.jamaDetail.details && (
                  <div className="text-slate-500 font-bold italic mb-1.5 text-[10px]">
                    "{selectedSale.jamaDetail.details}"
                  </div>
                )}
                <div className="space-y-1 font-mono text-[10px] text-slate-600">
                  {selectedSale.jamaDetail.amount > 0 && (
                    <div className="flex justify-between">
                      <span>Cash Paid:</span>
                      <span className="font-bold text-emerald-600">₹{selectedSale.jamaDetail.amount}</span>
                    </div>
                  )}
                  {selectedSale.jamaDetail.fine > 0 && (
                    <div className="flex justify-between">
                      <span>Metal Exchanged:</span>
                      <span className="font-bold text-indigo-600">{selectedSale.jamaDetail.fine}g Fine ({selectedSale.jamaDetail.netWt}g @{selectedSale.jamaDetail.tunch}%)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Silver Rate Conversion details */}
            {selectedSale.silverRate > 0 && (
              <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Silver rate:</span>
                  <span className="font-bold font-mono">₹{selectedSale.silverRate}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Converted Fine Cash:</span>
                  <span className="font-bold font-mono">₹{selectedSale.convertedFineAmount}</span>
                </div>
              </div>
            )}

            {/* Footer seal */}
            <div className="text-center pt-2 text-[9px] text-slate-400 font-medium font-mono">
              ~ Thank you for your business ~
            </div>

          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onPrint(selectedSale)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Slip
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close Bill
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDrawer;
