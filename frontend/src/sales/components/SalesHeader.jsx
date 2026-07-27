import { FileText, Plus, Download } from "lucide-react";

const SalesHeader = ({ onRecordBillClick, onExportCSV }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight">Rough Estimate Logs & Sales Analytics</h1>
        </div>
        <p className="text-slate-300 text-sm max-w-xl">
          Analyze daily estimate sheets, track total metal weights, labor charges, evaluate client accounts, and manage invoices in real-time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Record Estimate Bill */}
        <button
          onClick={onRecordBillClick}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          Record Estimate Bill
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          title="Download CSV sales ledger"
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default SalesHeader;
