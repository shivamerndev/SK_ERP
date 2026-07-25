import { useRef } from "react";
import { Users, Download, Upload, UserPlus } from "lucide-react";
import useCustomer from "../useCustomer";


const TitleHeader = ({ setIsAddOpen }) => {

    const fileInputRef = useRef(null);
    const { handleExport, handleImport } = useCustomer()


    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-6 h-6 text-indigo-400" />
                    <h1 className="text-2xl font-bold tracking-tight">Customer Relationship Manager</h1>
                </div>
                <p className="text-slate-300 text-sm max-w-xl">
                    Track shopping loyalty tiers, analyze credit risk profile ratios, trigger automated payment reminders, and record ledger payments.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:self-end">
                {/* Add Customer */}
                <button
                    onClick={() => {
                        setIsAddOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                    <UserPlus className="w-4.5 h-4.5" />
                    Add Customer
                </button>

                {/* Backup Database */}
                <button
                    onClick={handleExport}
                    title="Download Customer Data Backup"
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                    <Download className="w-4 h-4" />
                    Export Backup
                </button>

                {/* Restore Database */}
                <button
                    onClick={() => fileInputRef.current.click()}
                    title="Upload Customer Data Backup"
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                    <Upload className="w-4 h-4" />
                    Import Backup
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                />
            </div>
        </div>
    )
}

export default TitleHeader