import { TrendingUp, CheckCircle, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from "recharts";


const Analytics = () => {

    const [showAnalytics, setShowAnalytics] = useState(true);

    let customers = []

    const chartData = useMemo(() => {
        // 1. Top Debtors
        const topDebtors = [...customers]
            .map(c => ({ name: c.name, Outstanding: getBalance(c), Limit: c.creditLimit }))
            .filter(d => d.Outstanding > 0)
            .sort((a, b) => b.Outstanding - a.Outstanding)
            .slice(0, 5);

        // 2. Top Shoppers by LTV
        const topShoppers = [...customers]
            .map(c => ({ name: c.name, "Total Lent Value": getLTV(c), Paid: getPaid(c) }))
            .sort((a, b) => b["Total Lent Value"] - a["Total Lent Value"])
            .slice(0, 5);

        // 3. Risk Breakdown (Pie Chart)
        let safeCount = 0;
        let warnCount = 0;
        let critCount = 0;

        customers.forEach(c => {
            const risk = getRiskCategory(c);
            if (risk === "Critical") critCount++;
            else if (risk === "Warning") warnCount++;
            else safeCount++;
        });

        const riskPieData = [
            { name: "Safe (<75%)", value: safeCount, color: "#10b981" },
            { name: "Warning (75-95%)", value: warnCount, color: "#f59e0b" },
            { name: "Critical (>=95%)", value: critCount, color: "#ef4444" }
        ].filter(d => d.value > 0);

        return { topDebtors, topShoppers, riskPieData };
    }, []);


    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-800">Visual Insights & Risk Distributions</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{showAnalytics ? "Collapse Charts" : "Expand Charts"}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showAnalytics ? "rotate-180" : ""}`} />
                </div>
            </button>

            {showAnalytics && (
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart 1: Top Debtors */}
                    <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Debtors Outstanding Balance</h4>
                        <div className="h-64">
                            {chartData.topDebtors.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData.topDebtors} margin={{ left: -10, right: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                                            formatter={(val) => [`₹${val.toLocaleString("en-IN")}`, "Debt"]}
                                        />
                                        <Bar dataKey="Outstanding" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                                            {chartData.topDebtors.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.Outstanding >= entry.Limit ? "#ef4444" : "#f59e0b"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
                                    <span className="text-sm font-medium">All debts cleared!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart 2: Top Shoppers LTV */}
                    <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Purchases (LTV) vs. Settled Payments</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.topShoppers} margin={{ left: -10, right: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                                        formatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Bar dataKey="Total Lent Value" name="Total Lent" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Paid" name="Total Settled" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 3: Credit Risk Distribution */}
                    <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Credit Exposure Risk Categories</h4>
                            <div className="h-44 flex items-center justify-center">
                                {chartData.riskPieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData.riskPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {chartData.riskPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val) => [`${val} Customer(s)`, "Count"]} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <span className="text-sm text-slate-400">No customer risk statistics available.</span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-around text-xs mt-2 border-t border-slate-200/50 pt-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-slate-600 font-medium">Safe</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <span className="text-slate-600 font-medium">Warning</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <span className="text-slate-600 font-medium">Critical</span>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Analytics