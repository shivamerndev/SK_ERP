import { useState } from "react";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    X,
    Check,
    Users,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertTriangle,
    PhoneCall,
    MessageSquare,
    Download,
    Upload,
    ChevronRight,
    Info,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CreditCard,
    AlertCircle,
    Filter,
    FileText,
    CheckCircle,
    ChevronDown,
    UserPlus
} from "lucide-react";
import handleForm from "../../utils/formHandler.utils.js"
import useCustomer from "../useCustomer.js";


const CreateForm = ({ onClose }) => {

    const { handleCreateCustomer } = useCustomer()

    const [isOlder, setIsOlder] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white text-black w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform animate-scale-up">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-bold text-slate-800">Add New Shop Customer</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-4.5 h-4.5" />
                    </button>
                </div>

                <form onSubmit={handleForm(handleCreateCustomer)} className="p-6 space-y-4">

                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="e.g. Amit Ji"
                            required
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Contact info grid: Phone & Loyalty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="e.g. 9955422156"
                                required
                                pattern="[0-9]{10}"
                                title="Ten digit phone number"
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Loyalty Tier *</label>
                            <select
                                name="loyality"
                                defaultValue="regular"
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="new">New</option>
                                <option value="regular">Regular</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                    </div>

                    {/* Shop Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            placeholder="e.g. Amit & Sons"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="e.g. Sikandra, Bihar"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Joined At Date */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase">Joined Date</label>
                            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none font-semibold">
                                <input
                                    type="checkbox"
                                    checked={isOlder}
                                    onChange={(e) => setIsOlder(e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                                />
                                Mark as "Older" customer
                            </label>
                        </div>
                        {isOlder ? (
                            <input
                                type="hidden"
                                name="joinedAt"
                                value="older"
                            />
                        ) : (
                            <input
                                type="date"
                                name="joinedAt"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                        >
                            Add Customer
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default CreateForm