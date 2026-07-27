import { TrendingUp, BarChart3, PieChart as PieIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import GlassTooltip from "./GlassTooltip";
import { getBillHistory } from "../../billing/billing.service.js";
import { currencyFormatter } from "../../utils/currencyFormatter.js";


const ChartArea = ({ layout, monthlyFilter, setMonthlyFilter }) => {


    const revenueTrendPresets = {
        Monthly: [
            { name: "Jan", Revenue: 1500000 },
            { name: "Feb", Revenue: 1700000 },
            { name: "Mar", Revenue: 1900000 },
            { name: "Apr", Revenue: 1800000 },
            { name: "May", Revenue: 2451200 },
            { name: "Jun", Revenue: 2100000 },
            { name: "Jul", Revenue: 2000000 },
            { name: "Aug", Revenue: 2050000 },
            { name: "Sep", Revenue: 1950000 },
            { name: "Oct", Revenue: 2150000 },
            { name: "Nov", Revenue: 2250000 },
            { name: "Dec", Revenue: 2350000 }
        ],
        Weekly: [
            { name: "Week 1", Revenue: 512000 },
            { name: "Week 2", Revenue: 580000 },
            { name: "Week 3", Revenue: 620000 },
            { name: "Week 4", Revenue: 739200 }
        ],
        Quarterly: [
            { name: "Q1", Revenue: 5100000 },
            { name: "Q2", Revenue: 6651200 },
            { name: "Q3", Revenue: 6000000 },
            { name: "Q4", Revenue: 6750000 }
        ]
    };

    const categorySalesData = [
        { name: "Electronics", value: 980480, color: "#3b82f6" },
        { name: "Furniture", value: 612800, color: "#10b981" },
        { name: "Clothing", value: 490240, color: "#f59e0b" },
        { name: "Accessories", value: 367680, color: "#ec4899" }
    ];

    const [topCustomers, setTopCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoadingCustomers(true);
        getBillHistory()
            .then((res) => {
                if (!isMounted) return;
                const bills = res.data?.data || [];
                const customerMap = {};
                bills.forEach((bill) => {
                    const key = bill.customerId ? String(bill.customerId) : bill.customerName;
                    if (!key) return;

                    if (!customerMap[key]) {
                        customerMap[key] = {
                            name: bill.customerName || "Unknown Customer",
                            orders: 0,
                            amount: 0,
                        };
                    }
                    customerMap[key].orders += 1;
                    customerMap[key].amount += bill.totals?.amount || 0;
                });

                const customerList = Object.values(customerMap);
                customerList.sort((a, b) => b.amount - a.amount || b.orders - a.orders);

                const top5 = customerList.slice(0, 5);
                const bgColors = [
                    "bg-blue-100 text-blue-700",
                    "bg-emerald-100 text-emerald-700",
                    "bg-cyan-100 text-cyan-700",
                    "bg-amber-100 text-amber-700",
                    "bg-indigo-100 text-indigo-700",
                ];

                const getInitials = (name) => {
                    if (!name) return "??";
                    const parts = name.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        return (parts[0][0] + parts[1][0]).toUpperCase();
                    }
                    return parts[0].slice(0, 2).toUpperCase();
                };

                const formatted = top5.map((cust, index) => ({
                    name: cust.name,
                    orders: cust.orders,
                    amount: currencyFormatter(cust.amount),
                    initials: getInitials(cust.name),
                    bg: bgColors[index % bgColors.length],
                }));

                setTopCustomers(formatted);
                setLoadingCustomers(false);
            })
            .catch((err) => {
                console.error("Failed to fetch top customers:", err);
                if (isMounted) {
                    setLoadingCustomers(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [currencyFormatter]);

    const currentRevenueData = useMemo(() => {
        return revenueTrendPresets[monthlyFilter] || revenueTrendPresets.Monthly;
    }, [monthlyFilter]);


    return <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">


        {layout.revenueOverview && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-6 flex flex-col justify-between shadow-sm min-h-[350px]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-blue-500" /> Revenue Overview
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                                {monthlyFilter === "Weekly" ? "$739,200" : monthlyFilter === "Quarterly" ? "$6,651,200" : "$2,451,200"}
                            </span>
                            <span className="text-emerald-500 text-xs font-bold flex items-center">
                                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> +18.6%
                            </span>
                            <span className="text-slate-400 text-[10px] font-medium">vs Prev Period</span>
                        </div>
                    </div>

                    <select value={monthlyFilter} onChange={(e) => setMonthlyFilter(e.target.value)} className="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-100 cursor-pointer">
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Quarterly">Quarterly</option>
                    </select>
                </div>

                <div className="flex-1 w-full h-[220px] relative mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => (v >= 1000000 ? `$${v / 1000000}M` : `$${v / 1000}k`)} />
                            <Tooltip content={<GlassTooltip />} />
                            <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueAreaGrad)" activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* Sales by Category (Interactive Donut Chart) */}
        {layout.salesByCategory && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-3 flex flex-col shadow-sm min-h-[350px]">
                <h2 className="text-base font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-1.5">
                    <PieIcon className="w-4 h-4 text-emerald-500" /> Sales by Category
                </h2>
                <div className="flex-1 flex flex-col items-center justify-center gap-5">
                    {/* Pie graphic */}
                    <div className="relative w-36 h-36 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<GlassTooltip />} />
                                <Pie data={categorySalesData} innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value" >
                                    {categorySalesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Total</span>
                            <span className="text-base font-extrabold text-slate-800 mt-1">$2.45M</span>
                        </div>
                    </div>

                    {/* Pie Legend Details */}
                    <div className="w-full flex flex-col gap-2">
                        {categorySalesData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span>{item.name}</span>
                                </div>
                                <span className="text-slate-400">
                                    {((item.value / 2451200) * 100).toFixed(0)}%{" "}
                                    <strong className="text-slate-700 ml-1.5">{currencyFormatter(item.value)}</strong>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Top Customers (List Table) */}
        {layout.topCustomers && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between shadow-sm min-h-[350px]">
                <div className="flex items-center justify-between mb-3.5">
                    <h2 className="text-base font-bold text-slate-800 tracking-tight">Top Customers</h2>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Customers list view opened."); }} className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</a>
                </div>

                <div className="flex flex-col gap-3 my-auto">
                    {loadingCustomers ? (
                        Array(5).fill(0).map((_, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 px-2.5 animate-pulse">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8.5 h-8.5 rounded-full bg-slate-200 flex-shrink-0" />
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="h-3 w-20 bg-slate-200 rounded" />
                                        <div className="h-2 w-12 bg-slate-200 rounded" />
                                    </div>
                                </div>
                                <div className="h-3 w-10 bg-slate-200 rounded" />
                            </div>
                        ))
                    ) : topCustomers.length === 0 ? (
                        <div className="text-center text-xs text-slate-400 py-8">
                            No customer records found
                        </div>
                    ) : (
                        topCustomers.map((cust, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 bg-slate-50/20 hover:bg-slate-50 px-2.5 rounded-xl transition-colors duration-150">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`w-8.5 h-8.5 rounded-full ${cust.bg} flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                                        {cust.initials}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-slate-800 truncate leading-tight">{cust.name}</span>
                                        <span className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">{cust.orders} Orders</span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-800">{cust.amount}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
    </div>
}

export default ChartArea