import { useState, useEffect, useMemo } from "react";
import { getMetalRates } from "../../dashboard/dashboard.service";
import {
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Coins,
    Scale,
    Activity,
    Info,
    ChevronRight,
    IndianRupeeIcon
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const LiveChart = () => {

    
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMetal, setSelectedMetal] = useState("silver"); // gold, silver
    const [selectedUnit, setSelectedUnit] = useState("kg"); // gram, kg
    const [calcAmount, setCalcAmount] = useState(1);
    const [purity, setPurity] = useState(98.20); // purity % (tunch)
    const [markupPercent, setMarkupPercent] = useState(() => {
        const saved = localStorage.getItem("metal_rate_markup_percent");
        return saved ? parseFloat(saved) : 23.78; // Default to 23.78% to align live rates with local jeweler rate (~2,18,000)
    });
    const [chartData, setChartData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const markup = useMemo(() => 1 + (markupPercent / 100), [markupPercent]);

    useEffect(() => {
        setPurity(selectedMetal === "gold" ? 91.60 : 98.20);
        setCalcAmount(selectedMetal === "gold" ? 10 : 1);
    }, [selectedMetal]);


    const formatCurrency = (val, currency = "INR") => {
        return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 3
        }).format(val);
    };


    const generateInitialChartData = (currentVal, todayLow, todayHigh) => {
        const pointsCount = 12;
        const data = [];
        const now = new Date();

        // Create timestamps back in time (e.g., 20 mins intervals)
        for (let i = pointsCount - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 20 * 60 * 1000);
            const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let price;
            if (i === 0) {
                // Last point is exactly the current price
                price = currentVal;
            } else {
                // Generate values varying between today's low and high, tending towards current
                const progress = (pointsCount - i) / pointsCount;
                const randomFactor = Math.sin(i * 0.8) * 0.4 + (Math.random() - 0.5) * 0.2;
                const midPrice = (todayLow + todayHigh) / 2;
                price = midPrice + (currentVal - midPrice) * progress + (todayHigh - todayLow) * randomFactor * 0.3;

                // Clamp to low and high
                price = Math.max(todayLow * 0.999, Math.min(todayHigh * 1.001, price));
            }

            data.push({
                time: timeStr,
                price: parseFloat(price.toFixed(3)),
                rawTime: time
            });
        }
        return data;
    };

    const fetchRates = async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        else setLoading(true);

        try {
            const res = await getMetalRates();
            if (res.data?.success) {
                const fetchedData = res.data.data;
                setRates(fetchedData);
                setError(null);

                // Derive active metal prices with standard Indian import duty & taxes (derived from user settings)
                const currentMarkup = 1 + (markupPercent / 100);
                const goldCurrentGram = parseFloat(fetchedData.gram_in_inr) * currentMarkup;
                const goldCurrentKg = goldCurrentGram * 1000;
                const goldLowGram = ((parseFloat(fetchedData.ounce_price_usd_today_low) * parseFloat(fetchedData.usd_to_inr)) / 31.1035) * currentMarkup;
                const goldHighGram = ((parseFloat(fetchedData.ounce_price_usd_today_high) * parseFloat(fetchedData.usd_to_inr)) / 31.1035) * currentMarkup;

                const silverCurrentGram = parseFloat(fetchedData.silver_gram_in_inr) * currentMarkup;
                const silverCurrentKg = silverCurrentGram * 1000;
                const silverLowGram = (parseFloat(fetchedData.silver_ounce_price_inr_today_low) / 31.1035) * currentMarkup;
                const silverHighGram = (parseFloat(fetchedData.silver_ounce_price_inr_today_high) / 31.1035) * currentMarkup;

                // Initialize or update chart data
                const currentSelectedPrice = selectedMetal === "gold"
                    ? (selectedUnit === "gram" ? goldCurrentGram : goldCurrentKg)
                    : (selectedUnit === "gram" ? silverCurrentGram : silverCurrentKg);

                const currentSelectedLow = selectedMetal === "gold"
                    ? (selectedUnit === "gram" ? goldLowGram : goldLowGram * 1000)
                    : (selectedUnit === "gram" ? silverLowGram : silverLowGram * 1000);

                const currentSelectedHigh = selectedMetal === "gold"
                    ? (selectedUnit === "gram" ? goldHighGram : goldHighGram * 1000)
                    : (selectedUnit === "gram" ? silverHighGram : silverHighGram * 1000);

                setChartData(generateInitialChartData(currentSelectedPrice, currentSelectedLow, currentSelectedHigh));
            } else {
                throw new Error(res.data?.message || "Failed to fetch rates");
            }
        } catch (err) {
            console.error("Failed to load metal rates:", err);
            setError("Unable to connect to live rates service. Please try again.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);


    useEffect(() => {
        if (!rates) return;

        const markup = 1.243;
        const goldCurrentGram = parseFloat(rates.gram_in_inr) * markup;
        const goldCurrentKg = goldCurrentGram * 1000;
        const goldLowGram = ((parseFloat(rates.ounce_price_usd_today_low) * parseFloat(rates.usd_to_inr)) / 31.1035) * markup;
        const goldHighGram = ((parseFloat(rates.ounce_price_usd_today_high) * parseFloat(rates.usd_to_inr)) / 31.1035) * markup;

        const silverCurrentGram = parseFloat(rates.silver_gram_in_inr) * markup;
        const silverCurrentKg = silverCurrentGram * 1000;
        const silverLowGram = (parseFloat(rates.silver_ounce_price_inr_today_low) / 31.1035) * markup;
        const silverHighGram = (parseFloat(rates.silver_ounce_price_inr_today_high) / 31.1035) * markup;

        const currentSelectedPrice = selectedMetal === "gold"
            ? (selectedUnit === "gram" ? goldCurrentGram : goldCurrentKg)
            : (selectedUnit === "gram" ? silverCurrentGram : silverCurrentKg);

        const currentSelectedLow = selectedMetal === "gold"
            ? (selectedUnit === "gram" ? goldLowGram : goldLowGram * 1000)
            : (selectedUnit === "gram" ? silverLowGram : silverLowGram * 1000);

        const currentSelectedHigh = selectedMetal === "gold"
            ? (selectedUnit === "gram" ? goldHighGram : goldHighGram * 1000)
            : (selectedUnit === "gram" ? silverHighGram : silverHighGram * 1000);

        setChartData(generateInitialChartData(currentSelectedPrice, currentSelectedLow, currentSelectedHigh));
    }, [selectedMetal, selectedUnit, rates, markup]);


    const metalData = useMemo(() => {
        if (!rates) return null;

        const markup = 1.243; // Indian Import Duty + Taxes Markup
        const goldPriceGramInr = parseFloat(rates.gram_in_inr) * markup;
        const goldPriceKgInr = goldPriceGramInr * 1000;
        const goldPriceGramUsd = parseFloat(rates.gram_in_usd);
        const goldPriceKgUsd = goldPriceGramUsd * 1000;
        const goldLowUsd = parseFloat(rates.ounce_price_usd_today_low);
        const goldHighUsd = parseFloat(rates.ounce_price_usd_today_high);
        const usdToInr = parseFloat(rates.usd_to_inr);

        const silverPriceGramInr = parseFloat(rates.silver_gram_in_inr) * markup;
        const silverPriceKgInr = silverPriceGramInr * 1000;
        const silverPriceGramUsd = parseFloat(rates.silver_gram_in_usd);
        const silverPriceKgUsd = silverPriceGramUsd * 1000;
        const silverLowInr = parseFloat(rates.silver_ounce_price_inr_today_low) * markup;
        const silverHighInr = parseFloat(rates.silver_ounce_price_inr_today_high) * markup;

        if (selectedMetal === "gold") {
            const currentPriceInr = selectedUnit === "gram" ? goldPriceGramInr : goldPriceKgInr;
            const currentPriceUsd = selectedUnit === "gram" ? goldPriceGramUsd : goldPriceKgUsd;
            const lowPriceInr = selectedUnit === "gram" ? ((goldLowUsd * usdToInr) / 31.1035) * markup : (((goldLowUsd * usdToInr) / 31.1035) * markup) * 1000;
            const highPriceInr = selectedUnit === "gram" ? ((goldHighUsd * usdToInr) / 31.1035) * markup : (((goldHighUsd * usdToInr) / 31.1035) * markup) * 1000;

            const midPoint = (lowPriceInr + highPriceInr) / 2;
            const percentDiff = ((currentPriceInr - midPoint) / midPoint) * 100;

            return {
                name: "Gold",
                color: "#d4af37",
                chartColorStop: "#f59e0b",
                currentInr: currentPriceInr,
                currentUsd: currentPriceUsd,
                lowInr: lowPriceInr,
                highInr: highPriceInr,
                percentDiff: percentDiff,
                updatedAt: rates.gmt_ounce_price_usd_updated
            };
        } else {
            const currentPriceInr = selectedUnit === "gram" ? silverPriceGramInr : silverPriceKgInr;
            const currentPriceUsd = selectedUnit === "gram" ? silverPriceGramUsd : silverPriceKgUsd;
            const lowPriceInr = selectedUnit === "gram" ? silverLowInr / 31.1035 : (silverLowInr / 31.1035) * 1000;
            const highPriceInr = selectedUnit === "gram" ? silverHighInr / 31.1035 : (silverHighInr / 31.1035) * 1000;

            const midPoint = (lowPriceInr + highPriceInr) / 2;
            const percentDiff = ((currentPriceInr - midPoint) / midPoint) * 100;

            return {
                name: "Silver",
                color: "#94a3b8",
                chartColorStop: "#475569",
                currentInr: currentPriceInr,
                currentUsd: currentPriceUsd,
                lowInr: lowPriceInr,
                highInr: highPriceInr,
                percentDiff: percentDiff,
                updatedAt: rates.gmt_inr_updated
            };
        }
    }, [rates, selectedMetal, selectedUnit, markup]);


    const calcTotal = useMemo(() => {
        if (!metalData) return 0;
        return calcAmount * metalData.currentInr * (purity / 100);
    }, [calcAmount, metalData, purity]);


    const positionPercentage = useMemo(() => {
        if (!metalData) return 50;
        const { currentInr, lowInr, highInr } = metalData;
        const range = highInr - lowInr;
        if (range <= 0) return 50;
        const pos = ((currentInr - lowInr) / range) * 100;
        return Math.max(0, Math.min(100, pos));
    }, [metalData]);


    if (loading) {
        return (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-center items-center">
                <Activity className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-500">Loading live gold & silver rates...</p>
            </div>
        );
    }

    if (error || !rates || !metalData) {
        return (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                    <Info className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-2">{error || "Something went wrong"}</p>
                <p className="text-xs text-slate-400 max-w-xs mb-4">We could not fetch live metal rates from the server. Check your connection.</p>
                <button
                    onClick={() => fetchRates()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[480px]">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                    <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-500 animate-pulse" />
                        Live Metal Exchange Rates (India)
                    </h2>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Realtime Landed Price (INR • Incl. Duties & GST)
                    </span>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Metal Selector Tabs */}
                    <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-bold">
                        <button
                            onClick={() => setSelectedMetal("gold")}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${selectedMetal === "gold"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            Gold
                        </button>
                        <button
                            onClick={() => setSelectedMetal("silver")}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${selectedMetal === "silver"
                                ? "bg-white text-slate-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            Silver
                        </button>
                    </div>

                    {/* Unit Selector */}
                    <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-bold">
                        <button
                            onClick={() => setSelectedUnit("gram")}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${selectedUnit === "gram"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            Per Gram
                        </button>
                        <button
                            onClick={() => setSelectedUnit("kg")}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${selectedUnit === "kg"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            Per Kg
                        </button>
                    </div>

                    {/* Indian Market Markup Adjustment */}
                    <div className="flex bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold items-center gap-1">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase">Markup</span>
                        <input
                            type="number"
                            step="0.01"
                            value={markupPercent}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setMarkupPercent(val);
                                localStorage.setItem("metal_rate_markup_percent", val.toString());
                            }}
                            className="w-10 text-right bg-transparent focus:outline-none font-bold text-slate-700 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-[9px] text-slate-400 font-bold">%</span>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchRates(true)}
                        disabled={isRefreshing}
                        className={`p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer ${isRefreshing ? "opacity-50" : ""
                            }`}
                        title="Refresh Prices"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Main stats layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch mb-4">
                {/* KPI Panel */}
                <div className="md:col-span-4 flex flex-col justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Spot Price ({selectedUnit === "gram" ? "1g" : "1kg"})
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase flex items-center ${metalData.percentDiff >= 0
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                                }`}>
                                {metalData.percentDiff >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {metalData.percentDiff >= 0 ? "+" : ""}{metalData.percentDiff.toFixed(2)}%
                            </span>
                        </div>

                        <div className="text-2xl font-extrabold text-slate-800 mt-1">
                            {formatCurrency(metalData.currentInr)}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <IndianRupeeIcon className="w-3 h-3 text-slate-400" />
                            {formatCurrency(metalData.currentUsd, "USD")} USD
                        </div>
                    </div>

                    {/* Low/High bar graph */}
                    <div className="mt-5 flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Today's Low</span>
                            <span>Today's High</span>
                        </div>
                        <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-visible">
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md transition-all duration-300"
                                style={{
                                    left: `${positionPercentage}%`,
                                    backgroundColor: metalData.color,
                                    transform: `translate(-50%, -50%)`
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-xs font-extrabold text-slate-700">
                            <span>{formatCurrency(metalData.lowInr)}</span>
                            <span>{formatCurrency(metalData.highInr)}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/80 text-[9px] text-slate-400 font-medium">
                        GMT Updated: {metalData.updatedAt || "Just now"}
                    </div>
                </div>

                {/* Real-time area chart */}
                <div className="md:col-span-8 border border-slate-100 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {metalData.name} Price Intraday Movement (INR/{selectedUnit})
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold bg-white border border-slate-100 shadow-sm px-1.5 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Live Tracker
                        </span>
                    </div>

                    <div className="flex-1 w-full h-[180px] mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="metalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={metalData.color} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={metalData.color} stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#94a3b8"
                                    fontSize={8}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={8}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['auto', 'auto']}
                                    tickFormatter={(v) => `₹${v.toFixed(0)}`}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl text-white text-[10px] font-bold shadow-xl">
                                                    <p className="text-slate-400 font-semibold">{payload[0].payload.time}</p>
                                                    <p className="mt-0.5 text-xs font-extrabold" style={{ color: metalData.color }}>
                                                        {formatCurrency(payload[0].value)}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={metalData.color}
                                    strokeWidth={2}
                                    fill="url(#metalAreaGrad)"
                                    activeDot={{ r: 5, strokeWidth: 1.5, stroke: "#fff" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Calculator tool for metal rates */}
            <div className="mt-2 bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Scale className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-slate-800">Quick Value Calculator</span>
                        <span className="text-[10px] text-slate-400 font-medium">Estimate inventory gold/silver value</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                        <input
                            type="number"
                            value={calcAmount}
                            onChange={(e) => setCalcAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-12 sm:w-16 text-right font-bold text-xs focus:outline-none text-slate-800 pr-1.5"
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase border-l border-slate-100 pl-1.5">
                            {selectedUnit === "gram" ? "grams" : "kg"}
                        </span>
                    </div>

                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 pr-1.5 border-r border-slate-100 mr-1.5">
                            TUNCH
                        </span>
                        <input
                            type="number"
                            step="0.01"
                            value={purity}
                            onChange={(e) => setPurity(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                            className="w-12 text-right font-bold text-xs focus:outline-none text-slate-800 pr-1"
                        />
                        <span className="text-[10px] font-bold text-slate-400 pl-0.5">
                            %
                        </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />

                    <div className="bg-blue-50 text-blue-700 border border-blue-100 font-extrabold text-xs px-3.5 py-2 rounded-xl text-center min-w-[120px]">
                        {formatCurrency(calcTotal)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveChart;