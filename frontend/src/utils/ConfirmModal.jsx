import { AlertTriangle } from 'lucide-react'



const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {



    return (
        <div className="fixed h-screen w-full inset-0 z-50 flex items-center justify-center bg-[#0a0502]/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#fffdfa] border border-[#e8decb] w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">

                <div className="flex items-center gap-3 text-rose-600">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#2c1d11]">{title}</h3>
                </div>

                <p className="text-sm text-[#786452]">
                    {message}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">

                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-[#e8decb] hover:bg-[#f7f0e3] text-[#2c1d11] font-semibold text-sm rounded-xl cursor-pointer transition-colors">
                        No, Keep
                    </button>

                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-sm">
                        Yes, Delete
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ConfirmModal