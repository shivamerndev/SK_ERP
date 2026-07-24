import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
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
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Wallet
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar
} from "recharts";

// ----------------------------------------------------
// DEFAULT GENERAL TRANSACTIONS (Realistic Seed Data)
// ----------------------------------------------------
const INITIAL_GENERAL_TRANSACTIONS = [
  {
    id: "gen-1",
    date: "2026-07-01",
    type: "OUTFLOW",
    category: "Inventory Purchase",
    amount: 35000,
    paymentMethod: "Bank Transfer",
    description: "Bulk purchase: Golden Chains & Rings stock"
  },
  {
    id: "gen-2",
    date: "2026-07-02",
    type: "OUTFLOW",
    category: "Shop Rent",
    amount: 15000,
    paymentMethod: "Bank Transfer",
    description: "Paid monthly showroom rent"
  },
  {
    id: "gen-3",
    date: "2026-07-10",
    type: "INFLOW",
    category: "Direct Sales",
    amount: 8500,
    paymentMethod: "Cash",
    description: "Cash counter sales: Silver earrings & rings"
  },
  {
    id: "gen-4",
    date: "2026-07-15",
    type: "INFLOW",
    category: "Direct Sales",
    amount: 12500,
    paymentMethod: "UPI",
    description: "UPI sale: 1x Gold plated jesus necklace"
  },
  {
    id: "gen-5",
    date: "2026-07-18",
    type: "OUTFLOW",
    category: "Utility Bills",
    amount: 4200,
    paymentMethod: "UPI",
    description: "Electricity bill showroom payment"
  },
  {
    id: "gen-6",
    date: "2026-07-20",
    type: "OUTFLOW",
    category: "Salary / Wages",
    amount: 12000,
    paymentMethod: "Bank Transfer",
    description: "Monthly salary paid to staff Amit"
  },
  {
    id: "gen-7",
    date: "2026-07-22",
    type: "OUTFLOW",
    category: "Tea & Refreshments",
    amount: 850,
    paymentMethod: "Cash",
    description: "Tea & snacks monthly account for staff/guests"
  }
];

// Available transaction categories
const CATEGORIES = {
  INFLOW: ["Direct Sales", "Commission", "Other Income"],
  OUTFLOW: [
    "Inventory Purchase",
    "Shop Rent",
    "Utility Bills",
    "Salary / Wages",
    "Tea & Refreshments",
    "Travel & Transport",
    "Maintenance & Repairs",
    "Taxes",
    "Others"
  ]
};

const Finance = () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [generalTransactions, setGeneralTransactions] = useState(() => {
    const saved = localStorage.getItem("erp_general_transactions");
    return saved ? JSON.parse(saved) : INITIAL_GENERAL_TRANSACTIONS;
  });

  const [udhaarCustomers, setUdhaarCustomers] = useState(() => {
    const saved = localStorage.getItem("erp_udhaar_customers");
    return saved ? JSON.parse(saved) : [];
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All"); // All, INFLOW, OUTFLOW
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All"); // All, Cash, UPI, Card, Bank Transfer
  const [dateRangePreset, setDateRangePreset] = useState("All"); // All, Today, Last7, ThisMonth, Custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [sortBy, setSortBy] = useState("date"); // date, amount
  const [sortOrder, setSortOrder] = useState("desc");

  // Panel toggles
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Modals & Drawers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "OUTFLOW",
    category: "Inventory Purchase",
    amount: "",
    paymentMethod: "UPI",
    description: ""
  });

  const [editForm, setEditForm] = useState({
    id: "",
    date: "",
    type: "OUTFLOW",
    category: "",
    amount: "",
    paymentMethod: "UPI",
    description: ""
  });

  // Validation errors
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Toast Notification State
  const [toasts, setToasts] = useState([]);
  
  const fileInputRef = useRef(null);

  // ----------------------------------------------------
  // PERSISTENCE & AUTO SYNC EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_general_transactions", JSON.stringify(generalTransactions));
  }, [generalTransactions]);

  // Keep customer data synchronized from local storage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUdhaar = localStorage.getItem("erp_udhaar_customers");
      if (savedUdhaar) {
        setUdhaarCustomers(JSON.parse(savedUdhaar));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    // Poll localstorage periodically just to make sure they match
    const interval = setInterval(() => {
      handleStorageChange();
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
  // LEDGER STATE CONSOLIDATION
  // ----------------------------------------------------
  const consolidatedTransactions = useMemo(() => {
    // 1. Map general ledger entries
    const generalList = generalTransactions.map(tx => ({
      ...tx,
      isAutoImported: false
    }));

    // 2. Map Udhaar customer payments (PAID transactions represent cash inflows)
    const udhaarList = [];
    udhaarCustomers.forEach(cust => {
      if (cust.transactions) {
        cust.transactions.forEach(tx => {
          if (tx.type === "PAID") {
            udhaarList.push({
              id: tx.id,
              date: tx.date,
              type: "INFLOW",
              category: "Credit Settlement",
              amount: tx.amount,
              paymentMethod: tx.method || "UPI",
              description: `Udhaar Payment received: ${cust.name} (${tx.description})`,
              isAutoImported: true,
              customerName: cust.name,
              customerId: cust.id
            });
          }
        });
      }
    });

    return [...generalList, ...udhaarList];
  }, [generalTransactions, udhaarCustomers]);

  // ----------------------------------------------------
  // STATISTICS CALCULATION
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    let cashInflow = 0;
    let cashOutflow = 0;
    let digitalInflow = 0;
    let digitalOutflow = 0;

    consolidatedTransactions.forEach(tx => {
      const amt = Number(tx.amount || 0);
      if (tx.type === "INFLOW") {
        inflow += amt;
        if (tx.paymentMethod === "Cash") {
          cashInflow += amt;
        } else {
          digitalInflow += amt;
        }
      } else {
        outflow += amt;
        if (tx.paymentMethod === "Cash") {
          cashOutflow += amt;
        } else {
          digitalOutflow += amt;
        }
      }
    });

    return {
      totalInflow: inflow,
      totalOutflow: outflow,
      netFlow: inflow - outflow,
      cashBalance: cashInflow - cashOutflow,
      digitalBalance: digitalInflow - digitalOutflow
    };
  }, [consolidatedTransactions]);

  // ----------------------------------------------------
  // FILTERING & SORTING LEDGER
  // ----------------------------------------------------
  const filteredTransactions = useMemo(() => {
    let result = [...consolidatedTransactions];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        tx =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          (tx.customerName && tx.customerName.toLowerCase().includes(q))
      );
    }

    // Type Filter
    if (typeFilter !== "All") {
      result = result.filter(tx => tx.type === typeFilter);
    }

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter(tx => tx.category === categoryFilter);
    }

    // Method Filter
    if (methodFilter !== "All") {
      result = result.filter(tx => tx.paymentMethod === methodFilter);
    }

    // Date Filters
    if (dateRangePreset !== "All") {
      const todayStr = new Date().toISOString().split("T")[0];
      const today = new Date(todayStr);

      result = result.filter(tx => {
        const txDate = new Date(tx.date);

        if (dateRangePreset === "Today") {
          return tx.date === todayStr;
        }
        if (dateRangePreset === "Last7") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          return txDate >= sevenDaysAgo && txDate <= today;
        }
        if (dateRangePreset === "ThisMonth") {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return txDate >= startOfMonth && txDate <= today;
        }
        if (dateRangePreset === "Custom") {
          if (customStartDate && customEndDate) {
            return tx.date >= customStartDate && tx.date <= customEndDate;
          }
          if (customStartDate) {
            return tx.date >= customStartDate;
          }
          if (customEndDate) {
            return tx.date <= customEndDate;
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
        // tie breaker by amount
        if (valA === valB) {
          return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
        }
      } else if (sortBy === "amount") {
        valA = a.amount;
        valB = b.amount;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [consolidatedTransactions, searchQuery, typeFilter, categoryFilter, methodFilter, dateRangePreset, customStartDate, customEndDate, sortBy, sortOrder]);

  // ----------------------------------------------------
  // CHART DATA PREPARATION
  // ----------------------------------------------------
  const chartData = useMemo(() => {
    // 1. Category Breakdown (Expenses Pie Chart)
    const expenseMap = {};
    consolidatedTransactions.forEach(tx => {
      if (tx.type === "OUTFLOW") {
        expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount;
      }
    });

    const colors = [
      "#6366f1", // Indigo
      "#f59e0b", // Amber
      "#3b82f6", // Blue
      "#ef4444", // Red
      "#ec4899", // Pink
      "#8b5cf6", // Purple
      "#10b981", // Emerald
      "#14b8a6", // Teal
      "#64748b"  // Slate
    ];

    const categoryPieData = Object.keys(expenseMap).map((cat, idx) => ({
      name: cat,
      value: expenseMap[cat],
      color: colors[idx % colors.length]
    })).sort((a, b) => b.value - a.value);

    // 2. Inflow vs Outflow over date trend
    const dateMap = {};
    consolidatedTransactions.forEach(tx => {
      if (!dateMap[tx.date]) {
        dateMap[tx.date] = { date: tx.date, Inflow: 0, Outflow: 0 };
      }
      if (tx.type === "INFLOW") {
        dateMap[tx.date].Inflow += tx.amount;
      } else {
        dateMap[tx.date].Outflow += tx.amount;
      }
    });

    // Get last 15 active ledger dates sorted asc
    const dateTrendData = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-15);

    // 3. Payment Method breakdown
    const methodMap = { UPI: { name: "UPI", Inflow: 0, Outflow: 0 }, Cash: { name: "Cash", Inflow: 0, Outflow: 0 }, Card: { name: "Card", Inflow: 0, Outflow: 0 }, "Bank Transfer": { name: "Bank Transfer", Inflow: 0, Outflow: 0 } };
    consolidatedTransactions.forEach(tx => {
      const m = tx.paymentMethod || "UPI";
      if (methodMap[m]) {
        if (tx.type === "INFLOW") {
          methodMap[m].Inflow += tx.amount;
        } else {
          methodMap[m].Outflow += tx.amount;
        }
      }
    });

    const paymentMethodData = Object.values(methodMap);

    return { categoryPieData, dateTrendData, paymentMethodData };
  }, [consolidatedTransactions]);

  // ----------------------------------------------------
  // SUBMIT RECORD TRANSACTION
  // ----------------------------------------------------
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const amt = parseFloat(addForm.amount);

    if (!addForm.date) errors.date = "Date is required";
    if (isNaN(amt) || amt <= 0) errors.amount = "Amount must be a positive number";
    if (!addForm.description.trim()) errors.description = "Provide details / explanation";
    
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    const newTx = {
      id: "gen-" + Date.now(),
      date: addForm.date,
      type: addForm.type,
      category: addForm.category,
      amount: amt,
      paymentMethod: addForm.paymentMethod,
      description: addForm.description.trim()
    };

    setGeneralTransactions(prev => [newTx, ...prev]);
    setIsAddOpen(false);
    
    // Reset form to default OUTFLOW
    setAddForm({
      date: new Date().toISOString().split("T")[0],
      type: "OUTFLOW",
      category: "Inventory Purchase",
      amount: "",
      paymentMethod: "UPI",
      description: ""
    });
    setAddErrors({});
    triggerToast(`Transaction recorded: ${newTx.description}`);
  };

  // Toggle type triggers dynamic category reset
  const handleAddTypeChange = (type) => {
    const defaultCat = type === "INFLOW" ? CATEGORIES.INFLOW[0] : CATEGORIES.OUTFLOW[0];
    setAddForm(prev => ({
      ...prev,
      type,
      category: defaultCat
    }));
  };

  // ----------------------------------------------------
  // QUICK ADD SHORTCUTS
  // ----------------------------------------------------
  const quickLog = (shortcutName, type, category, amount, method, desc) => {
    const newTx = {
      id: "gen-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      type,
      category,
      amount,
      paymentMethod: method,
      description: desc
    };
    setGeneralTransactions(prev => [newTx, ...prev]);
    triggerToast(`Logged Shortcut: ${shortcutName} (₹${amount})`);
  };

  // ----------------------------------------------------
  // EDIT TRANSACTION SUBMIT
  // ----------------------------------------------------
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const amt = parseFloat(editForm.amount);

    if (!editForm.date) errors.date = "Date is required";
    if (isNaN(amt) || amt <= 0) errors.amount = "Amount must be a positive number";
    if (!editForm.description.trim()) errors.description = "Provide transaction notes";

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setGeneralTransactions(prev => prev.map(tx => {
      if (tx.id === editForm.id) {
        return {
          ...tx,
          date: editForm.date,
          type: editForm.type,
          category: editForm.category,
          amount: amt,
          paymentMethod: editForm.paymentMethod,
          description: editForm.description.trim()
        };
      }
      return tx;
    }));

    setIsEditOpen(false);
    setEditErrors({});
    triggerToast("Ledger transaction updated.");
  };

  const handleEditTypeChange = (type) => {
    const defaultCat = type === "INFLOW" ? CATEGORIES.INFLOW[0] : CATEGORIES.OUTFLOW[0];
    setEditForm(prev => ({
      ...prev,
      type,
      category: defaultCat
    }));
  };

  // ----------------------------------------------------
  // DELETE GENERAL TRANSACTION
  // ----------------------------------------------------
  const handleDeleteConfirm = () => {
    if (!selectedTx) return;
    setGeneralTransactions(prev => prev.filter(tx => tx.id !== selectedTx.id));
    setIsDeleteConfirmOpen(false);
    setIsDrawerOpen(false);
    triggerToast("Transaction entry deleted.");
    setSelectedTx(null);
  };

  // ----------------------------------------------------
  // EXPORT / BACKUPS
  // ----------------------------------------------------
  // 1. Export as JSON
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(generalTransactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `general_cashflow_backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      triggerToast("General ledger JSON exported successfully!");
    } catch (e) {
      triggerToast("JSON export failed.", "error");
    }
  };

  // 2. Export Consolidated Ledger as CSV
  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Date,Type,Category,Amount(INR),Payment Method,Description,Auto Imported,Customer Name\r\n";

      filteredTransactions.forEach(tx => {
        const row = [
          tx.id,
          tx.date,
          tx.type,
          `"${tx.category}"`,
          tx.amount,
          tx.paymentMethod,
          `"${tx.description.replace(/"/g, '""')}"`,
          tx.isAutoImported ? "YES" : "NO",
          tx.customerName ? `"${tx.customerName}"` : ""
        ];
        csvContent += row.join(",") + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', encodedUri);
      linkElement.setAttribute('download', `consolidated_cashflow_report_${new Date().toISOString().split('T')[0]}.csv`);
      linkElement.click();
      triggerToast("CSV ledger downloaded!");
    } catch (e) {
      triggerToast("CSV export failed.", "error");
    }
  };

  // 3. Import JSON Backup
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData)) {
          triggerToast("Invalid file: Must be an array of transactions.", "error");
          return;
        }

        // Schema validation
        const isValid = importedData.every(tx =>
          tx.id &&
          tx.date &&
          tx.type &&
          tx.category &&
          typeof tx.amount === "number" &&
          tx.paymentMethod
        );

        if (!isValid) {
          triggerToast("File properties do not match ledger schema.", "error");
          return;
        }

        setGeneralTransactions(importedData);
        triggerToast("General ledger backup restored!");
      } catch (err) {
        triggerToast("Failed to parse JSON file.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  // Get dynamic background for categories
  const getCategoryColor = (cat) => {
    if (cat === "Credit Settlement") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (cat === "Direct Sales") return "bg-indigo-50 text-indigo-700 border-indigo-100";
    if (cat === "Inventory Purchase") return "bg-amber-50 text-amber-700 border-amber-100";
    if (cat === "Shop Rent") return "bg-rose-50 text-rose-700 border-rose-100";
    if (cat === "Utility Bills") return "bg-sky-50 text-sky-700 border-sky-100";
    if (cat === "Tea & Refreshments") return "bg-orange-50 text-orange-700 border-orange-100";
    return "bg-slate-100 text-slate-700 border-slate-200";
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
            <Wallet className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">Shop Cash Flow Manager</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Centralized ledger consolidating showroom expenses, daily retail sales, and customer credit recovery entries.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Entry */}
          <button
            onClick={() => {
              setAddForm({
                date: new Date().toISOString().split("T")[0],
                type: "OUTFLOW",
                category: "Inventory Purchase",
                amount: "",
                paymentMethod: "UPI",
                description: ""
              });
              setAddErrors({});
              setIsAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Record Cash Entry
          </button>

          {/* Backup Database */}
          <button
            onClick={handleExportCSV}
            title="Download CSV Statement Reports"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            title="Backup General Transactions to JSON"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            JSON Backup
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current.click()}
            title="Restore General Transactions from JSON"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Inflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Cash-In (Inflows)</span>
            <h3 className="text-2xl font-extrabold text-emerald-600">₹{stats.totalInflow.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Total cash/digital received</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Outflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Cash-Out (Outflows)</span>
            <h3 className="text-2xl font-extrabold text-rose-600">₹{stats.totalOutflow.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Total expenditures paid</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Net Cash Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200 col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Net Cash Flow</span>
            <h3 className={`text-2xl font-extrabold ${stats.netFlow >= 0 ? "text-blue-600" : "text-rose-700"}`}>
              ₹{stats.netFlow.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400">Total net revenue balance</p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
            stats.netFlow >= 0 ? "bg-blue-50 text-blue-600" : "bg-rose-100 text-rose-600 animate-pulse"
          }`}>
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Cash in Hand (Liquid) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Cash In Drawer</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.cashBalance.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Physical liquid cash</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Wallet className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 5: Digital Ledger Cash */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Digital (Bank/UPI)</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{stats.digitalBalance.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Online/wallet account bank sum</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* Analytics Visualization charts */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Cash Flow Visualization & Outflow Analysis</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{showAnalytics ? "Collapse Charts" : "Expand Charts"}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showAnalytics ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showAnalytics && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Chart 1: Daily Inflow vs Outflow Trend */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Cash Inflow vs Outflow Trend</h4>
              <div className="h-64">
                {chartData.dateTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.dateTrendData} margin={{ left: -15, right: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                        formatter={(val) => [`₹${val.toLocaleString("en-IN")}`]}
                      />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="Inflow" stroke="#10b981" fillOpacity={1} fill="url(#colorInflow)" />
                      <Area type="monotone" dataKey="Outflow" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutflow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">No transaction dates registered.</div>
                )}
              </div>
            </div>

            {/* Chart 2: Category Expense breakdown */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Expense Categories Breakdown</h4>
                <div className="h-48 flex items-center justify-center">
                  {chartData.categoryPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.categoryPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => [`₹${val.toLocaleString("en-IN")}`, "Total Expensed"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-xs text-center">No outflows/expenses paid yet.</div>
                  )}
                </div>
              </div>
              <div className="max-h-24 overflow-y-auto text-[10px] space-y-1.5 border-t border-slate-200/50 pt-2.5">
                {chartData.categoryPieData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-600 truncate">{d.name}</span>
                    </div>
                    <span className="text-slate-700">₹{d.value.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Payment Method Cash breakdown */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Payment Method Flow Volume</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.paymentMethodData} margin={{ left: -15, right: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      formatter={(val) => `₹${val.toLocaleString("en-IN")}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Inflow" name="Inflow (+)" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Outflow" name="Outflow (-)" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Quick Add Shortcut panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="text-sm font-bold text-slate-800">Quick Shop Logs (Click-to-Add Expense/Sale)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button
            onClick={() => quickLog("Tea & Snacks", "OUTFLOW", "Tea & Refreshments", 100, "Cash", "Tea & snacks for customer & staff")}
            className="p-3 bg-orange-50 hover:bg-orange-100 border border-orange-100 text-left rounded-xl transition-all cursor-pointer group active:scale-98"
          >
            <span className="block text-[10px] font-bold text-orange-700 uppercase tracking-wider">TEA / SNACKS</span>
            <strong className="block text-slate-800 text-sm mt-0.5">₹100 Outflow</strong>
            <span className="text-[10px] text-slate-400 block mt-1 group-hover:text-slate-600 transition-colors">Record Cash Tea bill</span>
          </button>

          <button
            onClick={() => quickLog("Electricity Bill", "OUTFLOW", "Utility Bills", 3500, "UPI", "Showroom electricity utility bill payment")}
            className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-left rounded-xl transition-all cursor-pointer group active:scale-98"
          >
            <span className="block text-[10px] font-bold text-sky-700 uppercase tracking-wider">ELECTRIC BILL</span>
            <strong className="block text-slate-800 text-sm mt-0.5">₹3,500 Outflow</strong>
            <span className="text-[10px] text-slate-400 block mt-1 group-hover:text-slate-600 transition-colors">Record UPI utility charge</span>
          </button>

          <button
            onClick={() => quickLog("Direct Cash Sale", "INFLOW", "Direct Sales", 5000, "Cash", "Cash Counter: Direct showroom cash sale")}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-left rounded-xl transition-all cursor-pointer group active:scale-98"
          >
            <span className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider">DAILY CASH SALE</span>
            <strong className="block text-slate-800 text-sm mt-0.5">₹5,000 Inflow</strong>
            <span className="text-[10px] text-slate-400 block mt-1 group-hover:text-slate-600 transition-colors">Log direct cash register sale</span>
          </button>

          <button
            onClick={() => quickLog("Jewelry Stock Buy", "OUTFLOW", "Inventory Purchase", 15000, "Bank Transfer", "Purchased jewelry stock inventory from supplier")}
            className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-left rounded-xl transition-all cursor-pointer group active:scale-98"
          >
            <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider">STOCK JEWELRY BUY</span>
            <strong className="block text-slate-800 text-sm mt-0.5">₹15,000 Outflow</strong>
            <span className="text-[10px] text-slate-400 block mt-1 group-hover:text-slate-600 transition-colors">Supplier net banking transfer</span>
          </button>

        </div>
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
                placeholder="Search by description or category..."
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
                <option value="date">Date</option>
                <option value="amount">Amount</option>
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
            
            {/* Filter by Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="INFLOW">INFLOW (+ Cash In)</option>
                <option value="OUTFLOW">OUTFLOW (- Cash Out)</option>
              </select>
            </div>

            {/* Filter by Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Direct Sales">Direct Sales</option>
                <option value="Credit Settlement">Credit Settlement (Udhaar)</option>
                <option value="Commission">Commission</option>
                <option value="Inventory Purchase">Inventory Purchase</option>
                <option value="Shop Rent">Shop Rent</option>
                <option value="Utility Bills">Utility Bills</option>
                <option value="Salary / Wages">Salary / Wages</option>
                <option value="Tea & Refreshments">Tea & Refreshments</option>
                <option value="Travel & Transport">Travel & Transport</option>
                <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                <option value="Taxes">Taxes</option>
                <option value="Other Income">Other Income</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Filter by Payment Method */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Channel</label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Channels</option>
                <option value="Cash">Cash Handover</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card Swipe</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Date Range Preset */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Timeline</label>
              <select
                value={dateRangePreset}
                onChange={(e) => setDateRangePreset(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Time</option>
                <option value="Today">Today</option>
                <option value="Last7">Last 7 Days</option>
                <option value="ThisMonth">This Month</option>
                <option value="Custom">Custom Date Range...</option>
              </select>
            </div>

            {/* Custom Dates (if selected) */}
            {dateRangePreset === "Custom" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-1 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-1 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Clear Filters (if active) */}
            {(typeFilter !== "All" || categoryFilter !== "All" || methodFilter !== "All" || dateRangePreset !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setTypeFilter("All");
                  setCategoryFilter("All");
                  setMethodFilter("All");
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
          {filteredTransactions.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction detail</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Payment method</th>
                  <th className="px-6 py-4 text-center">Reference tag</th>
                  <th className="px-6 py-4 text-right">Flow amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTransactions.map((tx) => {
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Date & Description */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            tx.type === "INFLOW" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            {tx.type === "INFLOW" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col min-w-0 max-w-sm">
                            <span 
                              onClick={() => {
                                setSelectedTx(tx);
                                setIsDrawerOpen(true);
                              }}
                              className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer truncate"
                            >
                              {tx.description}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {tx.date}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(tx.category)}`}>
                          {tx.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                        {tx.paymentMethod}
                      </td>

                      {/* Reference Tags */}
                      <td className="px-6 py-4 text-center">
                        {tx.isAutoImported ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-200 tracking-wide uppercase">
                            Udhaar Sync
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md border border-slate-200 tracking-wide uppercase">
                            Shop Direct
                          </span>
                        )}
                      </td>

                      {/* Flow Amount */}
                      <td className="px-6 py-4 text-right">
                        <span className={`font-extrabold ${
                          tx.type === "INFLOW" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {tx.type === "INFLOW" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* View details */}
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsDrawerOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Details
                          </button>

                          {/* Edit Details (Only allowed if NOT Auto Imported) */}
                          <button
                            disabled={tx.isAutoImported}
                            onClick={() => {
                              setEditForm({
                                id: tx.id,
                                date: tx.date,
                                type: tx.type,
                                category: tx.category,
                                amount: tx.amount,
                                paymentMethod: tx.paymentMethod,
                                description: tx.description
                              });
                              setEditErrors({});
                              setIsEditOpen(true);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              tx.isAutoImported 
                                ? "text-slate-200 cursor-not-allowed" 
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            }`}
                            title={tx.isAutoImported ? "Payments synced from Customers can only be edited there." : "Edit Entry"}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Details */}
                          <button
                            disabled={tx.isAutoImported}
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              tx.isAutoImported 
                                ? "text-slate-200 cursor-not-allowed" 
                                : "text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title={tx.isAutoImported ? "Payments synced from Customers can only be deleted there." : "Delete Entry"}
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
              <span className="text-base font-semibold">No transactions found matching search and filters</span>
              <p className="text-xs text-slate-400 mt-1">Try resetting the timeline range or category dropdowns above</p>
            </div>
          )}
        </div>

        {/* Directory Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Displaying {filteredTransactions.length} of {consolidatedTransactions.length} consolidated register entries</span>
          <span>Cash ledger synchronizes with customer credit payments automatically</span>
        </div>

      </div>

      {/* --- ADD TRANSACTION MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Record General Shop Entry</h3>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              
              {/* Type Switcher */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Cashflow Direction</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleAddTypeChange("INFLOW")}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      addForm.type === "INFLOW" 
                        ? "bg-emerald-500 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    INFLOW (+ Cash In)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTypeChange("OUTFLOW")}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      addForm.type === "OUTFLOW" 
                        ? "bg-rose-500 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    OUTFLOW (- Cash Out)
                  </button>
                </div>
              </div>

              {/* Grid 1: Date & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Transaction Date *</label>
                  <input
                    type="date"
                    value={addForm.date}
                    onChange={(e) => setAddForm(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.date ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.date && <span className="text-xs font-semibold text-rose-500">{addErrors.date}</span>}
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category Group</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold"
                  >
                    {addForm.type === "INFLOW" ? (
                      CATEGORIES.INFLOW.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    ) : (
                      CATEGORIES.OUTFLOW.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    )}
                  </select>
                </div>

              </div>

              {/* Grid 2: Amount & Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Amount (INR) *</label>
                  <input
                    type="number"
                    value={addForm.amount}
                    onChange={(e) => setAddForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. 500"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.amount ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.amount && <span className="text-xs font-semibold text-rose-500">{addErrors.amount}</span>}
                </div>

                {/* Payment Method */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Payment Channel</label>
                  <select
                    value={addForm.paymentMethod}
                    onChange={(e) => setAddForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card swipe</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Entry description / notes *</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. paid electricity bill showroom, direct client jewelry buy"
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none ${
                    addErrors.description ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {addErrors.description && <span className="text-xs font-semibold text-rose-500">{addErrors.description}</span>}
              </div>

              {/* Modal Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer animate-pulse-slow"
                >
                  Record Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- EDIT TRANSACTION MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Edit Cash Flow Entry</h3>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              
              {/* Type Switcher */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Cashflow Direction</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleEditTypeChange("INFLOW")}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      editForm.type === "INFLOW" 
                        ? "bg-emerald-500 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    INFLOW (+ Cash In)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditTypeChange("OUTFLOW")}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      editForm.type === "OUTFLOW" 
                        ? "bg-rose-500 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    OUTFLOW (- Cash Out)
                  </button>
                </div>
              </div>

              {/* Grid 1: Date & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Transaction Date *</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.date ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.date && <span className="text-xs font-semibold text-rose-500">{editErrors.date}</span>}
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category Group</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold"
                  >
                    {editForm.type === "INFLOW" ? (
                      CATEGORIES.INFLOW.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    ) : (
                      CATEGORIES.OUTFLOW.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    )}
                  </select>
                </div>

              </div>

              {/* Grid 2: Amount & Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Amount (INR) *</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.amount ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.amount && <span className="text-xs font-semibold text-rose-500">{editErrors.amount}</span>}
                </div>

                {/* Payment Method */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Payment Channel</label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card swipe</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Entry description / notes *</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none ${
                    editErrors.description ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {editErrors.description && <span className="text-xs font-semibold text-rose-500">{editErrors.description}</span>}
              </div>

              {/* Modal Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Remove Ledger Transaction?</h3>
            </div>
            
            <p className="text-sm text-slate-500">
              Are you sure you want to delete the entry <strong>{selectedTx?.description}</strong> of amount <strong>₹{selectedTx?.amount.toLocaleString("en-IN")}</strong>? This will permanently erase the record from the shop general transactions.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- SLIDE OUT DRAWER (Receipt / Transaction details) --- */}
      {isDrawerOpen && selectedTx && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          
          {/* Backdrop closer clicker */}
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setIsDrawerOpen(false)} 
          />

          {/* Drawer Panel Container */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">Ledger Voucher Details</h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Store account receipt</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable container) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Receipt Visual design */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 space-y-5 relative">
                {/* Side punch-holes mockup */}
                <div className="absolute top-0 bottom-0 left-0 w-2 flex flex-col justify-around py-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white border border-slate-100 -ml-1" />
                  ))}
                </div>
                
                {/* Store Name header */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <h4 className="font-extrabold text-slate-800 tracking-tight text-base">ERP SUITE STORE</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Showroom Accounts Cash Ledger</span>
                  <div className="mt-3 flex justify-center">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                      selectedTx.type === "INFLOW" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {selectedTx.type === "INFLOW" ? "Cash Inflow" : "Cash Outflow"}
                    </span>
                  </div>
                </div>

                {/* Amount display */}
                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Transaction Value</span>
                  <strong className={`text-3xl font-black block tracking-tight ${
                    selectedTx.type === "INFLOW" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    ₹{selectedTx.amount.toLocaleString("en-IN")}
                  </strong>
                </div>

                {/* Voucher details fields */}
                <div className="space-y-3.5 text-xs border-t border-slate-200 pt-4">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Transaction ID</span>
                    <span className="text-slate-700 font-mono font-semibold">{selectedTx.id}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Post Date</span>
                    <span className="text-slate-700 font-semibold">{selectedTx.date}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Voucher Category</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryColor(selectedTx.category)}`}>
                      {selectedTx.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Payment Channel</span>
                    <span className="text-slate-700 font-bold">{selectedTx.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Ledger reference</span>
                    <span className="text-slate-700 font-semibold">
                      {selectedTx.isAutoImported ? "Udhaar Customer Collections" : "Direct Shop Account"}
                    </span>
                  </div>

                  {selectedTx.customerName && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Linked Client</span>
                      <span className="text-blue-600 font-bold hover:underline cursor-pointer">
                        {selectedTx.customerName}
                      </span>
                    </div>
                  )}

                  {/* Notes description */}
                  <div className="border-t border-slate-200 pt-3.5">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block mb-1">Voucher Narration</span>
                    <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs italic leading-relaxed">
                      {selectedTx.description}
                    </p>
                  </div>

                </div>

                {/* Footer seal */}
                <div className="text-center pt-2 text-[9px] text-slate-400 font-medium">
                  Verified & Logged on Cash-Basis ledger
                </div>

              </div>

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              
              <button
                type="button"
                disabled={selectedTx.isAutoImported}
                onClick={() => {
                  setIsDeleteConfirmOpen(true);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTx.isAutoImported 
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200" 
                    : "bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-600"
                }`}
                title={selectedTx.isAutoImported ? "Udhaar collection transaction logs must be removed from the customer statement ledger." : "Delete Entry"}
              >
                <Trash2 className="w-4 h-4" />
                Remove Transaction
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Receipt
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Finance;