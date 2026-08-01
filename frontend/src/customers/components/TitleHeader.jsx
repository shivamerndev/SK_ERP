import { useRef } from "react";
import { Users, Download, Upload, UserPlus } from "lucide-react";
import useCustomer from "../useCustomer";
import { useLanguage } from "../../context/LanguageContext";


const TitleHeader = ({ setIsAddOpen }) => {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const { handleExport, handleImport } = useCustomer()


    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#180d07] via-[#120a05] to-[#2a190d] border border-[#4a3219]/60 p-6 rounded-2xl text-white shadow-md">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-6 h-6 text-[#f5cf6e]" />
                    <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffeab3] via-[#f5cf6e] to-[#d4af37]">{t("customersTitle")}</h1>
                </div>
                <p className="text-[#d4c3b3] text-sm max-w-xl">
                    {t("customersSubtitle")}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {/* Add Customer */}
                <button
                    onClick={() => {
                        setIsAddOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] text-sm font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60 cursor-pointer active:scale-95"
                >
                    <UserPlus className="w-4.5 h-4.5" />
                    Add Customer
                </button>

                {/* Backup Database */}
                <button
                    onClick={handleExport}
                    title="Download Customer Data Backup"
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#2a1a0f] hover:bg-[#3a2416] active:scale-95 text-[#f5d061] text-sm font-medium rounded-xl border border-[#855e24]/70 transition-all cursor-pointer shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export Backup
                </button>

                {/* Restore Database */}
                <button
                    onClick={() => fileInputRef.current.click()}
                    title="Upload Customer Data Backup"
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#2a1a0f] hover:bg-[#3a2416] active:scale-95 text-[#f5d061] text-sm font-medium rounded-xl border border-[#855e24]/70 transition-all cursor-pointer shadow-sm"
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