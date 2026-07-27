import { AlertTriangle } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, selectedSale }) => {
  if (!isOpen || !selectedSale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
        
        <div className="flex items-center gap-3 text-rose-600">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Cancel & Revert Estimate Bill?</h3>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          Are you sure you want to delete Estimate Bill <strong>#{selectedSale.billNo}</strong> for <strong>{selectedSale.customerName}</strong>? 
          <br />
          <span className="block text-[10px] text-indigo-600 font-bold mt-2">
            * Balances posted to customer's account will be reverted (Labor Cash: -₹{selectedSale.totals?.amount || 0}, Outstanding Baki: -₹{selectedSale.finalBaki?.amount || 0}).
          </span>
          <span className="block text-[10px] text-rose-600 font-bold mt-1">
            * This action is permanent and cannot be undone.
          </span>
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl cursor-pointer"
          >
            No, Keep Invoice
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Yes, Revert & Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
