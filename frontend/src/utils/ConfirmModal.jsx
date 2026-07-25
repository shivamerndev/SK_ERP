import { AlertTriangle } from 'lucide-react'



const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">

                <div className="flex items-center gap-3 text-rose-600">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{title}</h3>
                </div>

                <p className="text-sm text-slate-500">
                    {message}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">

                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer">
                        No, Keep
                    </button>

                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer">
                        Yes, Delete
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ConfirmModal