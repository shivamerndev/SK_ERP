import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Upload,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  AlertCircle,
  Filter,
  FileText,
  ChevronDown,
  Scale,
  Sparkles,
  ShoppingCart,
  UserCheck,
  Printer
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  ComposedChart,
  Area
} from "recharts";

// ----------------------------------------------------
// DEFAULT SALES RECORDS (Spanning June & July 2026)
// ----------------------------------------------------
const INITIAL_SALES = [
  {
    id: "sale-1",
    invoiceCode: "INV-2026-101",
    date: "2026-06-15",
    sku: "SLV-RG-002",
    productName: "Oxidized Floral Band Ring",
    category: "Rings",
    customerName: "Sharma Ornaments",
    quantity: 30,
    weightPerPiece: 6.8,
    totalWeight: 204.0, // 30 * 6.8
    silverRate: 82.0, // ₹82 / gram
    makingChargeType: "PER_GRAM",
    makingCharge: 15, // ₹15 / gram
    purity: 925,
    revenue: 19088, // Math.round((204 * 82 * 0.925 + 204 * 15) * 1.03)
    paymentMethod: "UPI"
  },
  {
    id: "sale-2",
    invoiceCode: "INV-2026-102",
    date: "2026-06-28",
    sku: "SLV-PY-001",
    productName: "Sterling Bridal Payal (Anklet)",
    category: "Anklets",
    customerName: "Royal Jewellers",
    quantity: 10,
    weightPerPiece: 42.5,
    totalWeight: 425.0,
    silverRate: 83.0,
    makingChargeType: "PER_GRAM",
    makingCharge: 12,
    purity: 925,
    revenue: 38861,
    paymentMethod: "Bank Transfer"
  },
  {
    id: "sale-3",
    invoiceCode: "INV-2026-103",
    date: "2026-07-02",
    sku: "SLV-KD-003",
    productName: "Classic Rajasthani Kada (Bracelet)",
    category: "Bracelets",
    customerName: "Vikas Silver Art",
    quantity: 15,
    weightPerPiece: 35.0,
    totalWeight: 525.0,
    silverRate: 84.0,
    makingChargeType: "PER_GRAM",
    makingCharge: 10,
    purity: 925,
    revenue: 47424,
    paymentMethod: "UPI"
  },
  {
    id: "sale-4",
    invoiceCode: "INV-2026-104",
    date: "2026-07-10",
    sku: "SLV-CH-004",
    productName: "Unisex Curb Link Chain",
    category: "Chains",
    customerName: "Sharma Ornaments",
    quantity: 40,
    weightPerPiece: 18.2,
    totalWeight: 728.0,
    silverRate: 85.0,
    makingChargeType: "PER_GRAM",
    makingCharge: 8,
    purity: 925,
    revenue: 64957,
    paymentMethod: "Bank Transfer"
  },
  {
    id: "sale-5",
    invoiceCode: "INV-2026-105",
    date: "2026-07-15",
    sku: "SLV-TR-005",
    productName: "Traditional Adjustable Bichhiya (Toe Rings)",
    category: "Toe Rings",
    customerName: "Gupta & Sons Wholesalers",
    quantity: 100,
    weightPerPiece: 4.5,
    totalWeight: 450.0,
    silverRate: 85.0,
    makingChargeType: "FLAT_PIECE",
    makingCharge: 40,
    purity: 900,
    revenue: 39578,
    paymentMethod: "Cash"
  },
  {
    id: "sale-6",
    invoiceCode: "INV-2026-006",
    date: "2026-07-22",
    sku: "SLV-ER-006",
    productName: "Sterling Filigree Jhumkas",
    category: "Earrings",
    customerName: "Vikas Silver Art",
    quantity: 4,
    weightPerPiece: 12.4,
    totalWeight: 49.6,
    silverRate: 86.0,
    makingChargeType: "FLAT_PIECE",
    makingCharge: 250,
    purity: 925,
    revenue: 5094,
    paymentMethod: "UPI"
  }
];

const Sales = () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [salesRecords, setSalesRecords] = useState(() => {
    const saved = localStorage.getItem("erp_sales_records");
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("erp_silver_inventory");
    return saved ? JSON.parse(saved) : [];
  });

  // Daily silver rate for pricing direct calculations
  const [silverRate, setSilverRate] = useState(() => {
    const rate = localStorage.getItem("erp_live_silver_rate");
    return rate ? parseFloat(rate) : 85.0;
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateRangePreset, setDateRangePreset] = useState("All"); // All, Today, Yesterday, ThisWeek, ThisMonth, Last30, Custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [sortBy, setSortBy] = useState("date"); // date, weight, revenue
  const [sortOrder, setSortOrder] = useState("desc");

  const [showCharts, setShowCharts] = useState(true);

  // Modals & Panels
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Record Sale Form state
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().split("T")[0],
    sku: "",
    clientName: "",
    quantity: "",
    appliedRate: "",
    paymentMethod: "UPI"
  });

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [formErrors, setFormErrors] = useState({});



  // ----------------------------------------------------
  // PERSISTENCE EFFECTS
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_sales_records", JSON.stringify(salesRecords));
  }, [salesRecords]);

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

  // TOAST HANDLER using react-hot-toast
  const triggerToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  // ----------------------------------------------------
  // INVOICE CALCULATOR
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

  const getCalculatedSale = (item, rate, qty) => {
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
  const filteredSales = useMemo(() => {
    let result = [...salesRecords];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        s =>
          s.invoiceCode.toLowerCase().includes(q) ||
          s.sku.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter(s => s.category === categoryFilter);
    }

    // Payment Filter
    if (paymentFilter !== "All") {
      result = result.filter(s => s.paymentMethod === paymentFilter);
    }

    // Date range preset filter
    if (dateRangePreset !== "All") {
      const todayStr = new Date().toISOString().split("T")[0];
      const today = new Date(todayStr);

      result = result.filter(s => {
        const sDate = new Date(s.date);

        if (dateRangePreset === "Today") {
          return s.date === todayStr;
        }
        if (dateRangePreset === "Yesterday") {
          const yest = new Date(today);
          yest.setDate(today.getDate() - 1);
          const yestStr = yest.toISOString().split("T")[0];
          return s.date === yestStr;
        }
        if (dateRangePreset === "ThisWeek") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          return sDate >= sevenDaysAgo && sDate <= today;
        }
        if (dateRangePreset === "ThisMonth") {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return sDate >= startOfMonth && sDate <= today;
        }
        if (dateRangePreset === "Custom") {
          if (customStartDate && customEndDate) {
            return s.date >= customStartDate && s.date <= customEndDate;
          }
          if (customStartDate) {
            return s.date >= customStartDate;
          }
          if (customEndDate) {
            return s.date <= customEndDate;
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
          return sortOrder === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue;
        }
      } else if (sortBy === "weight") {
        valA = a.totalWeight;
        valB = b.totalWeight;
      } else if (sortBy === "revenue") {
        valA = a.revenue;
        valB = b.revenue;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [salesRecords, searchQuery, categoryFilter, paymentFilter, dateRangePreset, customStartDate, customEndDate, sortBy, sortOrder]);

  // ----------------------------------------------------
  // CALCULATE KPI SUMMARIES
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let rev = 0;
    let weight = 0;
    let pieces = 0;

    filteredSales.forEach(s => {
      rev += Number(s.revenue || 0);
      weight += Number(s.totalWeight || 0);
      pieces += Number(s.quantity || 0);
    });

    const valPerGram = weight ? Math.round(rev / weight) : 0;

    return {
      totalRevenue: rev,
      totalWeight: weight,
      totalPieces: pieces,
      valPerGram
    };
  }, [filteredSales]);

  // ----------------------------------------------------
  // WEEKLY & MONTHLY PERFORMANCE COMPARISONS
  // ----------------------------------------------------
  const comparisons = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);

    // Ranges
    // Weeks
    const w1Start = new Date();
    w1Start.setDate(today.getDate() - 7);
    const w2Start = new Date();
    w2Start.setDate(today.getDate() - 14);

    let thisWeekRev = 0;
    let thisWeekWeight = 0;
    let lastWeekRev = 0;
    let lastWeekWeight = 0;

    // Months
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    let thisMonthRev = 0;
    let thisMonthWeight = 0;
    let lastMonthRev = 0;
    let lastMonthWeight = 0;

    salesRecords.forEach(s => {
      const sDate = new Date(s.date);
      const rev = Number(s.revenue || 0);
      const weight = Number(s.totalWeight || 0);

      // Week stats check
      if (sDate >= w1Start && sDate <= today) {
        thisWeekRev += rev;
        thisWeekWeight += weight;
      } else if (sDate >= w2Start && sDate < w1Start) {
        lastWeekRev += rev;
        lastWeekWeight += weight;
      }

      // Month stats check
      if (sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth) {
        thisMonthRev += rev;
        thisMonthWeight += weight;
      } else if (
        (currentMonth === 0 && sDate.getFullYear() === currentYear - 1 && sDate.getMonth() === 11) ||
        (currentMonth > 0 && sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth - 1)
      ) {
        lastMonthRev += rev;
        lastMonthWeight += weight;
      }
    });

    const calcChange = (current, previous) => {
      if (!previous) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      week: {
        rev: thisWeekRev,
        weight: thisWeekWeight,
        revChange: calcChange(thisWeekRev, lastWeekRev),
        weightChange: calcChange(thisWeekWeight, lastWeekWeight),
        lastRev: lastWeekRev,
        lastWeight: lastWeekWeight
      },
      month: {
        rev: thisMonthRev,
        weight: thisMonthWeight,
        revChange: calcChange(thisMonthRev, lastMonthRev),
        weightChange: calcChange(thisMonthWeight, lastMonthWeight),
        lastRev: lastMonthRev,
        lastWeight: lastMonthWeight
      }
    };
  }, [salesRecords]);

  // ----------------------------------------------------
  // CHART DATA PREPARATIONS
  // ----------------------------------------------------
  const chartData = useMemo(() => {
    // 1. Dual-Axis Sales Trend (Datewise Revenue & Weight)
    const dateMap = {};
    filteredSales.forEach(s => {
      if (!dateMap[s.date]) {
        dateMap[s.date] = { date: s.date, Revenue: 0, "Weight (g)": 0 };
      }
      dateMap[s.date].Revenue += s.revenue;
      dateMap[s.date]["Weight (g)"] += s.totalWeight;
    });

    const dailyTrendData = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-15); // Show last 15 days of activity

    // 2. Category Weight & Revenue
    const catMap = {};
    filteredSales.forEach(s => {
      if (!catMap[s.category]) {
        catMap[s.category] = { name: s.category, Revenue: 0, "Weight (g)": 0 };
      }
      catMap[s.category].Revenue += s.revenue;
      catMap[s.category]["Weight (g)"] += Math.round(s.totalWeight);
    });

    const categorySalesData = Object.values(catMap);

    // 3. Top SKUs by Revenue
    const skuMap = {};
    filteredSales.forEach(s => {
      if (!skuMap[s.sku]) {
        skuMap[s.sku] = { sku: s.sku, name: s.productName, Revenue: 0, "Weight (g)": 0 };
      }
      skuMap[s.sku].Revenue += s.revenue;
      skuMap[s.sku]["Weight (g)"] += Math.round(s.totalWeight);
    });

    const topSKUsData = Object.values(skuMap)
      .sort((a, b) => b.Revenue - a.Revenue)
      .slice(0, 5);

    return { dailyTrendData, categorySalesData, topSKUsData };
  }, [filteredSales]);

  // ----------------------------------------------------
  // SELECT SKU FOR FORM
  // ----------------------------------------------------
  const handleSKUChange = (e) => {
    const skuCode = e.target.value;
    const item = inventory.find(d => d.sku === skuCode);
    
    setSelectedDesign(item || null);
    setSaleForm(prev => ({
      ...prev,
      sku: skuCode,
      appliedRate: item ? silverRate : ""
    }));
  };

  // ----------------------------------------------------
  // SUBMIT RECORD NEW SALE (Integrated multi-page operations)
  // ----------------------------------------------------
  const handleRecordSaleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const qty = parseInt(saleForm.quantity);
    const rate = parseFloat(saleForm.appliedRate);

    if (!saleForm.date) errors.date = "Date is required";
    if (!saleForm.sku) errors.sku = "Select a design SKU from catalog";
    if (!saleForm.clientName.trim()) errors.clientName = "Client retailer name is required";
    
    if (isNaN(qty) || qty <= 0) {
      errors.quantity = "Enter a positive piece quantity";
    } else if (selectedDesign && qty > selectedDesign.stocks) {
      errors.quantity = `Low wholesale stock! Only ${selectedDesign.stocks} pcs available.`;
    }

    if (isNaN(rate) || rate <= 0) errors.appliedRate = "Enter a valid silver rate";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Calculations
    const calcs = getCalculatedSale(selectedDesign, rate, qty);

    // 1. DEDUCT STOCK IN INVENTORY
    const updatedInv = inventory.map(item => {
      if (item.id === selectedDesign.id) {
        return {
          ...item,
          stocks: Math.max(0, item.stocks - qty)
        };
      }
      return item;
    });
    localStorage.setItem("erp_silver_inventory", JSON.stringify(updatedInv));
    setInventory(updatedInv);

    // 2. LOG CASH INFLOW IN FINANCE LEDGER
    const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
    const financeTx = {
      id: "gen-" + Date.now(),
      date: saleForm.date,
      type: "INFLOW",
      category: "Direct Sales",
      amount: calcs.netTotal,
      paymentMethod: saleForm.paymentMethod,
      description: `Wholesale Sale: ${qty}x ${selectedDesign.name} (${selectedDesign.sku}) to ${saleForm.clientName.trim()}`
    };
    localStorage.setItem("erp_general_transactions", JSON.stringify([financeTx, ...financeLedger]));

    // 3. CREATE SALES RECORD
    const newSale = {
      id: "sale-" + Date.now(),
      invoiceCode: "INV-2026-" + Math.floor(Math.random() * 9000 + 1000),
      date: saleForm.date,
      sku: selectedDesign.sku,
      productName: selectedDesign.name,
      category: selectedDesign.category,
      customerName: saleForm.clientName.trim(),
      quantity: qty,
      weightPerPiece: selectedDesign.weight,
      totalWeight: calcs.weight,
      silverRate: rate,
      makingChargeType: selectedDesign.makingChargeType,
      makingCharge: selectedDesign.makingCharge,
      purity: selectedDesign.purity,
      revenue: calcs.netTotal,
      paymentMethod: saleForm.paymentMethod
    };

    setSalesRecords(prev => [newSale, ...prev]);
    setIsRecordOpen(false);
    
    // Reset Form
    setSaleForm({
      date: new Date().toISOString().split("T")[0],
      sku: "",
      clientName: "",
      quantity: "",
      appliedRate: "",
      paymentMethod: "UPI"
    });
    setSelectedDesign(null);
    setFormErrors({});
    triggerToast(`Invoice ${newSale.invoiceCode} recorded! Stock decremented & cash flow updated.`);
  };

  // ----------------------------------------------------
  // DELETE SALE (Refund entries)
  // ----------------------------------------------------
  const handleDeleteConfirm = () => {
    if (!selectedSale) return;
    
    // Refund: put stock back in inventory (optional but helpful ERP check)
    const updatedInv = inventory.map(item => {
      if (item.sku === selectedSale.sku) {
        return {
          ...item,
          stocks: item.stocks + selectedSale.quantity
        };
      }
      return item;
    });
    localStorage.setItem("erp_silver_inventory", JSON.stringify(updatedInv));
    setInventory(updatedInv);

    // Remove cash flow transaction from Finance ledger
    const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
    const updatedFinance = financeLedger.filter(tx => {
      // Find direct sale matches by invoice details
      const matchText = `INV-2026-${selectedSale.invoiceCode.split("-")[2]}`;
      return !tx.description.includes(matchText) && tx.amount !== selectedSale.revenue;
    });
    localStorage.setItem("erp_general_transactions", JSON.stringify(updatedFinance));

    // Delete sales record
    setSalesRecords(prev => prev.filter(s => s.id !== selectedSale.id));
    setIsDeleteConfirmOpen(false);
    triggerToast(`Invoice ${selectedSale.invoiceCode} cancelled. Stock refunded & finance reverted.`);
    setSelectedSale(null);
  };

  // ----------------------------------------------------
  // EXPORT SALES CSV
  // ----------------------------------------------------
  const handleExportCSV = () => {
    try {
      let csv = "data:text/csv;charset=utf-8,";
      csv += "Invoice Code,Date,SKU,Product Name,Category,Buyer Client,Quantity,Weight per piece(g),Total Net Weight(g),Applied Silver Rate,Valuation(INR),Payment Method\r\n";

      filteredSales.forEach(s => {
        const row = [
          s.invoiceCode,
          s.date,
          s.sku,
          `"${s.productName}"`,
          s.category,
          `"${s.customerName}"`,
          s.quantity,
          s.weightPerPiece,
          s.totalWeight,
          s.silverRate,
          s.revenue,
          s.paymentMethod
        ];
        csv += row.join(",") + "\r\n";
      });

      const encoded = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encoded);
      link.setAttribute("download", `silver_wholesale_sales_report_${new Date().toISOString().split("T")[0]}.csv`);
      link.click();
      triggerToast("CSV sales statement exported!");
    } catch (e) {
      triggerToast("Export failed.", "error");
    }
  };

  return (
    <div className="space-y-6">



      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">Wholesale Sales Ledger & Analytics</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Analyze daily wholesale sales revenue spikes against net silver weights, evaluate buyer accounts, and generate invoices.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Record Sale */}
          <button
            onClick={() => {
              if (inventory.length === 0) {
                triggerToast("Inventory is empty! Add design SKUs first on the Inventory page.", "error");
                return;
              }
              setSaleForm({
                date: new Date().toISOString().split("T")[0],
                sku: "",
                clientName: "",
                quantity: "",
                appliedRate: silverRate,
                paymentMethod: "UPI"
              });
              setSelectedDesign(null);
              setFormErrors({});
              setIsRecordOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Record Invoice Sale
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            title="Download CSV sales ledger"
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
            <h3 className="text-sm font-bold text-slate-800">Date Range filter (Revenue & Weight calculations)</h3>
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
            { label: "All Sales Logs", val: "All" },
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
        
        {/* KPI 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Wholesale Revenue</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Net revenue value (3% GST inc)</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Weight sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Net Silver Weight</span>
            <h3 className="text-2xl font-extrabold text-slate-800">
              {(stats.totalWeight / 1000).toFixed(2)} kg
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold">{stats.totalWeight.toLocaleString("en-IN")} grams sold</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Scale className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: Units sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Units Sold (Volume)</span>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.totalPieces}</h3>
            <p className="text-[10px] text-slate-400">Total jewelry pieces dispatched</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShoppingCart className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Valuation per gram */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Valuation per Gram</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.valPerGram}/g</h3>
            <p className="text-[10px] text-emerald-600 font-bold">Average wholesale rate earned</p>
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
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Weekly Performance Comparison</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">7d vs Prev 7d</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Revenue</span>
              <strong className="text-base text-slate-800">₹{comparisons.week.rev.toLocaleString("en-IN")}</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.week.revChange >= 0 ? (
                  <span className="text-emerald-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.week.revChange}%</span>
                ) : (
                  <span className="text-rose-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.week.revChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs ₹{comparisons.week.lastRev.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Silver Weight Sold</span>
              <strong className="text-base text-slate-800">{comparisons.week.weight.toLocaleString("en-IN")} g</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.week.weightChange >= 0 ? (
                  <span className="text-emerald-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.week.weightChange}%</span>
                ) : (
                  <span className="text-rose-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.week.weightChange}%</span>
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
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Monthly Performance Comparison</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">This Month vs Prev Month</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Revenue</span>
              <strong className="text-base text-slate-800">₹{comparisons.month.rev.toLocaleString("en-IN")}</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.month.revChange >= 0 ? (
                  <span className="text-emerald-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.month.revChange}%</span>
                ) : (
                  <span className="text-rose-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.month.revChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs ₹{comparisons.month.lastRev.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Silver Weight Sold</span>
              <strong className="text-base text-slate-800">{comparisons.month.weight.toLocaleString("en-IN")} g</strong>
              <div className="flex items-center gap-1 mt-1 font-bold">
                {comparisons.month.weightChange >= 0 ? (
                  <span className="text-emerald-600 flex items-center"><TrendingUp className="w-3.5 h-3.5" /> +{comparisons.month.weightChange}%</span>
                ) : (
                  <span className="text-rose-600 flex items-center"><TrendingDown className="w-3.5 h-3.5" /> {comparisons.month.weightChange}%</span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">vs {comparisons.month.lastWeight.toLocaleString("en-IN")}g</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sales Trend Analysis Graphs Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Visual Sales Trend Analysis (Weight vs. Revenue)</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{showCharts ? "Hide Charts" : "Show Charts"}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCharts ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showCharts && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Chart 1: Dual-Axis Revenue vs Net Weight trend */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 lg:col-span-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Daily Sales Revenue (INR) vs. Net Silver Weight Sold (Grams)</h4>
              <div className="h-72">
                {chartData.dailyTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.dailyTrendData} margin={{ left: -10, right: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis yAxisId="left" label={{ value: "Revenue (₹)", angle: -90, position: "insideLeft", fontSize: 10, fill: "#6366f1" }} tick={{ fill: "#6366f1", fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: "Weight (grams)", angle: 90, position: "insideRight", fontSize: 10, fill: "#10b981" }} tick={{ fill: "#10b981", fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area yAxisId="left" type="monotone" name="Revenue (₹)" dataKey="Revenue" fill="url(#colorRevenue)" stroke="#6366f1" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" name="Net Weight (g)" dataKey="Weight (g)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">No transaction dates.</div>
                )}
              </div>
            </div>

            {/* Chart 2: Category distribution (Revenue & Weight) */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Product Category Performance</h4>
                <div className="h-56">
                  {chartData.categorySalesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.categorySalesData} margin={{ left: -15, right: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="Revenue" name="Revenue (₹)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Weight (g)" name="Weight (g)" fill="#10b981" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-xs text-center pt-12">No category sales.</div>
                  )}
                </div>
              </div>
              <div className="max-h-24 overflow-y-auto text-[10px] space-y-1.5 border-t border-slate-200/50 pt-2.5">
                {chartData.categorySalesData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between font-semibold">
                    <span className="text-slate-600 truncate">{d.name} Category:</span>
                    <span className="text-slate-700">₹{d.Revenue.toLocaleString("en-IN")} ({d["Weight (g)"]}g)</span>
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
                placeholder="Search by invoice, SKU, product, or buyer..."
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
                <option value="date">Invoice Date</option>
                <option value="weight">Net Weight Sold</option>
                <option value="revenue">Invoice Revenue</option>
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
          {filteredSales.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date & Invoice</th>
                  <th className="px-6 py-4">SKU & Product Name</th>
                  <th className="px-6 py-4">Retailer Buyer</th>
                  <th className="px-6 py-4 text-center">Quantity (pcs)</th>
                  <th className="px-6 py-4 text-center">Net Weight (g)</th>
                  <th className="px-6 py-4 text-center">applied Silver Rate</th>
                  <th className="px-6 py-4 text-right">Invoice Revenue</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSales.map((s) => {
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Date & Invoice */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-xs">{s.invoiceCode}</span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {s.date}
                          </span>
                        </div>
                      </td>

                      {/* SKU & Product name */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono font-bold text-xs text-slate-700">{s.sku}</span>
                          <span className="text-slate-500 font-medium text-[11px] truncate mt-0.5">{s.productName}</span>
                        </div>
                      </td>

                      {/* Buyer client */}
                      <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                        {s.customerName}
                      </td>

                      {/* Qty sold */}
                      <td className="px-6 py-4 text-center text-slate-600 font-semibold text-xs">
                        {s.quantity} pcs
                      </td>

                      {/* Weight sold */}
                      <td className="px-6 py-4 text-center font-bold text-slate-700 text-xs">
                        {s.totalWeight.toFixed(2)} g
                      </td>

                      {/* Silver rate */}
                      <td className="px-6 py-4 text-center text-slate-500 font-medium text-xs">
                        ₹{s.silverRate}/g
                        <span className="block text-[9px] text-slate-400 font-semibold">
                          Purity {s.purity === 925 ? "92.5%" : `${s.purity/10}%`}
                        </span>
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-emerald-600 text-xs">
                          ₹{s.revenue.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Print Invoice */}
                          <button
                            onClick={() => {
                              setSelectedSale(s);
                              setIsInvoiceOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Invoice
                          </button>

                          {/* Delete/Refund */}
                          <button
                            onClick={() => {
                              setSelectedSale(s);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Refund Sale"
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
              <span className="text-base font-semibold">No sales records found matching the filters</span>
              <p className="text-xs text-slate-400 mt-1">Try expanding the date range filter above</p>
            </div>
          )}
        </div>

        {/* Directory Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Displaying {filteredSales.length} of {salesRecords.length} registered invoice records</span>
          <span>Automatic stock decrementing and cash flow logging synced</span>
        </div>

      </div>

      {/* --- RECORD NEW SALE MODAL --- */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Record Wholesale Jewelry Invoice</h3>
              </div>
              <button 
                onClick={() => setIsRecordOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleRecordSaleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Date & Customer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Invoice Date *</label>
                  <input
                    type="date"
                    value={saleForm.date}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.date ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.date && <span className="text-xs font-semibold text-rose-500">{formErrors.date}</span>}
                </div>

                {/* Retailer Buyer */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Retailer Buyer Store *</label>
                  <input
                    type="text"
                    value={saleForm.clientName}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="e.g. Sharma Jewellers"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.clientName ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.clientName && <span className="text-xs font-semibold text-rose-500">{formErrors.clientName}</span>}
                </div>

              </div>

              {/* Design SKU Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Select Catalog Jewelry SKU *</label>
                <select
                  value={saleForm.sku}
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
                
                {/* Qty to sell */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Pieces Quantity to Sell *</label>
                  <input
                    type="number"
                    value={saleForm.quantity}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter piece count"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      formErrors.quantity ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {formErrors.quantity && <span className="text-xs font-semibold text-rose-500">{formErrors.quantity}</span>}
                </div>

                {/* Silver Rate applied */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Applied Silver Rate (₹/g) *</label>
                  <input
                    type="number"
                    step={0.1}
                    value={saleForm.appliedRate}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, appliedRate: e.target.value }))}
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
                  value={saleForm.paymentMethod}
                  onChange={(e) => setSaleForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-sm font-semibold bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Price Calculations previews */}
              {selectedDesign && saleForm.quantity && saleForm.appliedRate && (
                <div className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Total Net Weight:</span>
                    <strong className="text-slate-800">{(selectedDesign.weight * parseInt(saleForm.quantity)).toFixed(2)} g</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Dynamic Metal value:</span>
                    <span className="text-slate-800 font-semibold">
                      ₹{getCalculatedSale(selectedDesign, parseFloat(saleForm.appliedRate), parseInt(saleForm.quantity)).silverCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Making charges value:</span>
                    <span className="text-slate-800 font-semibold">
                      ₹{getCalculatedSale(selectedDesign, parseFloat(saleForm.appliedRate), parseInt(saleForm.quantity)).makingCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium border-b border-indigo-100/50 pb-1.5">
                    <span>Wholesale GST Tax (3%):</span>
                    <span className="text-slate-800 font-semibold">
                      ₹{getCalculatedSale(selectedDesign, parseFloat(saleForm.appliedRate), parseInt(saleForm.quantity)).gst.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-sm text-indigo-700 pt-0.5">
                    <span>Total Net Invoice Price:</span>
                    <strong className="text-indigo-700 font-black">
                      ₹{getCalculatedSale(selectedDesign, parseFloat(saleForm.appliedRate), parseInt(saleForm.quantity)).netTotal.toLocaleString("en-IN")}
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
                  Post Invoice
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL (Refund check) --- */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Cancel & Refund Wholesale Invoice?</h3>
            </div>
            
            <p className="text-sm text-slate-500">
              Are you sure you want to cancel Invoice <strong>{selectedSale?.invoiceCode}</strong>? 
              <br />
              <span className="block text-[11px] text-indigo-600 font-bold mt-2">
                * Decremented stocks of {selectedSale?.quantity} pieces of {selectedSale?.sku} will be returned to the inventory catalog.
              </span>
              <span className="block text-[11px] text-rose-600 font-bold mt-1">
                * The ₹{selectedSale?.revenue.toLocaleString("en-IN")} Inflow record will be deleted from the Finance ledger.
              </span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl cursor-pointer"
              >
                No, Keep Sale
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                Yes, Refund Invoice
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- SLIDE OUT DRAWER / INVOICE VOUCHER VIEW --- */}
      {isInvoiceOpen && selectedSale && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          
          {/* Backdrop closer clicker */}
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setIsInvoiceOpen(false)} 
          />

          {/* Drawer Panel Container */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">Tax Invoice Statement</h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Wholeseller bill slip</span>
              </div>
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Invoice Voucher) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Receipt Visual design */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 space-y-5 relative">
                
                {/* Store Name header */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <h4 className="font-extrabold text-slate-800 tracking-tight text-base">SILVER JEWELLERY ERP</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Wholesale Tax Invoice</span>
                  <div className="mt-3 flex justify-center">
                    <span className="px-3 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full border border-blue-200 uppercase tracking-wider">
                      {selectedSale.invoiceCode}
                    </span>
                  </div>
                </div>

                {/* Amount display */}
                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Invoice Net Total</span>
                  <strong className="text-3xl font-black block tracking-tight text-emerald-600">
                    ₹{selectedSale.revenue.toLocaleString("en-IN")}
                  </strong>
                </div>

                {/* Voucher details fields */}
                <div className="space-y-3.5 text-xs border-t border-slate-200 pt-4">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Client Retailer</span>
                    <span className="text-slate-800 font-bold text-sm">{selectedSale.customerName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Invoice Date</span>
                    <span className="text-slate-700 font-semibold">{selectedSale.date}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Jewelry SKU</span>
                    <span className="text-slate-700 font-mono font-bold">{selectedSale.sku}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Product Name</span>
                    <span className="text-slate-700 font-semibold text-right max-w-[200px] truncate">{selectedSale.productName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Purity Stamp</span>
                    <span className="text-slate-700 font-bold">
                      {selectedSale.purity === 925 ? "925 Sterling (92.5%)" : `${selectedSale.purity/10}% Fine`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Quantity Dispatched</span>
                    <span className="text-slate-700 font-bold">{selectedSale.quantity} pieces</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Net Weight Sold</span>
                    <span className="text-slate-700 font-bold">{selectedSale.totalWeight.toFixed(2)} grams</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Silver Metal rate</span>
                    <span className="text-slate-700">₹{selectedSale.silverRate} / gram</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Making Charges</span>
                    <span className="text-slate-700 font-semibold">
                      {selectedSale.makingChargeType === "PER_GRAM" ? `₹${selectedSale.makingCharge}/g` : `₹${selectedSale.makingCharge} flat`}
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
                      {selectedSale.paymentMethod}
                    </span>
                  </div>

                </div>

                {/* Footer seal */}
                <div className="text-center pt-2 text-[9px] text-slate-400 font-medium">
                  Thank you for your wholeseller business!
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
                Print Invoice
              </button>

              <button
                type="button"
                onClick={() => setIsInvoiceOpen(false)}
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

export default Sales;