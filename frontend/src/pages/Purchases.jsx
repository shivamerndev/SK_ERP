import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Download,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  Filter,
  CheckCircle,
  ChevronDown,
  Scale,
  Sparkles,
  Package,
  Printer
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area,
  Line
} from "recharts";

// ----------------------------------------------------
// DEFAULT PURCHASE RECORDS (Spanning June & July 2026)
// ----------------------------------------------------
const INITIAL_PURCHASES = [
  {
    id: "purchase-1",
    billCode: "PUR-2026-101",
    date: "2026-06-10",
    sku: "SLV-RG-002",
    productName: "Oxidized Floral Band Ring",
    category: "Rings",
    supplierName: "Apex Silver Refinery",
    quantity: 50,
    weightPerPiece: 6.8,
    totalWeight: 340.0, // 50 * 6.8
    silverRate: 80.0, // ₹80 / gram
    makingChargeType: "PER_GRAM",
    makingCharge: 10, // ₹10 / gram
    purity: 925,
    cost: 31518, // Math.round((340 * 80 * 0.925 + 340 * 10) * 1.03)
    paymentMethod: "Bank Transfer"
  },
  {
    id: "purchase-2",
    billCode: "PUR-2026-102",
    date: "2026-06-20",
    sku: "SLV-PY-001",
    productName: "Sterling Bridal Payal (Anklet)",
    category: "Anklets",
    supplierName: "Jaipur Filigree Works",
    quantity: 20,
    weightPerPiece: 42.5,
    totalWeight: 850.0,
    silverRate: 81.0,
    makingChargeType: "PER_GRAM",
    makingCharge: 8,
    purity: 925,
    cost: 72688,
    paymentMethod: "UPI"
  },
  {
    id: "purchase-3",
    billCode: "PUR-2026-103",
    date: "2026-07-05",
    sku: "SLV-KD-003",
    productName: "Classic Rajasthani Kada (Bracelet)",
    category: "Bracelets",
    supplierName: "Mewar Ornaments",
    quantity: 30,
    weightPerPiece: 35.0,
    totalWeight: 1050.0,
    silverRate: 82.0,
    makingChargeType: "PER_GRAM",
    makingCharge: 7,
    purity: 925,
    cost: 99879,
    paymentMethod: "Bank Transfer"
  },
  {
    id: "purchase-4",
    billCode: "PUR-2026-104",
    date: "2026-07-12",
    sku: "SLV-CH-004",
    productName: "Unisex Curb Link Chain",
    category: "Chains",
    supplierName: "Gujarat Silver Labs",
    quantity: 60,
    weightPerPiece: 18.2,
    totalWeight: 1092.0,
    silverRate: 83.0,
    makingChargeType: "PER_GRAM",
    makingCharge: 6,
    purity: 925,
    cost: 92945,
    paymentMethod: "UPI"
  },
  {
    id: "purchase-5",
    billCode: "PUR-2026-105",
    date: "2026-07-18",
    sku: "SLV-TR-005",
    productName: "Traditional Adjustable Bichhiya (Toe Rings)",
    category: "Toe Rings",
    supplierName: "Surat Craft Co.",
    quantity: 150,
    weightPerPiece: 4.5,
    totalWeight: 675.0,
    silverRate: 84.0,
    makingChargeType: "FLAT_PIECE",
    makingCharge: 30,
    purity: 900,
    cost: 57273,
    paymentMethod: "Cash"
  }
];

const Purchases = () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [purchaseRecords, setPurchaseRecords] = useState(() => {
    const saved = localStorage.getItem("erp_purchase_records");
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("erp_silver_inventory");
    return saved ? JSON.parse(saved) : [];
  });

  // Daily silver rate for pricing calculations
  const [silverRate, setSilverRate] = useState(() => {
    const rate = localStorage.getItem("erp_live_silver_rate");
    return rate ? parseFloat(rate) : 85.0;
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateRangePreset, setDateRangePreset] = useState("All"); // All, Today, Yesterday, ThisWeek, ThisMonth, Custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [sortBy, setSortBy] = useState("date"); // date, weight, cost
  const [sortOrder, setSortOrder] = useState("desc");

  const [showCharts, setShowCharts] = useState(true);

  // Modals & Panels
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Record Purchase Form state
  const [purchaseForm, setPurchaseForm] = useState({
    date: new Date().toISOString().split("T")[0],
    sku: "",
    supplierName: "",
    quantity: "",
    appliedRate: "",
    paymentMethod: "Bank Transfer"
  });

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Toast Alerts
  const [toasts, setToasts] = useState([]);

  // ----------------------------------------------------
  // PERSISTENCE EFFECTS
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_purchase_records", JSON.stringify(purchaseRecords));
  }, [purchaseRecords]);

  // Dynamic storage syncing
  useEffect(() => {
    const handleStorage = () => {
      const savedInv = localStorage.getItem("erp_silver_inventory");
      if (savedInv) setInventory(JSON.parse(savedInv));

      const rate = localStorage.getItem("erp_live_silver_rate");
      if (rate) setSilverRate(parseFloat(rate));
    };
    window.addEventListener("storage", handleStorage);
    // Poll to keep updated
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // ----------------------------------------------------
  // TOAST HANDLER
  // ----------------------------------------------------
  const triggerToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ----------------------------------------------------
  // BILL CALCULATOR
  // ----------------------------------------------------
  const getSilverCost = (item, rate, qty) => {
    return item.weight * qty * rate * (item.purity / 1000);
  };

  const getMakingCost = (item, qty) => {
    if (item.makingChargeType === "PER_GRAM") {
      return item.weight * qty * item.makingCharge;
    }
    return item.makingCharge * qty;
  };

  const getCalculatedPurchase = (item, rate, qty) => {
    if (!item) return { weight: 0, silverCost: 0, makingCost: 0, totalBeforeGST: 0, gst: 0, netTotal: 0 };
    const weight = item.weight * qty;
    const silverCost = getSilverCost(item, rate, qty);
    const makingCost = getMakingCost(item, qty);
    const totalBeforeGST = silverCost + makingCost;
    const gst = totalBeforeGST * 0.03; // GST 3%
    const netTotal = totalBeforeGST + gst;

    return {
      weight,
      silverCost: Math.round(silverCost),
      makingCost: Math.round(makingCost),
      totalBeforeGST: Math.round(totalBeforeGST),
      gst: Math.round(gst),
      netTotal: Math.round(netTotal)
    };
  };

  // ----------------------------------------------------
  // FILTER & SORT DATA
  // ----------------------------------------------------
  const filteredPurchases = useMemo(() => {
    let result = [...purchaseRecords];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.billCode.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.productName.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Payment Filter
    if (paymentFilter !== "All") {
      result = result.filter(p => p.paymentMethod === paymentFilter);
    }

    // Date range preset filter
    if (dateRangePreset !== "All") {
      const todayStr = new Date().toISOString().split("T")[0];
      const today = new Date(todayStr);

      result = result.filter(p => {
        const pDate = new Date(p.date);

        if (dateRangePreset === "Today") {
          return p.date === todayStr;
        }
        if (dateRangePreset === "Yesterday") {
          const yest = new Date(today);
          yest.setDate(today.getDate() - 1);
          const yestStr = yest.toISOString().split("T")[0];
          return p.date === yestStr;
        }
        if (dateRangePreset === "ThisWeek") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          return pDate >= sevenDaysAgo && pDate <= today;
        }
        if (dateRangePreset === "ThisMonth") {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return pDate >= startOfMonth && pDate <= today;
        }
        if (dateRangePreset === "Custom") {
          if (customStartDate && customEndDate) {
            return p.date >= customStartDate && p.date <= customEndDate;
          }
          if (customStartDate) {
            return p.date >= customStartDate;
          }
          if (customEndDate) {
            return p.date <= customEndDate;
          }
        }
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "date") {
        valA = a.date;
        valB = b.date;
        if (valA === valB) {
          return sortOrder === "asc" ? a.cost - b.cost : b.cost - a.cost;
        }
      } else if (sortBy === "weight") {
        valA = a.totalWeight;
        valB = b.totalWeight;
      } else if (sortBy === "cost") {
        valA = a.cost;
        valB = b.cost;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [purchaseRecords, searchQuery, categoryFilter, paymentFilter, dateRangePreset, customStartDate, customEndDate, sortBy, sortOrder]);

  // ----------------------------------------------------
  // CALCULATE KPI SUMMARIES
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let cost = 0;
    let weight = 0;
    let pieces = 0;

    filteredPurchases.forEach(p => {
      cost += Number(p.cost || 0);
      weight += Number(p.totalWeight || 0);
      pieces += Number(p.quantity || 0);
    });

    const valPerGram = weight ? Math.round(cost / weight) : 0;

    return {
      totalCost: cost,
      totalWeight: weight,
      totalPieces: pieces,
      valPerGram
    };
  }, [filteredPurchases]);

  // ----------------------------------------------------
  // WEEKLY & MONTHLY PERFORMANCE COMPARISONS
  // ----------------------------------------------------
  const comparisons = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);

    // Weeks
    const w1Start = new Date();
    w1Start.setDate(today.getDate() - 7);
    const w2Start = new Date();
    w2Start.setDate(today.getDate() - 14);

    let thisWeekCost = 0;
    let thisWeekWeight = 0;
    let lastWeekCost = 0;
    let lastWeekWeight = 0;

    // Months
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let thisMonthCost = 0;
    let thisMonthWeight = 0;
    let lastMonthCost = 0;
    let lastMonthWeight = 0;

    purchaseRecords.forEach(p => {
      const pDate = new Date(p.date);
      const cost = Number(p.cost || 0);
      const weight = Number(p.totalWeight || 0);

      // Week stats check
      if (pDate >= w1Start && pDate <= today) {
        thisWeekCost += cost;
        thisWeekWeight += weight;
      } else if (pDate >= w2Start && pDate < w1Start) {
        lastWeekCost += cost;
        lastWeekWeight += weight;
      }

      // Month stats check
      if (pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth) {
        thisMonthCost += cost;
        thisMonthWeight += weight;
      } else if (
        (currentMonth === 0 && pDate.getFullYear() === currentYear - 1 && pDate.getMonth() === 11) ||
        (currentMonth > 0 && pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth - 1)
      ) {
        lastMonthCost += cost;
        lastMonthWeight += weight;
      }
    });

    const calcChange = (current, previous) => {
      if (!previous) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      week: {
        cost: thisWeekCost,
        weight: thisWeekWeight,
        costChange: calcChange(thisWeekCost, lastWeekCost),
        weightChange: calcChange(thisWeekWeight, lastWeekWeight),
        lastCost: lastWeekCost,
        lastWeight: lastWeekWeight
      },
      month: {
        cost: thisMonthCost,
        weight: thisMonthWeight,
        costChange: calcChange(thisMonthCost, lastMonthCost),
        weightChange: calcChange(thisMonthWeight, lastMonthWeight),
        lastCost: lastMonthCost,
        lastWeight: lastMonthWeight
      }
    };
  }, [purchaseRecords]);

  // ----------------------------------------------------
  // CHART DATA PREPARATIONS
  // ----------------------------------------------------
  const chartData = useMemo(() => {
    // 1. Dual-Axis Purchases Trend (Datewise Cost & Weight)
    const dateMap = {};
    filteredPurchases.forEach(p => {
      if (!dateMap[p.date]) {
        dateMap[p.date] = { date: p.date, Cost: 0, "Weight (g)": 0 };
      }
      dateMap[p.date].Cost += p.cost;
      dateMap[p.date]["Weight (g)"] += p.totalWeight;
    });

    const dailyTrendData = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-15);

    // 2. Category Weight & Cost
    const catMap = {};
    filteredPurchases.forEach(p => {
      if (!catMap[p.category]) {
        catMap[p.category] = { name: p.category, Cost: 0, "Weight (g)": 0 };
      }
      catMap[p.category].Cost += p.cost;
      catMap[p.category]["Weight (g)"] += Math.round(p.totalWeight);
    });

    const categoryPurchasesData = Object.values(catMap);

    // 3. Top SKUs by Cost
    const skuMap = {};
    filteredPurchases.forEach(p => {
      if (!skuMap[p.sku]) {
        skuMap[p.sku] = { sku: p.sku, name: p.productName, Cost: 0, "Weight (g)": 0 };
      }
      skuMap[p.sku].Cost += p.cost;
      skuMap[p.sku]["Weight (g)"] += Math.round(p.totalWeight);
    });

    const topSKUsData = Object.values(skuMap)
      .sort((a, b) => b.Cost - a.Cost)
      .slice(0, 5);

    return { dailyTrendData, categoryPurchasesData, topSKUsData };
  }, [filteredPurchases]);

  // ----------------------------------------------------
  // SELECT SKU FOR FORM
  // ----------------------------------------------------
  const handleSKUChange = (e) => {
    const skuCode = e.target.value;
    const item = inventory.find(d => d.sku === skuCode);

    setSelectedDesign(item || null);
    setPurchaseForm(prev => ({
      ...prev,
      sku: skuCode,
      appliedRate: item ? silverRate : ""
    }));
  };

  // ----------------------------------------------------
  // SUBMIT RECORD NEW PURCHASE
  // ----------------------------------------------------
  const handleRecordPurchaseSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const qty = parseInt(purchaseForm.quantity);
    const rate = parseFloat(purchaseForm.appliedRate);

    if (!purchaseForm.date) errors.date = "Date is required";
    if (!purchaseForm.sku) errors.sku = "Select a design SKU from catalog";
    if (!purchaseForm.supplierName.trim()) errors.supplierName = "Supplier name is required";

    if (isNaN(qty) || qty <= 0) {
      errors.quantity = "Enter a positive piece quantity";
    }

    if (isNaN(rate) || rate <= 0) errors.appliedRate = "Enter a valid silver rate";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Calculations
    const calcs = getCalculatedPurchase(selectedDesign, rate, qty);

    // 1. INCREMENT STOCK IN INVENTORY
    const updatedInv = inventory.map(item => {
      if (item.id === selectedDesign.id) {
        return {
          ...item,
          stocks: item.stocks + qty
        };
      }
      return item;
    });
    localStorage.setItem("erp_silver_inventory", JSON.stringify(updatedInv));
    setInventory(updatedInv);

    // 2. LOG CASH OUTFLOW IN FINANCE LEDGER
    const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
    const financeTx = {
      id: "gen-" + Date.now(),
      date: purchaseForm.date,
      type: "OUTFLOW",
      category: "Material Purchases",
      amount: calcs.netTotal,
      paymentMethod: purchaseForm.paymentMethod,
      description: `Wholesale Purchase: ${qty}x ${selectedDesign.name} (${selectedDesign.sku}) from ${purchaseForm.supplierName.trim()}`
    };
    localStorage.setItem("erp_general_transactions", JSON.stringify([financeTx, ...financeLedger]));

    // 3. CREATE PURCHASE RECORD
    const newPurchase = {
      id: "purchase-" + Date.now(),
      billCode: "PUR-2026-" + Math.floor(Math.random() * 9000 + 1000),
      date: purchaseForm.date,
      sku: selectedDesign.sku,
      productName: selectedDesign.name,
      category: selectedDesign.category,
      supplierName: purchaseForm.supplierName.trim(),
      quantity: qty,
      weightPerPiece: selectedDesign.weight,
      totalWeight: calcs.weight,
      silverRate: rate,
      makingChargeType: selectedDesign.makingChargeType,
      makingCharge: selectedDesign.makingCharge,
      purity: selectedDesign.purity,
      cost: calcs.netTotal,
      paymentMethod: purchaseForm.paymentMethod
    };

    setPurchaseRecords(prev => [newPurchase, ...prev]);
    setIsRecordOpen(false);

    // Reset Form
    setPurchaseForm({
      date: new Date().toISOString().split("T")[0],
      sku: "",
      supplierName: "",
      quantity: "",
      appliedRate: "",
      paymentMethod: "Bank Transfer"
    });
    setSelectedDesign(null);
    setFormErrors({});
    triggerToast(`Bill ${newPurchase.billCode} recorded! Stock incremented & cash flow updated.`);
  };

  // ----------------------------------------------------
  // DELETE PURCHASE (Deduct stocks check)
  // ----------------------------------------------------
  const handleDeleteConfirm = () => {
    if (!selectedPurchase) return;

    // Deduct: take stock back out of inventory
    const updatedInv = inventory.map(item => {
      if (item.sku === selectedPurchase.sku) {
        return {
          ...item,
          stocks: Math.max(0, item.stocks - selectedPurchase.quantity)
        };
      }
      return item;
    });
    localStorage.setItem("erp_silver_inventory", JSON.stringify(updatedInv));
    setInventory(updatedInv);

    // Remove cash outflow transaction from Finance ledger
    const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
    const updatedFinance = financeLedger.filter(tx => {
      const matchText = `PUR-2026-${selectedPurchase.billCode.split("-")[2]}`;
      return !tx.description.includes(matchText) && tx.amount !== selectedPurchase.cost;
    });
    localStorage.setItem("erp_general_transactions", JSON.stringify(updatedFinance));

    // Delete purchase record
    setPurchaseRecords(prev => prev.filter(p => p.id !== selectedPurchase.id));
    setIsDeleteConfirmOpen(false);
    triggerToast(`Bill ${selectedPurchase.billCode} cancelled. Stock deducted & finance reverted.`);
    setSelectedPurchase(null);
  };

  // ----------------------------------------------------
  // EXPORT PURCHASES CSV
  // ----------------------------------------------------
  const handleExportCSV = () => {
    try {
      let csv = "data:text/csv;charset=utf-8,";
      csv += "Bill Code,Date,SKU,Product Name,Category,Supplier Vendor,Quantity,Weight per piece(g),Total Net Weight(g),Applied Silver Rate,Valuation(INR),Payment Method\r\n";

      filteredPurchases.forEach(p => {
        const row = [
          p.billCode,
          p.date,
          p.sku,
          `"${p.productName}"`,
          p.category,
          `"${p.supplierName}"`,
          p.quantity,
          p.weightPerPiece,
          p.totalWeight,
          p.silverRate,
          p.cost,
          p.paymentMethod
        ];
        csv += row.join(",") + "\r\n";
      });

      const encoded = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encoded);
      link.setAttribute("download", `silver_wholesale_purchases_report_${new Date().toISOString().split("T")[0]}.csv`);
      link.click();
      triggerToast("CSV purchase statement exported!");
    } catch (e) {
      triggerToast("Export failed.", "error");
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all duration-300 transform scale-100 hover:scale-102 ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : toast.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">Wholesale Purchases Ledger & Restock</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Log raw jewelry batch replenishment costs against metal weights, maintain supplier accounts, and print purchase vouchers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Record Purchase */}
          <button
            onClick={() => {
              if (inventory.length === 0) {
                triggerToast("Inventory catalog is empty! Create design SKUs first on the Inventory page.", "error");
                return;
              }
              setPurchaseForm({
                date: new Date().toISOString().split("T")[0],
                sku: "",
                supplierName: "",
                quantity: "",
                appliedRate: silverRate,
                paymentMethod: "Bank Transfer"
              });
              setSelectedDesign(null);
              setFormErrors({});
              setIsRecordOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Record restock bill
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            title="Download CSV purchases ledger"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Selector & Presets */}
      <div className="bg-white border border-slate-100 p-4 md:p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Date Range filter (Cost & Weight calculations)</h3>
          </div>

          {/* Date range picker input fields */}
          {dateRangePreset === "Custom" && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold uppercase">From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold uppercase">To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Date presets row */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100/50 pt-3">
          {[
            { label: "All Purchase Logs", val: "All" },
            { label: "Today", val: "Today" },
            { label: "Yesterday", val: "Yesterday" },
            { label: "This Week", val: "ThisWeek" },
            { label: "This Month", val: "ThisMonth" },
            { label: "Custom Dates...", val: "Custom" }
          ].map(p => (
            <button
              key={p.val}
              onClick={() => {
                setDateRangePreset(p.val);
                if (p.val !== "Custom") {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                dateRangePreset === p.val
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* KPI 1: Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Purchase Expense</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.totalCost.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Net expenditure (3% GST inc)</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Weight purchased */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Net Silver Weight Bought</span>
            <h3 className="text-2xl font-extrabold text-slate-800">
              {(stats.totalWeight / 1000).toFixed(2)} kg
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold">{stats.totalWeight.toLocaleString("en-IN")} grams added</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Scale className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: Units purchased */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Units Restocked</span>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.totalPieces}</h3>
            <p className="text-[10px] text-slate-400">Total jewelry pieces restocked</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Package className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Valuation per gram */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Avg Cost per Gram</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.valPerGram}/g</h3>
            <p className="text-[10px] text-emerald-600 font-bold">Average wholesale rate paid</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* Monthly & Weekly Performance Comparison Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Weekly Comparison */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Weekly Restock Comparison</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">7d vs Prev 7d</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Expenditure</span>
              <strong className="text-base text-slate-800">₹{comparisons.week.cost.toLocaleString("en-IN")}</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.week.costChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.week.costChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.week.costChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs ₹{comparisons.week.lastCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Silver Weight Bought</span>
              <strong className="text-base text-slate-800">{comparisons.week.weight.toLocaleString("en-IN")} g</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.week.weightChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.week.weightChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.week.weightChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs {comparisons.week.lastWeight.toLocaleString("en-IN")}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Monthly Restock Comparison</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">This Month vs Prev Month</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Expenditure</span>
              <strong className="text-base text-slate-800">₹{comparisons.month.cost.toLocaleString("en-IN")}</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.month.costChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.month.costChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.month.costChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs ₹{comparisons.month.lastCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Silver Weight Bought</span>
              <strong className="text-base text-slate-800">{comparisons.month.weight.toLocaleString("en-IN")} g</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.month.weightChange >= 0 ? (
                  <span className="text-rose-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.month.weightChange}%</span>
                ) : (
                  <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.month.weightChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs {comparisons.month.lastWeight.toLocaleString("en-IN")}g</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Purchases Trend Analysis Graphs Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Visual Restock Analysis (Weight vs. Cost)</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{showCharts ? "Hide Charts" : "Show Charts"}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCharts ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showCharts && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">

            {/* Chart 1: Dual-Axis Cost vs Net Weight trend */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 lg:col-span-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Daily Purchase Cost (INR) vs. Net Silver Weight Bought (Grams)</h4>
              <div className="h-72">
                {chartData.dailyTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.dailyTrendData} margin={{ left: -10, right: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis yAxisId="left" label={{ value: "Cost (₹)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#6366f1" }} tick={{ fill: "#6366f1", fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: "Weight (grams)", angle: 90, position: "insideRight", fontSize: 10, fill: "#10b981" }} tick={{ fill: "#10b981", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area yAxisId="left" type="monotone" name="Cost (₹)" dataKey="Cost" fill="url(#colorCost)" stroke="#6366f1" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" name="Net Weight (g)" dataKey="Weight (g)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">No transaction dates.</div>
                )}
              </div>
            </div>

            {/* Chart 2: Category distribution (Cost & Weight) */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Category Expenditure</h4>
                <div className="h-56">
                  {chartData.categoryPurchasesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.categoryPurchasesData} margin={{ left: -15, right: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="Cost" name="Cost (₹)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Weight (g)" name="Weight (g)" fill="#10b981" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-xs text-center pt-12">No category purchases.</div>
                  )}
                </div>
              </div>
              <div className="max-h-24 overflow-y-auto text-[10px] space-y-1.5 border-t border-slate-200/50 pt-2.5">
                {chartData.categoryPurchasesData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between font-semibold">
                    <span className="text-slate-600 truncate">{d.name} Category:</span>
                    <span className="text-slate-700">₹{d.Cost.toLocaleString("en-IN")} ({d["Weight (g)"]}g)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Directory Table Area */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Search & Advanced Filters Panel */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bill code, SKU, product, or supplier..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick sorting dropdowns */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="date">Bill Date</option>
                <option value="weight">Net Weight Bought</option>
                <option value="cost">Bill Expenditure</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold cursor-pointer"
                title="Toggle Sort Order"
              >
                {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
              </button>
            </div>

          </div>

          {/* Filtering row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">

            {/* Filter by Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Rings">Rings</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Chains">Chains</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Anklets">Anklets (Payal)</option>
                <option value="Toe Rings">Toe Rings</option>
              </select>
            </div>

            {/* Filter by Payment Method */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment channel</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All channels</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Clear Filters (if active) */}
            {(categoryFilter !== "All" || paymentFilter !== "All" || dateRangePreset !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setPaymentFilter("All");
                  setDateRangePreset("All");
                  setCustomStartDate("");
                  setCustomEndDate("");
                  setSearchQuery("");
                }}
                className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}

          </div>
        </div>

        {/* Directory Table element */}
        <div className="overflow-x-auto">
          {filteredPurchases.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date & Bill Code</th>
                  <th className="px-6 py-4">SKU & Product Name</th>
                  <th className="px-6 py-4">Supplier Vendor</th>
                  <th className="px-6 py-4 text-center">Quantity (pcs)</th>
                  <th className="px-6 py-4 text-center">Net Weight (g)</th>
                  <th className="px-6 py-4 text-center">applied Silver Rate</th>
                  <th className="px-6 py-4 text-right">Bill Cost</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPurchases.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">

                      {/* Date & Bill */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-xs">{p.billCode}</span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {p.date}
                          </span>
                        </div>
                      </td>

                      {/* SKU & Product name */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono font-bold text-xs text-slate-700">{p.sku}</span>
                          <span className="text-slate-500 font-medium text-[11px] truncate mt-0.5">{p.productName}</span>
                        </div>
                      </td>

                      {/* Supplier Vendor */}
                      <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                        {p.supplierName}
                      </td>

                      {/* Qty bought */}
                      <td className="px-6 py-4 text-center text-slate-600 font-semibold text-xs">
                        {p.quantity} pcs
                      </td>

                      {/* Weight bought */}
                      <td className="px-6 py-4 text-center font-bold text-slate-700 text-xs">
                        {p.totalWeight.toFixed(2)} g
                      </td>

                      {/* Silver rate */}
                      <td className="px-6 py-4 text-center text-slate-500 font-medium text-xs">
                        ₹{p.silverRate}/g
                        <span className="block text-[9px] text-slate-400 font-semibold">
                          Purity {p.purity === 925 ? "92.5%" : `${p.purity/10}%`}
                        </span>
                      </td>

                      {/* Cost */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-rose-600 text-xs">
                          ₹{p.cost.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">

                          {/* Print Bill */}
                          <button
                            onClick={() => {
                              setSelectedPurchase(p);
                              setIsBillOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Bill Voucher
                          </button>

                          {/* Delete/Deduct */}
                          <button
                            onClick={() => {
                              setSelectedPurchase(p);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Cancel Purchase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <span className="text-base font-semibold">No purchase records found matching the filters</span>
              <p className="text-xs text-slate-400 mt-1">Try expanding the date range filter above</p>
            </div>
          )}
        </div>

        {/* Directory Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Displaying {filteredPurchases.length} of {purchaseRecords.length} registered restock logs</span>
          <span>Automatic stock incrementing and expense logging synced</span>
        </div>

      </div>

      {/* --- RECORD NEW PURCHASE MODAL --- */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Record Wholesale Batch Restock Bill</h3>
              </div>
              <button
                onClick={() => setIsRecordOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleRecordPurchaseSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

              {/* Date & Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Bill Date *</label>
                  <input
                    type="date"
                    value={purchaseForm.date}
                    onChange={(e) => setPurchaseForm(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.date ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.date && <span className="text-xs font-semibold text-rose-500">{formErrors.date}</span>}
                </div>

                {/* Supplier Vendor */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Supplier Vendor *</label>
                  <input
                    type="text"
                    value={purchaseForm.supplierName}
                    onChange={(e) => setPurchaseForm(prev => ({ ...prev, supplierName: e.target.value }))}
                    placeholder="e.g. Apex Silver Refinery"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.supplierName ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.supplierName && <span className="text-xs font-semibold text-rose-500">{formErrors.supplierName}</span>}
                </div>

              </div>

              {/* Design SKU Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Select Catalog Jewelry SKU *</label>
                <select
                  value={purchaseForm.sku}
                  onChange={handleSKUChange}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none text-sm font-semibold bg-white ${
                    formErrors.sku ? "border-rose-400" : "border-slate-200"
                  }`}
                >
                  <option value="">-- Select Design from Warehouse Inventory --</option>
                  {inventory.map(item => (
                    <option key={item.sku} value={item.sku}>
                      {item.sku} - {item.name} (Stock: {item.stocks} pcs, Weight: {item.weight}g)
                    </option>
                  ))}
                </select>
                {formErrors.sku && <span className="text-xs font-semibold text-rose-500">{formErrors.sku}</span>}
              </div>

              {/* Design Attributes Details Panel */}
              {selectedDesign && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Design Weight / piece</span>
                    <span className="text-slate-700 font-bold block text-sm">{selectedDesign.weight} g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Silver purity grade</span>
                    <span className="text-slate-700 font-bold block text-sm">
                      {selectedDesign.purity === 925 ? "925 Sterling (92.5%)" : `${selectedDesign.purity} Fine`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Making charges structure</span>
                    <span className="text-slate-700 font-bold block text-sm">
                      {selectedDesign.makingChargeType === "PER_GRAM" ? `₹${selectedDesign.makingCharge} / gram` : `₹${selectedDesign.makingCharge} flat per piece`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Metal Polish / Finish</span>
                    <span className="text-slate-700 font-bold block text-sm">{selectedDesign.finish}</span>
                  </div>
                </div>
              )}

              {/* Qty & Applied Silver Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Qty to purchase */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Pieces Quantity to Buy *</label>
                  <input
                    type="number"
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter piece count"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.quantity ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.quantity && <span className="text-xs font-semibold text-rose-500">{formErrors.quantity}</span>}
                </div>

                {/* Silver Rate applied */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Purchase Silver Rate (₹/g) *</label>
                  <input
                    type="number"
                    step={0.1}
                    value={purchaseForm.appliedRate}
                    onChange={(e) => setPurchaseForm(prev => ({ ...prev, appliedRate: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.appliedRate ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.appliedRate && <span className="text-xs font-semibold text-rose-500">{formErrors.appliedRate}</span>}
                </div>

              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Payment Channel</label>
                <select
                  value={purchaseForm.paymentMethod}
                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-sm font-semibold bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Cost Calculations previews */}
              {selectedDesign && purchaseForm.quantity && purchaseForm.appliedRate && (
                <div className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Total Net Weight:</span>
                    <strong className="text-slate-800">{(selectedDesign.weight * parseInt(purchaseForm.quantity)).toFixed(2)} g</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Dynamic Metal value:</span>
                    <span className="text-slate-800 font-semibold">
                      ₹{getCalculatedPurchase(selectedDesign, parseFloat(purchaseForm.appliedRate), parseInt(purchaseForm.quantity)).silverCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Making charges value:</span>
                    <span className="text-slate-800 font-semibold">
                      ₹{getCalculatedPurchase(selectedDesign, parseFloat(purchaseForm.appliedRate), parseInt(purchaseForm.quantity)).makingCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium border-b border-indigo-100/50 pb-1.5">
                    <span>Purchase GST Tax (3%):</span>
                    <span className="text-slate-800 font-semibold">
                      ₹{getCalculatedPurchase(selectedDesign, parseFloat(purchaseForm.appliedRate), parseInt(purchaseForm.quantity)).gst.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-sm text-indigo-700 pt-0.5">
                    <span>Total Net Restock Cost:</span>
                    <strong className="text-indigo-700 font-black">
                      ₹{getCalculatedPurchase(selectedDesign, parseFloat(purchaseForm.appliedRate), parseInt(purchaseForm.quantity)).netTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              )}

              {/* Modal Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Post Restock Bill
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL (Deduct check) --- */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">

            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Cancel & Revert Purchase Bill?</h3>
            </div>

            <p className="text-sm text-slate-500">
              Are you sure you want to cancel Bill <strong>{selectedPurchase?.billCode}</strong>?
              <br />
              <span className="block text-[11px] text-indigo-600 font-bold mt-2">
                * Restocked stocks of {selectedPurchase?.quantity} pieces of {selectedPurchase?.sku} will be deducted from the inventory catalog.
              </span>
              <span className="block text-[11px] text-rose-600 font-bold mt-1">
                * The ₹{selectedPurchase?.cost.toLocaleString("en-IN")} Outflow record will be deleted from the Finance ledger.
              </span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl cursor-pointer"
              >
                No, Keep Bill
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                Yes, Revert Bill
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- SLIDE OUT DRAWER / BILL VOUCHER VIEW --- */}
      {isBillOpen && selectedPurchase && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">

          {/* Backdrop closer clicker */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setIsBillOpen(false)}
          />

          {/* Drawer Panel Container */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">Wholesale Restock Bill</h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Purchase Voucher Slip</span>
              </div>
              <button
                onClick={() => setIsBillOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Bill Voucher) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Receipt Visual design */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 space-y-5 relative">

                {/* Store Name header */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <h4 className="font-extrabold text-slate-800 tracking-tight text-base">SILVER JEWELLERY ERP</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Wholesale restock bill</span>
                  <div className="mt-3 flex justify-center">
                    <span className="px-3 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full border border-blue-200 uppercase tracking-wider">
                      {selectedPurchase.billCode}
                    </span>
                  </div>
                </div>

                {/* Amount display */}
                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Bill Net Total</span>
                  <strong className="text-3xl font-black block tracking-tight text-rose-600">
                    ₹{selectedPurchase.cost.toLocaleString("en-IN")}
                  </strong>
                </div>

                {/* Voucher details fields */}
                <div className="space-y-3.5 text-xs border-t border-slate-200 pt-4">

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Supplier Vendor</span>
                    <span className="text-slate-800 font-bold text-sm">{selectedPurchase.supplierName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Bill Date</span>
                    <span className="text-slate-700 font-semibold">{selectedPurchase.date}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Jewelry SKU</span>
                    <span className="text-slate-700 font-mono font-bold">{selectedPurchase.sku}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Product Name</span>
                    <span className="text-slate-700 font-semibold text-right max-w-[200px] truncate">{selectedPurchase.productName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Purity Stamp</span>
                    <span className="text-slate-700 font-bold">
                      {selectedPurchase.purity === 925 ? "925 Sterling (92.5%)" : `${selectedPurchase.purity/10}% Fine`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Quantity restocked</span>
                    <span className="text-slate-700 font-bold">{selectedPurchase.quantity} pieces</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Net Weight bought</span>
                    <span className="text-slate-700 font-bold">{selectedPurchase.totalWeight.toFixed(2)} grams</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Silver Metal rate</span>
                    <span className="text-slate-700">₹{selectedPurchase.silverRate} / gram</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Making Charges</span>
                    <span className="text-slate-700 font-semibold">
                      {selectedPurchase.makingChargeType === "PER_GRAM" ? `₹${selectedPurchase.makingCharge}/g` : `₹${selectedPurchase.makingCharge} flat`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200/50 pt-2 text-[10px] text-slate-500 font-medium">
                    <span>Tax Structure:</span>
                    <span>3% Wholeseller GST Stamp Included</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Payment channel</span>
                    <span className="text-slate-700 font-bold flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {selectedPurchase.paymentMethod}
                    </span>
                  </div>

                </div>

                {/* Footer seal */}
                <div className="text-center pt-2 text-[9px] text-slate-400 font-medium">
                  Verified Raw Material Intake Confirmation
                </div>

              </div>

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Bill
              </button>

              <button
                type="button"
                onClick={() => setIsBillOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Bill
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Purchases;