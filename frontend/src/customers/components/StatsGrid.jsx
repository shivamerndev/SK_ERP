import { useMemo } from 'react';
import { Users, TrendingDown, DollarSign, CreditCard, AlertTriangle } from 'lucide-react';


const StatsGrid = ({customers}) => {


    const stats = useMemo(() => {
        let debtors = 0;
        let totalDebt = 0;
        let totalExposure = 0;
        let criticalAlerts = 0;

        customers.forEach(c => {
            const bal = c.totalLend;
            totalExposure += Number(c.creditLimit || 0);  

            if (bal > 0) {
                debtors++;
                totalDebt += bal;
            }

            const ratio = bal / (c.creditLimit || 1);
            if (ratio >= 0.8) {
                criticalAlerts++;
            }
        });

        return {
            totalCustomers: customers.length,
            debtorsCount: debtors,
            totalOutstanding: totalDebt,
            totalExposure,
            criticalAlerts,
        };
    }, [customers]);


    return ( 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Stat 1: Total Customers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
                <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Directory</span>
                    <h3 className="text-2xl font-extrabold text-slate-800">{stats.totalCustomers}</h3>
                    <p className="text-[11px] text-slate-400">Registered profiles</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                </div>
            </div>

            {/* Stat 2: Active Debtors */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
                <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Debtors</span>
                    <h3 className="text-2xl font-extrabold text-slate-800">{stats.debtorsCount}</h3>
                    <p className="text-[11px] text-amber-600 font-medium">
                        {stats.totalCustomers ? Math.round((stats.debtorsCount / stats.totalCustomers) * 100) : 0}% of customers
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <TrendingDown className="w-6 h-6" />
                </div>
            </div>

            {/* Stat 3: Total Outstanding Debt */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
                <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Outstanding</span>
                    <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.totalOutstanding.toLocaleString("en-IN")}</h3>
                    <p className="text-[11px] text-slate-400">Unsettled Udhaar ledger</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>

            {/* Stat 4: Exposure limit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
                <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Credit Exposure</span>
                    <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.totalExposure.toLocaleString("en-IN")}</h3>
                    <p className="text-[11px] text-emerald-600 font-medium">
                        {stats.totalExposure ? Math.round((stats.totalOutstanding / stats.totalExposure) * 100) : 0}% Utilized
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-6 h-6" />
                </div>
            </div>

            {/* Stat 5: Risk Alerts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
                <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Risk Alerts</span>
                    <h3 className="text-2xl font-extrabold text-slate-800">{stats.criticalAlerts}</h3>
                    <p className="text-[11px] text-rose-500 font-semibold uppercase">
                        {stats.criticalAlerts > 0 ? "Urgent Action Required" : "Risk exposure is safe"}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${stats.criticalAlerts > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-500"
                    }`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
            </div>

        </div>
    )
}

export default StatsGrid