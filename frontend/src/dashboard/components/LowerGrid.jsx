import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, XCircle, Package, LineChart as LineIcon } from "lucide-react";
import Calendar from "./Calendar";
import { getLowerGridData } from "../dashboard.service.js";

const InventorySummarySkeleton = () => (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-4 flex flex-col justify-between shadow-sm animate-pulse h-[252px]">
        <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 my-auto">
            {Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 flex items-center gap-3 h-[72px]">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex-shrink-0" />
                    <div className="flex flex-col gap-1.5 w-full">
                        <div className="h-2 w-12 bg-slate-200 rounded" />
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                        <div className="h-1.5 w-8 bg-slate-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TopProductsSkeleton = () => (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between shadow-sm animate-pulse h-[252px]">
        <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
        </div>
        <div className="flex flex-col gap-3.5 my-auto">
            {Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-3 w-8 bg-slate-200 rounded" />
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-200 rounded-full w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const LowerGrid = ({ layout, selectedDateRange }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        getLowerGridData(selectedDateRange)
            .then(res => {
                if (isMounted) {
                    setData(res.data?.data || null);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Error loading lower grid metrics:", err);
                if (isMounted) {
                    setError("Failed to load metrics");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [selectedDateRange]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Inventory Summary Section */}
            {layout.inventorySummary && (
                loading ? (
                    <InventorySummarySkeleton />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 lg:col-span-4 flex items-center justify-center text-center font-semibold text-xs h-[252px]">
                        {error}
                    </div>
                ) : data?.inventorySummary ? (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-4 flex flex-col justify-between shadow-sm min-h-[252px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                                <Package className="w-4.5 h-4.5 text-blue-500" /> Inventory Summary
                            </h2>
                            <a
                                href="/inventory"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4 my-auto">
                            {/* Total Items */}
                            <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Total Items</span>
                                    <strong className="text-sm font-extrabold text-slate-800 mt-0.5">
                                        {data.inventorySummary.totalItems.toLocaleString("en-IN")}
                                    </strong>
                                    <span className="text-slate-400 text-[9px] font-semibold mt-0.5">All Items</span>
                                </div>
                            </div>

                            {/* In Stock */}
                            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-slate-400 text-[10px] font-semibold uppercase">In Stock</span>
                                    <strong className="text-sm font-extrabold text-slate-800 mt-0.5">
                                        {data.inventorySummary.inStock.toLocaleString("en-IN")}
                                    </strong>
                                    <span className="text-emerald-500 text-[9px] font-bold mt-0.5">
                                        {data.inventorySummary.inStockPercent}%
                                    </span>
                                </div>
                            </div>

                            {/* Low Stock */}
                            <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Low Stock</span>
                                    <strong className="text-sm font-extrabold text-slate-800 mt-0.5">
                                        {data.inventorySummary.lowStock.toLocaleString("en-IN")}
                                    </strong>
                                    <span className="text-amber-500 text-[9px] font-bold mt-0.5">
                                        {data.inventorySummary.lowStockPercent}%
                                    </span>
                                </div>
                            </div>

                            {/* Out of Stock */}
                            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                                    <XCircle className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Out of Stock</span>
                                    <strong className="text-sm font-extrabold text-slate-800 mt-0.5">
                                        {data.inventorySummary.outOfStock.toLocaleString("en-IN")}
                                    </strong>
                                    <span className="text-rose-500 text-[9px] font-bold mt-0.5">
                                        {data.inventorySummary.outOfStockPercent}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            )}

            {/* Top Performed Product Section */}
            {layout.projectsOverview && (
                loading ? (
                    <TopProductsSkeleton />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 lg:col-span-3 flex items-center justify-center text-center font-semibold text-xs h-[252px]">
                        {error}
                    </div>
                ) : data?.topPerformedProducts ? (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between shadow-sm min-h-[252px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                                <LineIcon className="w-4 h-4 text-purple-500" />
                                Top Performed Product
                            </h2>
                            <a href="/inventory"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </a>
                        </div>

                        <div className="flex flex-col gap-3.5 my-auto">
                            {data.topPerformedProducts.length > 0 ? (
                                data.topPerformedProducts.map((proj, idx) => (
                                    <div key={idx} className="flex flex-col leading-none">
                                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                                            <span className="truncate pr-2">{proj.name}</span>
                                            <span className="text-slate-500 font-bold">{proj.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${proj.color} rounded-full transition-all duration-500`}
                                                style={{ width: `${proj.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs font-medium text-slate-400 text-center my-auto py-8">
                                    No sales transactions recorded.
                                </div>
                            )}
                        </div>
                    </div>
                ) : null
            )}

            {layout.calendar && <Calendar />}
        </div>
    );
};

export default LowerGrid;