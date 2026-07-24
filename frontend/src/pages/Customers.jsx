import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Pie
} from "recharts";

// ----------------------------------------------------
// INITIAL SEED CUSTOMERS (Matches Udhaar.jsx exactly)
// ----------------------------------------------------
const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Rajesh Sharma",
    phone: "9876543210",
    email: "rajesh.sharma@gmail.com",
    creditLimit: 15000,
    joined: "2026-03-10",
    notes: "Regular customer. Clears outstanding balance every 45-60 days.",
    transactions: [
      { id: "tx-1", date: "2026-05-15", type: "LENT", amount: 1750, description: "Lent: 1x Classic Chronograph Watch, 1x Golden plated (jesus)" },
      { id: "tx-2", date: "2026-06-01", type: "PAID", amount: 1000, description: "Payment received via UPI", method: "UPI" },
      { id: "tx-3", date: "2026-07-02", type: "LENT", amount: 798, description: "Lent: 2x Golden Triple Layered Necklace" },
      { id: "tx-4", date: "2026-07-15", type: "LENT", amount: 4495, description: "Lent: 5x Sapphire Crown Ring" },
      { id: "tx-5", date: "2026-07-20", type: "PAID", amount: 1500, description: "Payment received via Cash", method: "Cash" }
    ]
  },
  {
    id: "cust-2",
    name: "Amit Patel",
    phone: "8123456789",
    email: "amit.patel@yahoo.com",
    creditLimit: 12000,
    joined: "2026-02-14",
    notes: "Requires regular follow-up. Approaching limit frequently.",
    transactions: [
      { id: "tx-6", date: "2026-04-10", type: "LENT", amount: 3298, description: "Lent: 1x Diamond heart, 2x Sapphire Crown Ring" },
      { id: "tx-7", date: "2026-05-02", type: "PAID", amount: 2000, description: "Payment received via Cash", method: "Cash" },
      { id: "tx-8", date: "2026-05-18", type: "LENT", amount: 5000, description: "Lent: 4x Classic Chronograph Watch" },
      { id: "tx-9", date: "2026-06-05", type: "LENT", amount: 1794, description: "Lent: 6x Pearl Drop Earrings" },
      { id: "tx-10", date: "2026-06-25", type: "PAID", amount: 1000, description: "Payment received via Card", method: "Card" },
      { id: "tx-11", date: "2026-07-01", type: "LENT", amount: 3990, description: "Lent: 10x Golden Triple Layered Necklace" }
    ]
  },
  {
    id: "cust-3",
    name: "Sunita Verma",
    phone: "7012345678",
    email: "sunita.v@outlook.com",
    creditLimit: 8000,
    joined: "2026-04-05",
    notes: "Very punctual. Clears debt immediately upon request.",
    transactions: [
      { id: "tx-12", date: "2026-06-12", type: "LENT", amount: 598, description: "Lent: 2x Pearl Drop Earrings" },
      { id: "tx-13", date: "2026-06-18", type: "PAID", amount: 598, description: "Payment received via UPI", method: "UPI" },
      { id: "tx-14", date: "2026-07-10", type: "LENT", amount: 450, description: "Lent: 3x Minimalist Silver Ring" }
    ]
  },
  {
    id: "cust-4",
    name: "Vikram Singh",
    phone: "9988776655",
    email: "vikram.singh@gmail.com",
    creditLimit: 30000,
    joined: "2026-01-20",
    notes: "High net worth customer. Prefers monthly bank transfers.",
    transactions: [
      { id: "tx-15", date: "2026-05-20", type: "LENT", amount: 3000, description: "Lent: 2x Diamond heart" },
      { id: "tx-16", date: "2026-06-01", type: "PAID", amount: 3000, description: "Payment received via Bank Transfer", method: "Bank Transfer" }
    ]
  },
  {
    id: "cust-5",
    name: "Neha Gupta",
    phone: "9001122334",
    email: "neha.gupta@gmail.com",
    creditLimit: 6000,
    joined: "2026-05-01",
    notes: "New customer, polite and responsive.",
    transactions: [
      { id: "tx-17", date: "2026-07-05", type: "LENT", amount: 599, description: "Lent: 1x Tiny hearted" },
      { id: "tx-18", date: "2026-07-22", type: "PAID", amount: 599, description: "Payment received via UPI", method: "UPI" }
    ]
  }
];

const Customers = () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("erp_udhaar_customers");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");     // All, VIP, Regular, New
  const [statusFilter, setStatusFilter] = useState("All"); // All, Debtors, Cleared, Over Limit
  const [riskFilter, setRiskFilter] = useState("All");     // All, Safe, Warning, Critical
  const [sortBy, setSortBy] = useState("name");            // name, balance, ltv, joined
  const [sortOrder, setSortOrder] = useState("asc");       // asc, desc

  const [showAnalytics, setShowAnalytics] = useState(true);

  // Modals & Panels
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedCust, setSelectedCust] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({ name: "", phone: "", email: "", creditLimit: 10000, notes: "" });
  const [editForm, setEditForm] = useState({ id: "", name: "", phone: "", email: "", creditLimit: 10000, notes: "" });
  const [txForm, setTxForm] = useState({ type: "LENT", amount: "", description: "", method: "UPI" });
  
  // Validation errors
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [txErrors, setTxErrors] = useState({});

  // Toast Notification State
  const [toasts, setToasts] = useState([]);
  
  const fileInputRef = useRef(null);

  // ----------------------------------------------------
  // PERSIST TO LOCAL STORAGE
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_udhaar_customers", JSON.stringify(customers));
  }, [customers]);

  // Sync drawer details if customers array is updated
  useEffect(() => {
    if (selectedCust) {
      const current = customers.find(c => c.id === selectedCust.id);
      if (current) {
        setSelectedCust(current);
      }
    }
  }, [customers]);

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
  // BUSINESS LOGIC HELPERS
  // ----------------------------------------------------
  const getBalance = (cust) => {
    if (!cust.transactions) return 0;
    return cust.transactions.reduce((sum, tx) => sum + (tx.type === "LENT" ? tx.amount : -tx.amount), 0);
  };

  const getLTV = (cust) => {
    if (!cust.transactions) return 0;
    return cust.transactions.reduce((sum, tx) => sum + (tx.type === "LENT" ? tx.amount : 0), 0);
  };

  const getPaid = (cust) => {
    if (!cust.transactions) return 0;
    return cust.transactions.reduce((sum, tx) => sum + (tx.type === "PAID" ? tx.amount : 0), 0);
  };

  const getTier = (cust) => {
    if (cust.creditLimit >= 15000) return "VIP";
    if (cust.creditLimit >= 5000) return "Regular";
    return "New";
  };

  const getRiskCategory = (cust) => {
    const bal = getBalance(cust);
    const limit = cust.creditLimit || 1;
    const ratio = bal / limit;
    if (ratio >= 0.95) return "Critical";
    if (ratio >= 0.75) return "Warning";
    return "Safe";
  };

  // ----------------------------------------------------
  // CALCULATE SUMMARY STATS
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let debtors = 0;
    let totalDebt = 0;
    let totalExposure = 0;
    let criticalAlerts = 0;
    let totalLtv = 0;

    customers.forEach(c => {
      const bal = getBalance(c);
      const ltv = getLTV(c);
      totalExposure += Number(c.creditLimit || 0);
      totalLtv += ltv;
      
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
      avgLTV: customers.length ? Math.round(totalLtv / customers.length) : 0
    };
  }, [customers]);

  // ----------------------------------------------------
  // FILTER & SORT DIRECTORY
  // ----------------------------------------------------
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    // Tier Filter
    if (tierFilter !== "All") {
      result = result.filter(c => getTier(c) === tierFilter);
    }

    // Status Filter
    if (statusFilter !== "All") {
      result = result.filter(c => {
        const bal = getBalance(c);
        if (statusFilter === "Debtors") return bal > 0;
        if (statusFilter === "Cleared") return bal <= 0;
        if (statusFilter === "Over Limit") return bal > c.creditLimit;
        return true;
      });
    }

    // Risk Filter
    if (riskFilter !== "All") {
      result = result.filter(c => getRiskCategory(c) === riskFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "balance") {
        valA = getBalance(a);
        valB = getBalance(b);
      } else if (sortBy === "ltv") {
        valA = getLTV(a);
        valB = getLTV(b);
      } else if (sortBy === "joined") {
        valA = a.joined;
        valB = b.joined;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [customers, searchQuery, tierFilter, statusFilter, riskFilter, sortBy, sortOrder]);

  // ----------------------------------------------------
  // CHART DATA PREPARATION
  // ----------------------------------------------------
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
  }, [customers]);

  // ----------------------------------------------------
  // ADD CUSTOMER SUBMIT
  // ----------------------------------------------------
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!addForm.name.trim()) errors.name = "Name is required";
    if (!addForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(addForm.phone.trim())) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else {
      const exists = customers.some(c => c.phone === addForm.phone.trim());
      if (exists) errors.phone = "Customer phone already registered";
    }
    if (addForm.creditLimit <= 0) errors.creditLimit = "Credit limit must be greater than 0";

    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    const newCust = {
      id: "cust-" + Date.now(),
      name: addForm.name.trim(),
      phone: addForm.phone.trim(),
      email: addForm.email.trim() || undefined,
      creditLimit: Number(addForm.creditLimit),
      joined: new Date().toISOString().split("T")[0],
      notes: addForm.notes.trim() || "No notes added.",
      transactions: []
    };

    setCustomers(prev => [...prev, newCust]);
    setIsAddOpen(false);
    setAddForm({ name: "", phone: "", email: "", creditLimit: 10000, notes: "" });
    setAddErrors({});
    triggerToast(`Customer ${newCust.name} added successfully!`);
  };

  // ----------------------------------------------------
  // EDIT CUSTOMER SUBMIT
  // ----------------------------------------------------
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Name is required";
    if (!editForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(editForm.phone.trim())) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else {
      const exists = customers.some(c => c.phone === editForm.phone.trim() && c.id !== editForm.id);
      if (exists) errors.phone = "Customer phone already registered to another user";
    }
    if (editForm.creditLimit <= 0) errors.creditLimit = "Credit limit must be greater than 0";

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setCustomers(prev => prev.map(c => {
      if (c.id === editForm.id) {
        return {
          ...c,
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          email: editForm.email.trim() || undefined,
          creditLimit: Number(editForm.creditLimit),
          notes: editForm.notes.trim()
        };
      }
      return c;
    }));

    setIsEditOpen(false);
    setEditErrors({});
    triggerToast(`Customer ${editForm.name} details updated.`);
  };

  // ----------------------------------------------------
  // DELETE CUSTOMER
  // ----------------------------------------------------
  const handleDeleteConfirm = () => {
    if (!selectedCust) return;
    setCustomers(prev => prev.filter(c => c.id !== selectedCust.id));
    setIsDeleteConfirmOpen(false);
    setIsDrawerOpen(false);
    triggerToast(`Customer "${selectedCust.name}" deleted.`);
    setSelectedCust(null);
  };

  // ----------------------------------------------------
  // QUICK TRANSACTION RECORDING
  // ----------------------------------------------------
  const handleRecordTransaction = (e) => {
    e.preventDefault();
    const errors = {};
    const amt = parseFloat(txForm.amount);

    if (isNaN(amt) || amt <= 0) {
      errors.amount = "Amount must be a positive number";
    }
    if (!txForm.description.trim()) {
      errors.description = "Provide a description (e.g. UPI payment, gold chain)";
    }

    if (Object.keys(errors).length > 0) {
      setTxErrors(errors);
      return;
    }

    // Verify limit rules if LENT
    const currentBal = getBalance(selectedCust);
    if (txForm.type === "LENT" && (currentBal + amt > selectedCust.creditLimit)) {
      triggerToast(`Warning: Credit limit of ₹${selectedCust.creditLimit} exceeded! Proceeded anyway.`, "info");
    }

    const newTx = {
      id: "tx-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: txForm.type,
      amount: amt,
      description: txForm.description.trim(),
      method: txForm.type === "PAID" ? txForm.method : undefined
    };

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCust.id) {
        return {
          ...c,
          transactions: [newTx, ...c.transactions]
        };
      }
      return c;
    }));

    setTxForm({ type: "LENT", amount: "", description: "", method: "UPI" });
    setTxErrors({});
    triggerToast(`Transaction recorded successfully! Balance updated.`);
  };

  // Delete transaction
  const handleDeleteTx = (txId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCust.id) {
        return {
          ...c,
          transactions: c.transactions.filter(t => t.id !== txId)
        };
      }
      return c;
    }));
    triggerToast(`Transaction log deleted. Balance recalculated.`);
  };

  // ----------------------------------------------------
  // BACKUP & RESTORE
  // ----------------------------------------------------
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(customers, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `erp_customers_backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      triggerToast("Database backup downloaded successfully!");
    } catch (e) {
      triggerToast("Failed to export database.", "error");
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData)) {
          triggerToast("Invalid format: Backup must be a list of customers.", "error");
          return;
        }

        // Schema validation
        const isValid = importedData.every(c => 
          c.id && 
          c.name && 
          c.phone && 
          typeof c.creditLimit === "number" && 
          Array.isArray(c.transactions)
        );

        if (!isValid) {
          triggerToast("Invalid structure inside backup file.", "error");
          return;
        }

        setCustomers(importedData);
        triggerToast("Database restored successfully!", "success");
      } catch (err) {
        triggerToast("Failed to parse JSON file.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset file input
  };

  // ----------------------------------------------------
  // WHATSAPP REMINDER GENERATION
  // ----------------------------------------------------
  const openWhatsApp = (c) => {
    const bal = getBalance(c);
    if (bal <= 0) return;
    
    const prefilledText = `Dear *${c.name}*,\n\nThis is a friendly reminder from *ERP Suite Store* regarding your outstanding balance of *₹${bal.toLocaleString("en-IN")}*.\n\nPlease clear it at your earliest convenience using UPI, cash, or bank transfer.\n\nThank you for your business!\n_Sent via ERP Suite_`;
    
    // Clean phone number (replace non digits)
    const phoneClean = c.phone.replace(/\D/g, "");
    // Prefill 91 for Indian country code if not present
    const finalPhone = phoneClean.length === 10 ? "91" + phoneClean : phoneClean;
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(prefilledText)}`;
    
    window.open(url, "_blank");
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
            <Users className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">Customer Relationship Manager</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Track shopping loyalty tiers, analyze credit risk profile ratios, trigger automated payment reminders, and record ledger payments.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:self-end">
          {/* Add Customer */}
          <button
            onClick={() => {
              setAddForm({ name: "", phone: "", email: "", creditLimit: 10000, notes: "" });
              setAddErrors({});
              setIsAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <UserPlus className="w-4.5 h-4.5" />
            Add Customer
          </button>

          {/* Backup Database */}
          <button
            onClick={handleExport}
            title="Download Customer Data Backup"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Backup
          </button>

          {/* Restore Database */}
          <button
            onClick={() => fileInputRef.current.click()}
            title="Upload Customer Data Backup"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* KPI Stats Grid */}
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
            stats.criticalAlerts > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-500"
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Collapsible Panel */}
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
                placeholder="Search by name, phone or email..."
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
                <option value="name">Name</option>
                <option value="balance">Outstanding Udhaar</option>
                <option value="ltv">Lifetime Lent Value</option>
                <option value="joined">Join Date</option>
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
            
            {/* Filter by Tier */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loyalty Tier</label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Tiers</option>
                <option value="VIP">VIP (Limit ≥ ₹15k)</option>
                <option value="Regular">Regular (₹5k - ₹15k)</option>
                <option value="New">New (Limit &lt; ₹5k)</option>
              </select>
            </div>

            {/* Filter by Debt Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ledger Balance</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Accounts</option>
                <option value="Debtors">Outstanding Debt &gt; 0</option>
                <option value="Cleared">Cleared (₹0 Debt)</option>
                <option value="Over Limit">Over Credit Limit</option>
              </select>
            </div>

            {/* Filter by Risk Level */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exposure Risk</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Risk Profiles</option>
                <option value="Safe">Safe (&lt;75% Limit)</option>
                <option value="Warning">Warning (75-95%)</option>
                <option value="Critical">Critical (≥95% Limit)</option>
              </select>
            </div>

            {/* Clear Filters (if active) */}
            {(tierFilter !== "All" || statusFilter !== "All" || riskFilter !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setTierFilter("All");
                  setStatusFilter("All");
                  setRiskFilter("All");
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
          {filteredCustomers.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Outstanding debt</th>
                  <th className="px-6 py-4">Credit limit utilization</th>
                  <th className="px-6 py-4 text-center">Loyalty tier</th>
                  <th className="px-6 py-4 text-center">Quick alert</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCustomers.map((c) => {
                  const balance = getBalance(c);
                  const tier = getTier(c);
                  const risk = getRiskCategory(c);
                  const limitUsage = c.creditLimit ? Math.round((balance / c.creditLimit) * 100) : 0;
                  
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Customer Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {c.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span 
                              onClick={() => {
                                setSelectedCust(c);
                                setIsDrawerOpen(true);
                              }}
                              className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer truncate"
                            >
                              {c.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">Joined {new Date(c.joined).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                      </td>

                      {/* Outstanding Debt */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-extrabold ${balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                            ₹{balance.toLocaleString("en-IN")}
                          </span>
                          {balance < 0 && <span className="text-[10px] text-emerald-500 font-bold uppercase">Prepayment</span>}
                        </div>
                      </td>

                      {/* Limit Utilization Progress Bar */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                            <span>{limitUsage}% used</span>
                            <span>Limit ₹{(c.creditLimit || 0).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                limitUsage >= 95 ? "bg-rose-500" : limitUsage >= 75 ? "bg-amber-500" : "bg-emerald-500"
                              }`} 
                              style={{ width: `${Math.min(limitUsage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Loyalty Tier */}
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          tier === "VIP" 
                            ? "bg-purple-50 text-purple-700 border-purple-200" 
                            : tier === "Regular" 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {tier}
                        </span>
                      </td>

                      {/* Quick Contact Reminders */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Call Button */}
                          <a
                            href={`tel:${c.phone}`}
                            className="p-2 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 text-slate-500 rounded-xl transition-all"
                            title={`Call ${c.name} (${c.phone})`}
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          {/* WhatsApp Reminder (Disabled if balance <= 0) */}
                          <button
                            onClick={() => openWhatsApp(c)}
                            disabled={balance <= 0}
                            className={`p-2 border rounded-xl transition-all cursor-pointer ${
                              balance > 0 
                                ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600" 
                                : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                            title={balance > 0 ? "Send Outstanding Debt Reminder on WhatsApp" : "No outstanding debt to remind"}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Statement Drawer */}
                          <button
                            onClick={() => {
                              setSelectedCust(c);
                              setIsDrawerOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Statement
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => {
                              setEditForm({
                                id: c.id,
                                name: c.name,
                                phone: c.phone,
                                email: c.email || "",
                                creditLimit: c.creditLimit,
                                notes: c.notes || ""
                              });
                              setEditErrors({});
                              setIsEditOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Details */}
                          <button
                            onClick={() => {
                              setSelectedCust(c);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove Profile"
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
              <span className="text-base font-semibold">No customers found matching the search and filters</span>
              <p className="text-xs text-slate-400 mt-1">Try resetting the loyalty, balance, or risk filter dropdowns above</p>
            </div>
          )}
        </div>

        {/* Directory Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Showing {filteredCustomers.length} of {customers.length} registered customer accounts</span>
          <span>Syncing in real-time with Ledger data</span>
        </div>

      </div>

      {/* --- ADD CUSTOMER MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Add New Shop Customer</h3>
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
              
              {/* Customer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Customer Name *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                    addErrors.name ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {addErrors.name && <span className="text-xs font-semibold text-rose-500">{addErrors.name}</span>}
              </div>

              {/* Grid Contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mobile Phone *</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={addForm.phone}
                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit number"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.phone ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                    }`}
                  />
                  {addErrors.phone && <span className="text-xs font-semibold text-rose-500">{addErrors.phone}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Credit Limit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Allowed Credit Limit (₹) *</label>
                <input
                  type="number"
                  value={addForm.creditLimit}
                  onChange={(e) => setAddForm(prev => ({ ...prev, creditLimit: e.target.value }))}
                  placeholder="e.g. 10000"
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                    addErrors.creditLimit ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-medium">Controls warning flags and progress bars when credit is lent.</span>
                {addErrors.creditLimit && <span className="text-xs font-semibold text-rose-500">{addErrors.creditLimit}</span>}
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Internal Shop Notes</label>
                <textarea
                  value={addForm.notes}
                  onChange={(e) => setAddForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes about payment reliability, timing, preferred jewelry categories, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Add Customer
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- EDIT CUSTOMER MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Edit Customer Information</h3>
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
              
              {/* Customer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Customer Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                    editErrors.name ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {editErrors.name && <span className="text-xs font-semibold text-rose-500">{editErrors.name}</span>}
              </div>

              {/* Grid Contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mobile Phone *</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.phone ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                    }`}
                  />
                  {editErrors.phone && <span className="text-xs font-semibold text-rose-500">{editErrors.phone}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Credit Limit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Allowed Credit Limit (₹) *</label>
                <input
                  type="number"
                  value={editForm.creditLimit}
                  onChange={(e) => setEditForm(prev => ({ ...prev, creditLimit: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                    editErrors.creditLimit ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {editErrors.creditLimit && <span className="text-xs font-semibold text-rose-500">{editErrors.creditLimit}</span>}
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Internal Shop Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
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
              <h3 className="text-base font-bold text-slate-800">Remove Customer Profile?</h3>
            </div>
            
            <p className="text-sm text-slate-500">
              Are you sure you want to delete <strong>{selectedCust?.name}</strong>? This action will erase their details and all of their related ledger transactions. This is irreversible.
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

      {/* --- SLIDE OUT DRAWER (Detailed Statement & Profile) --- */}
      {isDrawerOpen && selectedCust && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          
          {/* Backdrop closer clicker */}
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setIsDrawerOpen(false)} 
          />

          {/* Drawer Panel Container */}
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in relative overflow-hidden">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  {selectedCust.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">{selectedCust.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Statement Ledger Profile</span>
                </div>
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
              
              {/* Profile Details Panel */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                
                {/* Visual Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full text-xs border border-blue-200">
                    ID: {selectedCust.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    getTier(selectedCust) === "VIP" 
                      ? "bg-purple-100 text-purple-700 border-purple-200" 
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {getTier(selectedCust)} Loyalty
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    getRiskCategory(selectedCust) === "Critical" 
                      ? "bg-rose-100 text-rose-700 border-rose-200" 
                      : getRiskCategory(selectedCust) === "Warning" 
                      ? "bg-amber-100 text-amber-700 border-amber-200" 
                      : "bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}>
                    {getRiskCategory(selectedCust)} Risk Status
                  </span>
                </div>

                {/* Primary Data block */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Mobile Phone</span>
                    <a href={`tel:${selectedCust.phone}`} className="text-slate-700 hover:text-blue-600 font-semibold text-sm flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5" />
                      {selectedCust.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Email address</span>
                    <span className="text-slate-700 font-semibold text-sm block truncate">
                      {selectedCust.email || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Account Join Date</span>
                    <span className="text-slate-700 font-semibold text-sm flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedCust.joined).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block mb-0.5">Credit Exposure Limit</span>
                    <span className="text-slate-700 font-semibold text-sm block">
                      ₹{(selectedCust.creditLimit || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Internal notes */}
                <div className="border-t border-slate-200/60 pt-3">
                  <span className="text-slate-400 font-bold text-[10px] uppercase block mb-1">Store Owner Notes:</span>
                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                    {selectedCust.notes}
                  </p>
                </div>

              </div>

              {/* Credit Meter visualization card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800">Current Credit Limit Usage</h4>
                  <span className="text-xs font-bold text-slate-400">₹{getBalance(selectedCust).toLocaleString("en-IN")} / ₹{(selectedCust.creditLimit || 0).toLocaleString("en-IN")}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (getBalance(selectedCust) / (selectedCust.creditLimit || 1)) >= 0.95 
                        ? "bg-rose-500" 
                        : (getBalance(selectedCust) / (selectedCust.creditLimit || 1)) >= 0.75 
                        ? "bg-amber-500" 
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min((getBalance(selectedCust) / (selectedCust.creditLimit || 1)) * 100, 100)}%` }}
                  />
                </div>

                {/* Legend Details */}
                <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Total Lent (Bought)</span>
                    <strong className="text-slate-700 font-extrabold block text-sm">₹{getLTV(selectedCust).toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Total Payments</span>
                    <strong className="text-slate-700 font-extrabold block text-sm">₹{getPaid(selectedCust).toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Outstanding Debt</span>
                    <strong className={`font-extrabold block text-sm ${getBalance(selectedCust) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      ₹{getBalance(selectedCust).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Direct Ledger Transaction Recorder */}
              <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-4.5 h-4.5 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-800">Quick Record Ledger Entry</h4>
                </div>

                <form onSubmit={handleRecordTransaction} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Log Type */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Entry Type</label>
                      <select
                        value={txForm.type}
                        onChange={(e) => setTxForm(prev => ({ ...prev, type: e.target.value }))}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold"
                      >
                        <option value="LENT">LENT (Customer Credit Purchase)</option>
                        <option value="PAID">PAID (Customer Settle/Payment)</option>
                      </select>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Amount (₹) *</label>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={txForm.amount}
                        onChange={(e) => setTxForm(prev => ({ ...prev, amount: e.target.value }))}
                        className={`px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 ${
                          txErrors.amount ? "border-rose-400" : "border-slate-200"
                        }`}
                      />
                      {txErrors.amount && <span className="text-[10px] text-rose-500 font-semibold">{txErrors.amount}</span>}
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Description */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Entry description *</label>
                      <input
                        type="text"
                        placeholder="e.g. 1x Gold Ring, UPI partial payment"
                        value={txForm.description}
                        onChange={(e) => setTxForm(prev => ({ ...prev, description: e.target.value }))}
                        className={`px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20 ${
                          txErrors.description ? "border-rose-400" : "border-slate-200"
                        }`}
                      />
                      {txErrors.description && <span className="text-[10px] text-rose-500 font-semibold">{txErrors.description}</span>}
                    </div>

                    {/* Method (Only if Paid) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</label>
                      <select
                        disabled={txForm.type !== "PAID"}
                        value={txForm.method}
                        onChange={(e) => setTxForm(prev => ({ ...prev, method: e.target.value }))}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                        <option value="Cash">Cash Handover</option>
                        <option value="Card">Credit/Debit Card</option>
                        <option value="Bank Transfer">Net Banking / NEFT</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-500/10 active:scale-[0.99]"
                  >
                    Post Entry to Ledger Account
                  </button>

                </form>
              </div>

              {/* Transactions Logs table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800">Ledger Audit Statements ({selectedCust.transactions?.length || 0})</h4>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Newest entries first</span>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                  {selectedCust.transactions && selectedCust.transactions.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {selectedCust.transactions.map((tx) => (
                        <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-xs">
                          
                          {/* Date and Details */}
                          <div className="flex gap-3 items-start min-w-0">
                            <div className={`p-2 rounded-lg ${
                              tx.type === "LENT" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {tx.type === "LENT" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-800 truncate">{tx.description}</span>
                              <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>{tx.date}</span>
                                {tx.method && (
                                  <>
                                    <span>•</span>
                                    <span className="bg-slate-100 text-slate-500 px-1 rounded-sm text-[9px] uppercase font-bold">{tx.method}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Amount and delete */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`font-extrabold ${tx.type === "LENT" ? "text-amber-600" : "text-emerald-600"}`}>
                              {tx.type === "LENT" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => handleDeleteTx(tx.id)}
                              className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                              title="Delete Transaction Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-1.5" />
                      <span className="text-xs font-semibold">No transactions registered for this account</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Use the ledger form above to post entries.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Remove Customer
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Drawer
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;