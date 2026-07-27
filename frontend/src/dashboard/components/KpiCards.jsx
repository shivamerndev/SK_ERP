import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, ShoppingBag, Users, FileText, AlertTriangle, IndianRupeeIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { getDashboardKpis } from "../dashboard.service.js";

const KpiSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {Array(5).fill(0).map((_, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-sm animate-pulse h-[116px]">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="w-9 h-9 rounded-full bg-slate-200" />
                </div>
                <div className="mb-2">
                    <div className="h-6 w-24 bg-slate-200 rounded mb-1.5" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
            </div>
        ))}
    </div>
);

const KpiCards = ({ selectedDateRange }) => {
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        getDashboardKpis(selectedDateRange)
            .then(res => {
                if (isMounted) {
                    setKpiData(res.data?.data || null);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Error loading KPI cards:", err);
                if (isMounted) {
                    setError("Failed to load KPI metrics");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [selectedDateRange]);

    // Sparkline formatting helper
    const formatSparklineData = (data) => data.map((val, idx) => ({ idx, value: val }));

    const currentKpis = useMemo(() => {
        if (!kpiData) return [];

        // Fetch low stock items from localStorage
        let lowStockCount = 0;
        let totalItems = 0;
        try {
            const savedInventory = localStorage.getItem("erp_silver_inventory");
            const designs = savedInventory ? JSON.parse(savedInventory) : [];
            totalItems = designs.length;
            lowStockCount = designs.filter(item => (item.stocks || 0) <= 10).length;
        } catch (e) {
            console.error("Failed to parse inventory from localStorage:", e);
        }
        const lowStockPercent = totalItems > 0 ? Math.round((lowStockCount / totalItems) * 1000) / 10 : 0;

        const backendKpis = [
            {
                title: "Total Revenue",
                value: "₹" + Number(kpiData.revenue?.value || 0).toLocaleString("en-IN"),
                percentage: kpiData.revenue?.percentage || "+0%",
                subtext: kpiData.revenue?.subtext || "",
                isPositive: kpiData.revenue?.isPositive ?? true,
                color: "#10b981",
                bg: "bg-emerald-50 text-emerald-600",
                sparkline: kpiData.revenue?.sparkline || Array(8).fill(0),
                icon: IndianRupeeIcon
            },
            {
                title: "Total Orders",
                value: Number(kpiData.orders?.value || 0).toLocaleString("en-IN"),
                percentage: kpiData.orders?.percentage || "+0%",
                subtext: kpiData.orders?.subtext || "",
                isPositive: kpiData.orders?.isPositive ?? true,
                color: "#3b82f6",
                bg: "bg-blue-50 text-blue-600",
                sparkline: kpiData.orders?.sparkline || Array(8).fill(0),
                icon: ShoppingBag
            },
            {
                title: "Total Customers",
                value: Number(kpiData.customers?.value || 0).toLocaleString("en-IN"),
                percentage: kpiData.customers?.percentage || "+0%",
                subtext: kpiData.customers?.subtext || "",
                isPositive: kpiData.customers?.isPositive ?? true,
                color: "#8b5cf6",
                bg: "bg-purple-50 text-purple-600",
                sparkline: kpiData.customers?.sparkline || Array(8).fill(0),
                icon: Users
            },
            {
                title: "Pending Invoices",
                value: Number(kpiData.pendingInvoices?.value || 0).toLocaleString("en-IN"),
                percentage: kpiData.pendingInvoices?.percentage || "+0%",
                subtext: kpiData.pendingInvoices?.subtext || "",
                isPositive: kpiData.pendingInvoices?.isPositive ?? true,
                color: "#f59e0b",
                bg: "bg-amber-50 text-amber-600",
                sparkline: kpiData.pendingInvoices?.sparkline || Array(8).fill(0),
                icon: FileText
            },
            {
                title: "Low Stock Items",
                value: String(lowStockCount),
                percentage: `${lowStockPercent}%`,
                subtext: "of total items",
                isPositive: false,
                color: "#ef4444",
                bg: "bg-red-50 text-red-600",
                sparkline: [15, 12, 10, 8, 9, 6, 7, lowStockCount],
                icon: AlertTriangle
            }
        ];

        return backendKpis;
    }, [kpiData]);

    if (loading) {
        return <KpiSkeleton />;
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {currentKpis.map((kpi, idx) => {
                const IconComponent = kpi.icon;
                const chartData = formatSparklineData(kpi.sparkline);

                return (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 relative group overflow-hidden">
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{kpi.title}</span>
                            <div className={`w-9 h-9 rounded-full ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Value row */}
                        <div className="mb-2 z-10">
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">{kpi.value}</h3>
                            <div className="flex items-center gap-1">
                                {kpi.isPositive ? (
                                    <span className="text-emerald-500 text-[11px] font-extrabold flex items-center leading-none">
                                        <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> {kpi.percentage}
                                    </span>
                                ) : (
                                    <span className="text-rose-500 text-[11px] font-extrabold flex items-center leading-none">
                                        <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" /> {kpi.percentage}
                                    </span>
                                )}
                                <span className="text-slate-400 text-[10px] font-medium leading-none">{kpi.subtext}</span>
                            </div>
                        </div>

                        {/* Mini Sparkline Chart */}
                        <div className="h-10 w-2/4 mt-1 overflow-hidden absolute -bottom-2 right-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id={`kpi-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={kpi.color} stopOpacity={0.15} />
                                            <stop offset="100%" stopColor={kpi.color} stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={kpi.color}
                                        strokeWidth={1.8}
                                        fill={`url(#kpi-grad-${idx})`}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KpiCards;