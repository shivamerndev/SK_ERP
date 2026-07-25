import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Send,
  Calendar,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ChevronRight,
  Filter,
  CheckCircle,
  FileText,
  Printer,
  Trash2,
  Edit2,
  ChevronDown,
  CreditCard,
  PhoneCall,
  Activity,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// ----------------------------------------------------
// DEFAULT PRODUCTS LIST (for Autocomplete in Lending)
// ----------------------------------------------------
const SHOP_PRODUCTS = [
  { id: "prod-1", name: "Diamond heart", category: "Necklace", price: 1500 },
  { id: "prod-2", name: "Golden plated (jesus)", category: "Necklace", price: 500 },
  { id: "prod-3", name: "Tiny hearted", category: "Necklace", price: 599 },
  { id: "prod-4", name: "Golden Triple Layered Necklace", category: "Necklace", price: 399 },
  { id: "prod-6", name: "Classic Chronograph Watch", category: "Watches", price: 1250 },
  { id: "prod-7", name: "Minimalist Silver Ring", category: "Ring", price: 150 },
  { id: "prod-8", name: "Sapphire Crown Ring", category: "Ring", price: 899 },
  { id: "prod-9", name: "Pearl Drop Earrings", category: "Earrings", price: 299 }
];

// ----------------------------------------------------
// INITIAL SEED CUSTOMERS & TRANSACTION LOGS
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

const Udhaar = () => {
  // ----------------------------------------------------
  // STATES
  // ----------------------------------------------------
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("erp_udhaar_customers");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Debtor, Cleared
  const [riskFilter, setRiskFilter] = useState("All"); // All, Safe, Warning, Critical
  const [activeDropdown, setActiveDropdown] = useState(null); // filter dropdown toggle
  
  // Modal states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isRecordTxOpen, setIsRecordTxOpen] = useState(false);
  const [txType, setTxType] = useState("LENT"); // LENT or PAID
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  
  // Drawer / Detailed statement state
  const [drawerCustomer, setDrawerCustomer] = useState(null);

  // Forms states
  // 1. Add Customer
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustLimit, setNewCustLimit] = useState(10000);
  const [newCustNotes, setNewCustNotes] = useState("");
  const [custFormErrors, setCustFormErrors] = useState({});

  // 2. Record Transaction
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [txDesc, setTxDesc] = useState("");
  const [txMethod, setTxMethod] = useState("UPI"); // UPI, Cash, Card, Bank Transfer
  // Lending item selections
  const [selectedLendItems, setSelectedLendItems] = useState([]); // Array of { product, qty }
  const [txFormErrors, setTxFormErrors] = useState({});



  // Refs for clicking outside dropdowns
  const dropdownRef = useRef(null);

  // ----------------------------------------------------
  // PERSISTENCE EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_udhaar_customers", JSON.stringify(customers));
  }, [customers]);

  // Click outside listener for custom dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------------------------------
  // HELPERS & DERIVED VALUES
  // ----------------------------------------------------
  
  // Helper to add toast notification using react-hot-toast
  const addNotification = (message, type = "info") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "danger" || type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  // Process customer balances and risk status dynamically
  const enrichedCustomers = useMemo(() => {
    return customers.map((c) => {
      // Calculate balance: LENT transactions add to balance, PAID subtract
      let totalLent = 0;
      let totalPaid = 0;
      
      c.transactions.forEach((t) => {
        if (t.type === "LENT") {
          totalLent += t.amount;
        } else if (t.type === "PAID") {
          totalPaid += t.amount;
        }
      });
      
      const balance = totalLent - totalPaid;
      const utilization = c.creditLimit > 0 ? (balance / c.creditLimit) * 100 : 0;
      
      // Determine risk status
      let riskStatus = "Safe";
      if (balance > 0) {
        if (utilization >= 90) {
          riskStatus = "Critical";
        } else if (utilization >= 60) {
          riskStatus = "Warning";
        } else {
          // Check age of oldest unpaid debt
          const lentTxs = c.transactions.filter(t => t.type === "LENT");
          if (lentTxs.length > 0) {
            const oldestLentDate = new Date(lentTxs[0].date);
            const daysSinceOldest = Math.floor((new Date() - oldestLentDate) / (1000 * 60 * 60 * 24));
            if (daysSinceOldest > 45) {
              riskStatus = "Critical";
            } else if (daysSinceOldest > 30) {
              riskStatus = "Warning";
            }
          }
        }
      }

      // Find last activity
      let lastActivityText = "No transactions";
      if (c.transactions.length > 0) {
        const lastTx = c.transactions[c.transactions.length - 1];
        const dateStr = new Date(lastTx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (lastTx.type === "LENT") {
          lastActivityText = `Lent $${lastTx.amount} on ${dateStr}`;
        } else {
          lastActivityText = `Paid $${lastTx.amount} on ${dateStr}`;
        }
      }

      return {
        ...c,
        balance,
        totalLent,
        totalPaid,
        utilization,
        riskStatus,
        lastActivityText
      };
    });
  }, [customers]);

  // Sync drawer info if it is open and customer data changes
  useEffect(() => {
    if (drawerCustomer) {
      const updated = enrichedCustomers.find((c) => c.id === drawerCustomer.id);
      if (updated) {
        setDrawerCustomer(updated);
      }
    }
  }, [enrichedCustomers]);

  // Overall Statistics
  const stats = useMemo(() => {
    let totalOutstanding = 0;
    let totalRecovered = 0; // recovered overall
    let totalDebtorsCount = 0;
    let highRiskCount = 0;

    enrichedCustomers.forEach((c) => {
      if (c.balance > 0) {
        totalOutstanding += c.balance;
        totalDebtorsCount += 1;
        if (c.riskStatus === "Critical") {
          highRiskCount += 1;
        }
      }
      totalRecovered += c.totalPaid;
    });

    // Monthly recoveries (this current month, say July 2026 in mock timeline)
    const currentMonthRecovered = enrichedCustomers.reduce((acc, c) => {
      const thisMonthPaid = c.transactions
        .filter(t => t.type === "PAID" && t.date.includes("2026-07"))
        .reduce((sum, t) => sum + t.amount, 0);
      return acc + thisMonthPaid;
    }, 0);

    return {
      totalOutstanding,
      totalRecovered,
      currentMonthRecovered,
      totalDebtorsCount,
      highRiskCount
    };
  }, [enrichedCustomers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return enrichedCustomers.filter((c) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      if (query !== "") {
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesPhone = c.phone.includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }

      // 2. Status Filter
      if (statusFilter === "Debtor" && c.balance <= 0) return false;
      if (statusFilter === "Cleared" && c.balance > 0) return false;

      // 3. Risk Filter
      if (riskFilter !== "All" && c.riskStatus !== riskFilter) return false;

      return true;
    });
  }, [enrichedCustomers, searchQuery, statusFilter, riskFilter]);

  // ----------------------------------------------------
  // CHART DATA GENERATION
  // ----------------------------------------------------
  
  // 1. Monthly Lending vs Recovery trend (6-Month scale)
  const trendChartData = useMemo(() => {
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const monthIndex = { "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul" };
    
    // Initialize months structure
    const monthlyStats = months.map(m => ({ month: m, Lent: 0, Recovered: 0 }));

    enrichedCustomers.forEach((c) => {
      c.transactions.forEach((tx) => {
        const dateParts = tx.date.split("-");
        const monthKey = dateParts[1];
        const monthLabel = monthIndex[monthKey];
        if (monthLabel) {
          const index = monthlyStats.findIndex(m => m.month === monthLabel);
          if (index !== -1) {
            if (tx.type === "LENT") {
              monthlyStats[index].Lent += tx.amount;
            } else if (tx.type === "PAID") {
              monthlyStats[index].Recovered += tx.amount;
            }
          }
        }
      });
    });

    return monthlyStats;
  }, [enrichedCustomers]);

  // 2. Debt Ageing / Risk Breakdown
  const ageingChartData = useMemo(() => {
    let safeSum = 0;
    let warningSum = 0;
    let criticalSum = 0;

    enrichedCustomers.forEach((c) => {
      if (c.balance > 0) {
        if (c.riskStatus === "Critical") criticalSum += c.balance;
        else if (c.riskStatus === "Warning") warningSum += c.balance;
        else safeSum += c.balance;
      }
    });

    return [
      { name: "Safe Ledger", value: safeSum, color: "#10b981" },
      { name: "Warning (30+ Days / 60% Credit)", value: warningSum, color: "#f59e0b" },
      { name: "Critical (45+ Days / 90% Credit)", value: criticalSum, color: "#ef4444" }
    ].filter(item => item.value > 0);
  }, [enrichedCustomers]);

  // ----------------------------------------------------
  // EVENT HANDLERS & FORM SUBMISSIONS
  // ----------------------------------------------------
  
  // Reset filter selections
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setRiskFilter("All");
  };

  // Add Customer Form Validation & Action
  const handleAddCustomer = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newCustName.trim()) errors.name = "Customer name is required";
    if (!newCustPhone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(newCustPhone.trim())) {
      errors.phone = "Must be a 10-digit number";
    }
    if (newCustLimit <= 0) errors.limit = "Credit limit must be greater than zero";

    if (Object.keys(errors).length > 0) {
      setCustFormErrors(errors);
      return;
    }

    const newCustomer = {
      id: "cust-" + Date.now(),
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: newCustEmail.trim() || "N/A",
      creditLimit: parseFloat(newCustLimit),
      joined: new Date().toISOString().split("T")[0],
      notes: newCustNotes.trim() || "No notes provided.",
      transactions: []
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setIsAddCustomerOpen(false);
    addNotification(`Added customer "${newCustomer.name}" successfully`, "success");
    
    // Reset Form
    setNewCustName("");
    setNewCustPhone("");
    setNewCustEmail("");
    setNewCustLimit(10000);
    setNewCustNotes("");
    setCustFormErrors({});
  };

  // Lending Autocomplete / Multiple items adding helper
  const handleAddLendItem = (product) => {
    const existing = selectedLendItems.find(item => item.product.id === product.id);
    if (existing) {
      setSelectedLendItems(
        selectedLendItems.map(item =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setSelectedLendItems([...selectedLendItems, { product, qty: 1 }]);
    }
  };

  const handleUpdateLendItemQty = (productId, newQty) => {
    if (newQty <= 0) {
      setSelectedLendItems(selectedLendItems.filter(item => item.product.id !== productId));
    } else {
      setSelectedLendItems(
        selectedLendItems.map(item =>
          item.product.id === productId ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  // Auto calculate sum of lending items
  const lendItemsTotal = useMemo(() => {
    return selectedLendItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }, [selectedLendItems]);

  // Sync total into txAmount input if items change in LENT mode
  useEffect(() => {
    if (txType === "LENT" && selectedLendItems.length > 0) {
      setTxAmount(lendItemsTotal.toString());
      const itemsList = selectedLendItems.map(item => `${item.qty}x ${item.product.name}`).join(", ");
      setTxDesc(`Lent: ${itemsList}`);
    }
  }, [selectedLendItems, txType, lendItemsTotal]);

  // Submit Transaction
  const handleRecordTransaction = (e) => {
    e.preventDefault();
    const errors = {};
    if (!selectedCustomerId) errors.customer = "Please select a customer";
    if (!txAmount || parseFloat(txAmount) <= 0) errors.amount = "Please enter a valid positive amount";
    if (!txDate) errors.date = "Please select a transaction date";
    if (txType === "LENT" && selectedLendItems.length === 0 && !txDesc.trim()) {
      errors.desc = "Provide description of products lent";
    }
    if (txType === "PAID" && !txDesc.trim()) {
      errors.desc = "Payment description is required";
    }

    // Check Credit Limit alert if Lending
    const targetCust = enrichedCustomers.find(c => c.id === selectedCustomerId);
    if (txType === "LENT" && targetCust) {
      const potentialNewBalance = targetCust.balance + parseFloat(txAmount);
      if (potentialNewBalance > targetCust.creditLimit) {
        // Warning inside form errors (requires override or notice)
        errors.limitWarning = `Warning: Owed balance ($${potentialNewBalance}) will exceed credit limit ($${targetCust.creditLimit})`;
      }
    }

    // If there are errors (ignoring credit limit warning, which is only a note, not block, but let's make it a warning unless user is okay)
    if (Object.keys(errors).filter(key => key !== 'limitWarning').length > 0) {
      setTxFormErrors(errors);
      return;
    }

    const newTx = {
      id: "tx-" + Date.now(),
      date: txDate,
      type: txType,
      amount: parseFloat(txAmount),
      description: txDesc.trim() || (txType === "LENT" ? "Lent products" : "Payment received"),
      ...(txType === "PAID" ? { method: txMethod } : {})
    };

    // Update customer list
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === selectedCustomerId) {
          return {
            ...c,
            transactions: [...c.transactions, newTx]
          };
        }
        return c;
      })
    );

    setIsRecordTxOpen(false);
    addNotification(
      `Recorded ${txType === "LENT" ? "credit lend of" : "payment receipt of"} $${newTx.amount} for ${targetCust?.name}`,
      txType === "LENT" ? "info" : "success"
    );

    // Reset Form states
    setTxAmount("");
    setTxDesc("");
    setSelectedLendItems([]);
    setTxFormErrors({});
  };

  // Quick Action: open Record Tx with pre-filled customer and type
  const openQuickTx = (customerId, type) => {
    setSelectedCustomerId(customerId);
    setTxType(type);
    setIsRecordTxOpen(true);
    // Pre-fill payment description
    if (type === "PAID") {
      setTxDesc("Payment received");
    }
  };

  // Delete transaction logic (inside drawer statement timeline)
  const handleDeleteTransaction = (customerId, txId) => {
    if (window.confirm("Are you sure you want to delete this transaction from the ledger?")) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customerId) {
            return {
              ...c,
              transactions: c.transactions.filter((tx) => tx.id !== txId)
            };
          }
          return c;
        })
      );
      addNotification("Transaction deleted from ledger", "danger");
    }
  };

  // Delete customer account
  const handleDeleteCustomer = (customerId) => {
    const target = customers.find(c => c.id === customerId);
    if (window.confirm(`Are you sure you want to remove the ledger account of "${target?.name}"? All transaction logs will be permanently deleted.`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      if (drawerCustomer && drawerCustomer.id === customerId) {
        setDrawerCustomer(null);
      }
      addNotification(`Deleted customer "${target?.name}"`, "danger");
    }
  };

  // WhatsApp Reminder Generator
  const sendWhatsAppReminder = (customer) => {
    const shopName = "Accessories & Jewelers ERP";
    const message = `Dear ${customer.name},

This is a friendly reminder regarding your outstanding balance of $${customer.balance.toLocaleString()} with ${shopName}. 

Please clear the pending ledger amount at your earliest convenience. You can pay via UPI, Card, or Cash at our counter.

Thank you for your continued support!
- ${shopName}`;

    // Encode message
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${customer.phone}?text=${encodedText}`;
    
    // Open in new window
    window.open(whatsappUrl, "_blank");
    addNotification(`WhatsApp reminder initialized for ${customer.name}`, "success");
  };

  // Mock Print Invoice/Ledger
  const triggerPrintLedger = (customer) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Ledger Statement - ${customer.name}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #333; }
            h2 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 5px; }
            .header-info { margin-bottom: 30px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total { font-weight: bold; font-size: 1.1em; border-top: 2px solid #000; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body onload="window.print();">
          <h2>LEDGER ACCOUNT STATEMENT</h2>
          <div class="header-info">
            <strong>Customer:</strong> ${customer.name}<br/>
            <strong>Phone:</strong> ${customer.phone}<br/>
            <strong>Email:</strong> ${customer.email}<br/>
            <strong>Limit:</strong> $${customer.creditLimit}<br/>
            <strong>Statement Date:</strong> ${new Date().toLocaleDateString()}<br/>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th class="text-right">Debit (Lent)</th>
                <th class="text-right">Credit (Paid)</th>
                <th class="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let currentBal = 0;
                return customer.transactions.map((tx) => {
                  if (tx.type === "LENT") currentBal += tx.amount;
                  else currentBal -= tx.amount;
                  return `
                    <tr>
                      <td>${new Date(tx.date).toLocaleDateString()}</td>
                      <td>${tx.type}</td>
                      <td>${tx.description}</td>
                      <td class="text-right">${tx.type === "LENT" ? "$" + tx.amount.toFixed(2) : "-"}</td>
                      <td class="text-right">${tx.type === "PAID" ? "$" + tx.amount.toFixed(2) : "-"}</td>
                      <td class="text-right">$${currentBal.toFixed(2)}</td>
                    </tr>
                  `;
                }).join("");
              })()}
              <tr class="total">
                <td colspan="3">Outstanding Net Balance</td>
                <td colspan="3" class="text-right">$${customer.balance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    addNotification(`Generated printable ledger statement`, "info");
  };

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in pb-16">
      


      {/* ----------------------------------------------------
          1. HEADER PANEL & QUICK ACTIONS
          ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Udhaar & Ledgers</h1>
          <span className="bg-rose-50 text-rose-700 font-semibold px-3 py-1 rounded-full text-xs hover:bg-rose-100/80 transition-colors">
            {stats.totalDebtorsCount} active debtors
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCustomerId("");
              setTxType("LENT");
              setIsRecordTxOpen(true);
            }}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all hover:shadow-md cursor-pointer"
          >
            <ArrowUpRight size={18} />
            <span>Lend Items (Credit)</span>
          </button>
          
          <button
            onClick={() => {
              setSelectedCustomerId("");
              setTxType("PAID");
              setIsRecordTxOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all hover:shadow-md cursor-pointer"
          >
            <ArrowDownRight size={18} />
            <span>Receive Payment</span>
          </button>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all hover:shadow-md cursor-pointer"
          >
            <UserPlus size={18} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. KPI CARDS
          ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outstanding Credit */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Outstanding</span>
            <span className="text-3xl font-extrabold text-rose-600">${stats.totalOutstanding.toLocaleString()}</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span className="font-semibold text-rose-500 flex items-center">
                <TrendingUp size={12} className="mr-0.5" />
                Active
              </span>
              <span>accounts ledger debt</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Recovered This Month */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Recovered (Jul)</span>
            <span className="text-3xl font-extrabold text-emerald-600">${stats.currentMonthRecovered.toLocaleString()}</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span className="font-semibold text-emerald-500 flex items-center">
                <TrendingDown size={12} className="mr-0.5" />
                Collected
              </span>
              <span>overall: ${stats.totalRecovered.toLocaleString()}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Total Debtors count */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Debtor Accounts</span>
            <span className="text-3xl font-extrabold text-slate-800">{stats.totalDebtorsCount}</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span>Out of {customers.length} total customers</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users size={24} />
          </div>
        </div>

        {/* Overdue / High Risk warnings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">High Risk Accounts</span>
            <span className={`text-3xl font-extrabold ${stats.highRiskCount > 0 ? "text-amber-600" : "text-slate-800"}`}>
              {stats.highRiskCount}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <AlertTriangle size={12} className={stats.highRiskCount > 0 ? "text-amber-500" : "text-slate-400"} />
              <span>Unpaid &gt; 45 days or &gt;90% limit</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.highRiskCount > 0 ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"}`}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          3. ANALYTICAL CHARTS
          ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar/Area chart: Monthly Lending vs Recovery */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-slate-800">Lending vs. Recovery History</h3>
              <span className="text-xs text-slate-400">Monthly breakdown of credits lent vs payments received</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Credit Lent</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Recovered</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} 
                  labelClassName="font-semibold text-slate-800"
                />
                <Area type="monotone" dataKey="Lent" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorLent)" name="Lent ($)" />
                <Area type="monotone" dataKey="Recovered" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRecovered)" name="Recovered ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: Outstanding Balance Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-slate-800">Outstanding Aging & Risk</h3>
            <span className="text-xs text-slate-400">Ledger breakdown by account risk level</span>
          </div>
          
          {ageingChartData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Activity size={32} className="text-slate-300 mb-2" />
              <span className="text-sm font-medium">No outstanding balances</span>
              <span className="text-xs">All ledgers are currently fully cleared.</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageingChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ageingChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => [`$${val.toLocaleString()}`, "Outstanding"]}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unpaid Total</span>
                  <span className="text-xl font-extrabold text-slate-800">${stats.totalOutstanding.toLocaleString()}</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="w-full flex flex-col gap-2">
                {ageingChartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] text-slate-500 font-medium">{item.name}</span>
                    </span>
                    <span>${item.value.toLocaleString()} ({Math.round(item.value / stats.totalOutstanding * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------
          4. CUSTOMER LEDGER WORKBENCH (TOOLBAR & TABLE)
          ---------------------------------------------------- */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm" ref={dropdownRef}>
        
        {/* Filters Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-extrabold text-slate-800">Ledger Accounts</h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredCustomers.length} accounts
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-slate-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Balance Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
                className={`border rounded-xl px-4 py-2 text-slate-700 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  statusFilter !== "All"
                    ? "border-indigo-500 ring-2 ring-indigo-500/10 text-indigo-700 bg-indigo-50/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>Balance: {statusFilter}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "status" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "status" && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                  {["All", "Debtor", "Cleared"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-semibold transition-colors"
                    >
                      <span>{status === "Debtor" ? "Has Outstanding" : status === "Cleared" ? "Fully Cleared" : "All Balances"}</span>
                      {statusFilter === status && <Check size={14} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Risk Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "risk" ? null : "risk")}
                className={`border rounded-xl px-4 py-2 text-slate-700 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  riskFilter !== "All"
                    ? "border-indigo-500 ring-2 ring-indigo-500/10 text-indigo-700 bg-indigo-50/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>Risk: {riskFilter}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "risk" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "risk" && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                  {["All", "Safe", "Warning", "Critical"].map((risk) => (
                    <button
                      key={risk}
                      onClick={() => {
                        setRiskFilter(risk);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-semibold transition-colors"
                    >
                      <span className="capitalize">{risk}</span>
                      {riskFilter === risk && <Check size={14} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(searchQuery !== "" || statusFilter !== "All" || riskFilter !== "All") && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <Users className="text-slate-300" size={40} />
              <p className="text-sm font-bold text-slate-700 mt-2">No matching ledger accounts</p>
              <p className="text-xs text-slate-400">Try modifying your search or filters to see customer accounts.</p>
              <button
                onClick={handleClearFilters}
                className="mt-2 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-5">Customer Account</th>
                  <th className="py-3.5 px-5">Outstanding Balance</th>
                  <th className="py-3.5 px-5">Credit limit utilization</th>
                  <th className="py-3.5 px-5">Last activity Log</th>
                  <th className="py-3.5 px-5">Risk rating</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const avatarColor = cust.balance > 0 
                    ? cust.riskStatus === "Critical" ? "bg-rose-100 text-rose-700" 
                      : cust.riskStatus === "Warning" ? "bg-amber-100 text-amber-700"
                      : "bg-orange-100 text-orange-700"
                    : "bg-emerald-100 text-emerald-700";

                  const initial = cust.name.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-slate-50/40 transition-colors group cursor-pointer"
                      onClick={() => setDrawerCustomer(cust)}
                    >
                      {/* Name & contact */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarColor} transition-transform group-hover:scale-105`}>
                            {initial}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{cust.name}</span>
                            <span className="text-xs text-slate-400 font-medium">{cust.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Outstanding Balance */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col">
                          {cust.balance > 0 ? (
                            <span className="text-sm font-extrabold text-rose-600">${cust.balance.toLocaleString()}</span>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle size={14} /> Clear Ledger
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">Limit: ${cust.creditLimit.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Progress Bar Limit Utilization */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-1.5 w-36">
                          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                            <span>{Math.round(cust.utilization)}% used</span>
                            <span>${(cust.creditLimit - cust.balance).toLocaleString()} free</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                cust.riskStatus === "Critical"
                                  ? "bg-rose-500"
                                  : cust.riskStatus === "Warning"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(cust.utilization, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Last Activity Log */}
                      <td className="py-4 px-5">
                        <span className="text-xs font-semibold text-slate-500 leading-relaxed block max-w-xs truncate">
                          {cust.lastActivityText}
                        </span>
                      </td>

                      {/* Risk Badge */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            cust.balance === 0
                              ? "bg-slate-50 text-slate-400 border border-slate-200/50"
                              : cust.riskStatus === "Critical"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : cust.riskStatus === "Warning"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cust.balance === 0 
                              ? "bg-slate-300"
                              : cust.riskStatus === "Critical"
                              ? "bg-rose-500"
                              : cust.riskStatus === "Warning"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`} />
                          {cust.balance === 0 ? "Settled" : cust.riskStatus}
                        </span>
                      </td>

                      {/* Table row actions */}
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openQuickTx(cust.id, "LENT")}
                            title="Lend product on credit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                          >
                            <ArrowUpRight size={16} />
                          </button>
                          
                          <button
                            onClick={() => openQuickTx(cust.id, "PAID")}
                            title="Receive cash payment"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                          >
                            <ArrowDownRight size={16} />
                          </button>

                          {cust.balance > 0 && (
                            <button
                              onClick={() => sendWhatsAppReminder(cust)}
                              title="Send WhatsApp payment reminder"
                              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer"
                            >
                              <Send size={14} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteCustomer(cust.id)}
                            title="Delete customer ledger"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            onClick={() => setDrawerCustomer(cust)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------
          5. CUSTOMER PROFILE / LEDGER TIMELINE STATEMENT DRAWER
          ---------------------------------------------------- */}
      {drawerCustomer && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Overlay Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setDrawerCustomer(null)}
          />

          {/* Drawer Element */}
          <div className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col z-50 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                  drawerCustomer.balance > 0 
                    ? drawerCustomer.riskStatus === "Critical" ? "bg-rose-100 text-rose-700"
                      : drawerCustomer.riskStatus === "Warning" ? "bg-amber-100 text-amber-700"
                      : "bg-orange-100 text-orange-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {drawerCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-extrabold text-slate-800">{drawerCustomer.name}</h2>
                  <span className="text-xs text-slate-500 font-medium">Joined on {new Date(drawerCustomer.joined).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerPrintLedger(drawerCustomer)}
                  title="Print Ledger Report"
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <Printer size={16} />
                </button>
                {drawerCustomer.balance > 0 && (
                  <button
                    onClick={() => sendWhatsAppReminder(drawerCustomer)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Send Reminder</span>
                  </button>
                )}
                <button
                  onClick={() => setDrawerCustomer(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Body Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Account Quick Stats Dashboard */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding</span>
                  <span className={`text-xl font-black ${drawerCustomer.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    ${drawerCustomer.balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col border-x border-slate-200 px-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Borrowed</span>
                  <span className="text-xl font-bold text-slate-700">${drawerCustomer.totalLent.toLocaleString()}</span>
                </div>
                <div className="flex flex-col pl-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Repaid</span>
                  <span className="text-xl font-bold text-emerald-600">${drawerCustomer.totalPaid.toLocaleString()}</span>
                </div>
              </div>

              {/* Credit Limit Indicator Card */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    Credit Limit Status
                    <Info size={12} className="text-slate-400" />
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Limit: <span className="font-bold text-slate-800">${drawerCustomer.creditLimit.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      drawerCustomer.riskStatus === "Critical"
                        ? "bg-rose-500"
                        : drawerCustomer.riskStatus === "Warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(drawerCustomer.utilization, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">{Math.round(drawerCustomer.utilization)}% credit used</span>
                  {drawerCustomer.balance > drawerCustomer.creditLimit ? (
                    <span className="text-rose-500 font-bold">Credit Limit Overrun!</span>
                  ) : (
                    <span className="text-slate-500">${(drawerCustomer.creditLimit - drawerCustomer.balance).toLocaleString()} available credit</span>
                  )}
                </div>
              </div>

              {/* Customer Info / Profile Card */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Profile</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium border border-slate-100 rounded-2xl p-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-[10px] uppercase">Phone Number</span>
                    <span className="text-slate-700 font-bold flex items-center gap-1">
                      <PhoneCall size={12} className="text-slate-400" /> {drawerCustomer.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-[10px] uppercase">Email Address</span>
                    <span className="text-slate-700 font-bold break-all">{drawerCustomer.email}</span>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5 border-t border-slate-50 pt-3">
                    <span className="text-slate-400 text-[10px] uppercase">Internal Notes</span>
                    <span className="text-slate-600 leading-relaxed font-semibold italic">{drawerCustomer.notes}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Logs (Timeline statement) */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ledger Statement Timeline</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCustomerId(drawerCustomer.id);
                        setTxType("LENT");
                        setIsRecordTxOpen(true);
                      }}
                      className="bg-rose-50 hover:bg-rose-100/80 text-rose-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                    >
                      + Lend Credit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomerId(drawerCustomer.id);
                        setTxType("PAID");
                        setIsRecordTxOpen(true);
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-colors cursor-pointer"
                    >
                      + Rec Payment
                    </button>
                  </div>
                </div>

                {drawerCustomer.transactions.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5">
                    <FileText size={28} className="text-slate-300" />
                    <span>No ledger logs recorded for this account.</span>
                    <span>Click options above to register loans or cash ins.</span>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l border-slate-100 ml-3.5 flex flex-col gap-6">
                    {/* Reverse map to show newest first */}
                    {[...drawerCustomer.transactions].reverse().map((tx, idx) => {
                      const isLent = tx.type === "LENT";
                      const typeIconColor = isLent 
                        ? "bg-rose-50 text-rose-600 border border-rose-100" 
                        : "bg-emerald-50 text-emerald-600 border border-emerald-100";
                      
                      const dateObj = new Date(tx.date);
                      const displayDate = dateObj.toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric", 
                        year: "numeric" 
                      });

                      return (
                        <div key={tx.id} className="relative group/timeline">
                          {/* Circle dot on left timeline */}
                          <div className={`absolute -left-9.5 top-1.5 w-7 h-7 rounded-full flex items-center justify-center z-10 text-xs font-bold ${typeIconColor}`}>
                            {isLent ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </div>

                          <div className="border border-slate-100 hover:border-slate-200/80 rounded-2xl p-4 bg-slate-50/20 hover:bg-slate-50/40 transition-colors relative">
                            {/* Delete specific transaction button */}
                            <button
                              onClick={() => handleDeleteTransaction(drawerCustomer.id, tx.id)}
                              className="absolute top-4 right-4 opacity-0 group-hover/timeline:opacity-100 text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Delete transaction log"
                            >
                              <Trash2 size={12} />
                            </button>

                            <div className="flex justify-between items-start gap-4 pr-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isLent ? "bg-rose-50/80 text-rose-700" : "bg-emerald-50/80 text-emerald-700"}`}>
                                    {isLent ? "CREDIT LENT" : "CASH PAID"}
                                  </span>
                                  {!isLent && tx.method && (
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                      {tx.method}
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm font-bold text-slate-700 leading-normal mt-1">
                                  {tx.description}
                                </span>
                              </div>
                              <div className="text-right flex flex-col">
                                <span className={`text-base font-extrabold ${isLent ? "text-rose-600" : "text-emerald-600"}`}>
                                  {isLent ? "+" : "-"}${tx.amount.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{displayDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          6. ADD CUSTOMER MODAL
          ---------------------------------------------------- */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsAddCustomerOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full z-10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <UserPlus className="text-indigo-600" /> Add New Customer Ledger
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 flex flex-col gap-4">
              {/* Customer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={newCustName}
                  onChange={(e) => {
                    setNewCustName(e.target.value);
                    if (custFormErrors.name) setCustFormErrors({ ...custFormErrors, name: null });
                  }}
                  className={`px-4 py-2.5 text-sm bg-slate-50/30 border rounded-xl outline-none focus:bg-white focus:ring-2 transition-all font-medium text-slate-700 ${
                    custFormErrors.name ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {custFormErrors.name && <span className="text-[11px] text-rose-500 font-semibold">{custFormErrors.name}</span>}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number (10 digits)</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={newCustPhone}
                  onChange={(e) => {
                    setNewCustPhone(e.target.value);
                    if (custFormErrors.phone) setCustFormErrors({ ...custFormErrors, phone: null });
                  }}
                  className={`px-4 py-2.5 text-sm bg-slate-50/30 border rounded-xl outline-none focus:bg-white focus:ring-2 transition-all font-medium text-slate-700 ${
                    custFormErrors.phone ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {custFormErrors.phone && <span className="text-[11px] text-rose-500 font-semibold">{custFormErrors.phone}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. rajesh@gmail.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="px-4 py-2.5 text-sm bg-slate-50/30 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Credit limit */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ledger Credit Limit ($)</label>
                  <span className="text-[10px] text-slate-400 font-semibold">Maximum debt allowed</span>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={newCustLimit}
                  onChange={(e) => {
                    setNewCustLimit(e.target.value);
                    if (custFormErrors.limit) setCustFormErrors({ ...custFormErrors, limit: null });
                  }}
                  className={`px-4 py-2.5 text-sm bg-slate-50/30 border rounded-xl outline-none focus:bg-white focus:ring-2 transition-all font-medium text-slate-700 ${
                    custFormErrors.limit ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {custFormErrors.limit && <span className="text-[11px] text-rose-500 font-semibold">{custFormErrors.limit}</span>}
              </div>

              {/* Remarks/Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Internal Notes / Payment Terms</label>
                <textarea
                  placeholder="e.g. regular buyer, works in bank, prefers UPI reminders..."
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  rows={2}
                  className="px-4 py-2.5 text-sm bg-slate-50/30 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 mt-4 border-t border-slate-50 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          7. RECORD TRANSACTION (LEND / PAY) MODAL
          ---------------------------------------------------- */}
      {isRecordTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsRecordTxOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full z-10 overflow-hidden">
            
            {/* Modal Header containing Mode tabs */}
            <div className="border-b border-slate-100 flex flex-col bg-slate-50/50">
              <div className="p-5 flex items-center justify-between pb-3">
                <h3 className="text-lg font-extrabold text-slate-800">Record Ledger Transaction</h3>
                <button
                  onClick={() => setIsRecordTxOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* LENT vs PAID tabs */}
              <div className="flex border-t border-slate-100 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setTxType("LENT");
                    setTxFormErrors({});
                  }}
                  className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
                    txType === "LENT"
                      ? "border-rose-600 text-rose-700 bg-rose-50/10"
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                  }`}
                >
                  <ArrowUpRight size={16} />
                  LEND PRODUCTS (Credit extended)
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setTxType("PAID");
                    setTxFormErrors({});
                  }}
                  className={`flex-1 py-3 text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
                    txType === "PAID"
                      ? "border-emerald-600 text-emerald-700 bg-emerald-50/10"
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                  }`}
                >
                  <ArrowDownRight size={16} />
                  RECEIVE PAYMENT (Cash in)
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRecordTransaction} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              
              {/* Select Customer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    if (txFormErrors.customer) setTxFormErrors({ ...txFormErrors, customer: null });
                  }}
                  className={`px-4 py-2.5 text-sm bg-slate-50/30 border rounded-xl outline-none focus:bg-white focus:ring-2 font-medium text-slate-700 transition-all ${
                    txFormErrors.customer ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                >
                  <option value="">-- Choose Customer --</option>
                  {enrichedCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - Bal: ${c.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
                {txFormErrors.customer && <span className="text-[11px] text-rose-500 font-semibold">{txFormErrors.customer}</span>}
              </div>

              {/* LEND SPECIFIC INPUTS: Inventory Picker */}
              {txType === "LENT" && (
                <div className="flex flex-col gap-2.5 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pick Lent Products from Stock</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Selects items automatically</span>
                  </div>
                  
                  {/* Stock Grid list */}
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-white">
                    {SHOP_PRODUCTS.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleAddLendItem(prod)}
                        className="text-xs bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>{prod.name}</span>
                        <span className="text-[10px] text-indigo-600 font-bold">${prod.price}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Items summary */}
                  {selectedLendItems.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Selected Lending cart</span>
                      <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto">
                        {selectedLendItems.map((item) => (
                          <div key={item.product.id} className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-700">{item.product.name} (${item.product.price})</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateLendItemQty(item.product.id, item.qty - 1)}
                                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-slate-800">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateLendItemQty(item.product.id, item.qty + 1)}
                                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                              >
                                +
                              </button>
                              <span className="w-12 text-right text-rose-600 font-bold">${item.product.price * item.qty}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs font-extrabold">
                        <span className="text-slate-600">Calculated Debt Total</span>
                        <span className="text-rose-600">${lendItemsTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic credit limit warning */}
              {txType === "LENT" && selectedCustomerId && (
                (() => {
                  const currCust = enrichedCustomers.find(c => c.id === selectedCustomerId);
                  if (currCust) {
                    const potential = currCust.balance + (parseFloat(txAmount) || 0);
                    const over = potential > currCust.creditLimit;
                    return (
                      <div className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                        over 
                          ? "bg-rose-50 text-rose-800 border-rose-100" 
                          : "bg-emerald-50 text-emerald-800 border-emerald-100"
                      }`}>
                        <AlertCircle size={16} className={`shrink-0 ${over ? "text-rose-500" : "text-emerald-500"}`} />
                        <div className="flex-1 flex flex-col gap-0.5">
                          {over ? (
                            <>
                              <span>WARNING: Owed balance ($${potential.toLocaleString()}) will overrun their credit limit of $${currCust.creditLimit.toLocaleString()}.</span>
                              <span className="text-[10px] font-bold text-rose-600">Consider upgrading their credit limit first.</span>
                            </>
                          ) : (
                            <span>Credit available: Safe. Customer will occupy ${potential.toLocaleString()} of their $${currCust.creditLimit.toLocaleString()} limit.</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()
              )}

              {/* Transaction Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {txType === "LENT" ? "Credit Amount Lent ($)" : "Cash Amount Received ($)"}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={txAmount}
                  onChange={(e) => {
                    setTxAmount(e.target.value);
                    if (txFormErrors.amount) setTxFormErrors({ ...txFormErrors, amount: null });
                  }}
                  className={`px-4 py-2.5 text-sm bg-slate-50/30 border rounded-xl outline-none focus:bg-white focus:ring-2 font-semibold text-slate-700 transition-all ${
                    txFormErrors.amount ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {txFormErrors.amount && <span className="text-[11px] text-rose-500 font-semibold">{txFormErrors.amount}</span>}
              </div>

              {/* Transaction Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Transaction Date</label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="px-4 py-2.5 text-sm bg-slate-50/30 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer"
                />
              </div>

              {/* Payment Mode Selector (Only on PAID) */}
              {txType === "PAID" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["UPI", "Cash", "Card", "Bank Transfer"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setTxMethod(method)}
                        className={`py-2 text-xs font-bold border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          txMethod === method
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/10"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        {method === "Card" && <CreditCard size={14} />}
                        <span>{method}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description/Remarks */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Description / Items Borrowed
                </label>
                <input
                  type="text"
                  placeholder={txType === "LENT" ? "e.g. Lent 2x Diamond heart, 1x ring" : "e.g. Settled part payment via GPay"}
                  value={txDesc}
                  onChange={(e) => {
                    setTxDesc(e.target.value);
                    if (txFormErrors.desc) setTxFormErrors({ ...txFormErrors, desc: null });
                  }}
                  className={`px-4 py-2.5 text-sm bg-slate-50/30 border rounded-xl outline-none focus:bg-white focus:ring-2 font-medium text-slate-700 transition-all ${
                    txFormErrors.desc ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {txFormErrors.desc && <span className="text-[11px] text-rose-500 font-semibold">{txFormErrors.desc}</span>}
              </div>

              {/* Submit Action Buttons */}
              <div className="flex justify-end gap-3 mt-4 border-t border-slate-50 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRecordTxOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 font-bold text-sm text-white rounded-xl transition-all shadow-md cursor-pointer ${
                    txType === "LENT" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Record {txType === "LENT" ? "Lend credit" : "Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Udhaar;