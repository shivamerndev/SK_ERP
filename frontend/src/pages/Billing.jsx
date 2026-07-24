import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Save,
  RotateCcw,
  Search,
  History,
  User,
  Calculator,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// ----------------------------------------------------
// HELPER CALCULATORS
// ----------------------------------------------------

// Safe parser for Panni Detail (e.g. 8*2.7+49*2.3 or 4*2.4)
const parsePanniDetail = (val) => {
  const clean = String(val || "").replace(/\s+/g, "");
  if (!clean) return null;
  
  try {
    const terms = clean.split("+");
    let total = 0;
    for (let term of terms) {
      if (term.includes("*")) {
        const factorParts = term.split("*");
        if (factorParts.length !== 2) return null;
        const f1 = parseFloat(factorParts[0]);
        const f2 = parseFloat(factorParts[1]);
        if (isNaN(f1) || isNaN(f2)) return null;
        total += f1 * f2;
      } else {
        const val = parseFloat(term);
        if (isNaN(val)) return null;
        total += val;
      }
    }
    return Math.round(total);
  } catch (e) {
    return null;
  }
};

// Labor Amount Calculator: parse expression or scale rate
const calculateRowLabor = (netWt, lab) => {
  const clean = String(lab || "").replace(/\s+/g, "");
  if (!clean) return 0;
  
  if (clean.includes("*")) {
    const parts = clean.split("*");
    if (parts.length === 2) {
      const a = parseFloat(parts[0]);
      const b = parseFloat(parts[1]);
      if (!isNaN(a) && !isNaN(b)) {
        return Math.round(a * b);
      }
    }
  }
  
  const r = parseFloat(clean);
  if (isNaN(r)) return 0;
  return Math.round((netWt * r) / 1000);
};

// ----------------------------------------------------
// DEFAULT SEED BILL (MATCHES REFERENCE JPEG EXACTLY)
// ----------------------------------------------------
const SEED_BILL = {
  id: "bill-seed-79",
  billNo: "79",
  customerName: "VIKASH BHAGAT JI JAMUI",
  customerPhone: "9876543210",
  customerAddress: "Jamui",
  date: "2026-06-24",
  time: "09:21 PM",
  topHeader: "|| SHREE GANESHAYAA NAMAH ||",
  title: "ROUGH ESTIMATE",
  items: [
    { item: "OP* KATORI", weight: "101", panniDetail: "", less: "0", netWt: 101, tunch: "50", lab: "850", amount: 86, fine: 51 },
    { item: "PS DLX", weight: "3168", panniDetail: "8*2.7+49*2.3", less: "134", netWt: 3034, tunch: "56.5", lab: "", amount: 0, fine: 1714 },
    { item: "SM 70 PAYAL", weight: "126", panniDetail: "4*2.4", less: "10", netWt: 116, tunch: "55", lab: "", amount: 0, fine: 64 },
    { item: "BMP LX KANGNI", weight: "72", panniDetail: "25", less: "25", netWt: 47, tunch: "64", lab: "6000", amount: 282, fine: 30 },
    { item: "SPJ MICRO BICHIYA", weight: "122", panniDetail: "11", less: "11", netWt: 111, tunch: "60", lab: "3800", amount: 422, fine: 67 },
    { item: "SPJ SADA BICHIYA", weight: "96", panniDetail: "8", less: "8", netWt: 88, tunch: "60", lab: "2500", amount: 220, fine: 53 },
    { item: "BMP 60 BICHIYA", weight: "92", panniDetail: "3", less: "3", netWt: 89, tunch: "56", lab: "2500", amount: 223, fine: 50 },
    { item: "MICRO BICHIYA", weight: "96", panniDetail: "6", less: "6", netWt: 90, tunch: "56", lab: "4000", amount: 360, fine: 50 },
    { item: "MIX RING", weight: "37", panniDetail: "3.4", less: "3", netWt: 34, tunch: "65", lab: "17*12", amount: 204, fine: 22 },
    { item: "SS NICE GOT", weight: "500", panniDetail: "", less: "0", netWt: 500, tunch: "60", lab: "800", amount: 400, fine: 300 }
  ],
  totals: {
    weight: 4410,
    less: 200,
    netWt: 4210,
    amount: 2197,
    fine: 2401
  },
  lastBalance: {
    amount: 0,
    fine: 0
  },
  jamaDetail: {
    details: "KACHHI/807",
    weight: 3528,
    netWt: 3528,
    tunch: "45.5",
    fine: 1605,
    amount: 0
  },
  finalBaki: {
    amount: 2197,
    fine: 796
  },
  postedToUdhaar: false
};

const EMPTY_ROW = {
  item: "",
  weight: "",
  panniDetail: "",
  less: "",
  netWt: 0,
  tunch: "",
  lab: "",
  amount: 0,
  fine: 0
};

const Billing = () => {

  
  // Data Sources
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("erp_bills");
    return saved ? JSON.parse(saved) : [SEED_BILL];
  });
  
  // Form State - Invoice Metadata
  const [billNo, setBillNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [topHeader, setTopHeader] = useState("|| SHREE GANESHAYAA NAMAH ||");
  const [billTitle, setBillTitle] = useState("ROUGH ESTIMATE");
  
  // Form State - Bill Items Grid
  const [items, setItems] = useState([{ ...EMPTY_ROW }]);
  
  // Form State - Adjustments & Jama
  const [lastBalanceAmount, setLastBalanceAmount] = useState("");
  const [lastBalanceFine, setLastBalanceFine] = useState("");
  
  const [jamaDetails, setJamaDetails] = useState("");
  const [jamaWeight, setJamaWeight] = useState("");
  const [jamaNetWt, setJamaNetWt] = useState("");
  const [jamaTunch, setJamaTunch] = useState("");
  const [jamaAmount, setJamaAmount] = useState(""); // Cash deposit
  
  // Options
  const [postToLedger, setPostToLedger] = useState(true);
  
  const [previewBill, setPreviewBill] = useState(null);
  
  // Autocomplete UI status
  const [custSearchFocused, setCustSearchFocused] = useState(false);
  const [itemSearchFocused, setItemSearchFocused] = useState(null); // row index
  const custDropdownRef = useRef(null);
  const itemDropdownRefs = useRef({});
  
  // Toast notifications
  const [notifications, setNotifications] = useState([]);

  // ----------------------------------------------------
  // LOAD SEED/EXTERNAL DATA
  // ----------------------------------------------------
  useEffect(() => {
    const rawCustomers = localStorage.getItem("erp_udhaar_customers");
    if (rawCustomers) {
      setCustomers(JSON.parse(rawCustomers));
    }
    const rawProducts = localStorage.getItem("erp_products");
    if (rawProducts) {
      setProducts(JSON.parse(rawProducts));
    }
    
    // Set current time
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      setTime(`${String(hours).padStart(2, "0")}:${minutes} ${ampm}`);
    };
    updateTime();
    
    // Auto-generate Bill No (max bill number + 1)
    const saved = localStorage.getItem("erp_bills");
    const bills = saved ? JSON.parse(saved) : [SEED_BILL];
    const maxNo = bills.reduce((acc, curr) => {
      const val = parseInt(curr.billNo);
      return !isNaN(val) ? Math.max(acc, val) : acc;
    }, 0);
    setBillNo(String(maxNo ? maxNo + 1 : 80));
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("erp_bills", JSON.stringify(history));
  }, [history]);

  // Click outside listener for customer autocompletion
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (custDropdownRef.current && !custDropdownRef.current.contains(e.target)) {
        setCustSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toast Helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // ----------------------------------------------------
  // DATA AUTOLOAD ON CUSTOMER SELECT
  // ----------------------------------------------------
  const handleSelectCustomer = (cust) => {
    setSelectedCustomerId(cust.id);
    setCustomerName(cust.name);
    setCustomerPhone(cust.phone || "");
    setCustomerAddress(cust.notes || ""); // usually has address notes
    
    // Calculate outstanding cash & fine balance
    // In our system, LENT adds to outstanding cash. Let's calculate total cash outstanding
    let cashBal = 0;
    if (cust.transactions) {
      cust.transactions.forEach((tx) => {
        if (tx.type === "LENT") cashBal += tx.amount;
        else if (tx.type === "PAID") cashBal -= tx.amount;
      });
    }
    
    // Prefill Last Balance Cash
    setLastBalanceAmount(cashBal > 0 ? String(cashBal) : "0");
    
    // Look at customer notes for fine balance if any (since standard schema doesn't have fine balance field)
    // Or default to 0
    setLastBalanceFine("0");
    
    setCustSearchFocused(false);
    showToast(`Loaded customer profile: ${cust.name}`, "info");
  };

  // ----------------------------------------------------
  // REAL-TIME COMPUTATIONS
  // ----------------------------------------------------
  const totals = useMemo(() => {
    let weightTotal = 0;
    let lessTotal = 0;
    let netWtTotal = 0;
    let amountTotal = 0;
    let fineTotal = 0;

    items.forEach((row) => {
      const w = parseFloat(row.weight) || 0;
      const l = parseFloat(row.less) || 0;
      const net = Math.max(0, w - l);
      const t = parseFloat(row.tunch) || 0;
      const f = Math.round((net * t) / 100);
      
      weightTotal += w;
      lessTotal += l;
      netWtTotal += net;
      amountTotal += row.amount || 0;
      fineTotal += f;
    });

    return {
      weight: weightTotal,
      less: lessTotal,
      netWt: netWtTotal,
      amount: amountTotal,
      fine: fineTotal
    };
  }, [items]);

  // Jama Fine
  const computedJamaFine = useMemo(() => {
    const net = parseFloat(jamaNetWt || jamaWeight) || 0;
    const tunch = parseFloat(jamaTunch) || 0;
    return Math.round((net * tunch) / 100);
  }, [jamaWeight, jamaNetWt, jamaTunch]);

  // Baki Outputs
  const finalBaki = useMemo(() => {
    const lastCash = parseFloat(lastBalanceAmount) || 0;
    const lastFine = parseFloat(lastBalanceFine) || 0;
    const jamaCash = parseFloat(jamaAmount) || 0;
    
    return {
      amount: Math.round(totals.amount + lastCash - jamaCash),
      fine: Math.round(totals.fine + lastFine - computedJamaFine)
    };
  }, [totals.amount, totals.fine, lastBalanceAmount, lastBalanceFine, jamaAmount, computedJamaFine]);

  // Autocomplete lists
  const filteredCustomers = useMemo(() => {
    if (!customerName) return customers;
    return customers.filter((c) =>
      c.name.toLowerCase().includes(customerName.toLowerCase())
    );
  }, [customerName, customers]);

  // ----------------------------------------------------
  // INPUT HANDLERS
  // ----------------------------------------------------
  const handleRowChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Trigger auto-less from Panni Detail
    if (field === "panniDetail") {
      const autoLess = parsePanniDetail(value);
      if (autoLess !== null) {
        updated[index].less = String(autoLess);
      }
    }

    // Calculations
    const w = parseFloat(updated[index].weight) || 0;
    const l = parseFloat(updated[index].less) || 0;
    const net = Math.max(0, w - l);
    updated[index].netWt = net;

    const t = parseFloat(updated[index].tunch) || 0;
    updated[index].fine = Math.round((net * t) / 100);

    const labVal = updated[index].lab || "";
    updated[index].amount = calculateRowLabor(net, labVal);

    setItems(updated);
  };

  const handleAddRow = () => {
    setItems((prev) => [...prev, { ...EMPTY_ROW }]);
  };

  const handleRemoveRow = (index) => {
    if (items.length === 1) {
      setItems([{ ...EMPTY_ROW }]);
    } else {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleClearForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setSelectedCustomerId("");
    setItems([{ ...EMPTY_ROW }]);
    setLastBalanceAmount("");
    setLastBalanceFine("");
    setJamaDetails("");
    setJamaWeight("");
    setJamaNetWt("");
    setJamaTunch("");
    setJamaAmount("");
    
    // Auto-generate next Bill No
    const maxNo = history.reduce((acc, curr) => {
      const val = parseInt(curr.billNo);
      return !isNaN(val) ? Math.max(acc, val) : acc;
    }, 0);
    setBillNo(String(maxNo ? maxNo + 1 : 80));
    
    showToast("Form cleared", "info");
  };

  // ----------------------------------------------------
  // SAVE & POST OPERATIONS
  // ----------------------------------------------------
  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast("Customer name is required", "error");
      return;
    }
    if (items.some((row) => !row.item.trim())) {
      showToast("All items must have a name", "error");
      return;
    }

    const newBill = {
      id: `bill-${Date.now()}`,
      billNo: billNo || String(history.length + 80),
      customerName: customerName.trim().toUpperCase(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      date,
      time,
      topHeader: topHeader.trim(),
      title: billTitle.trim(),
      items: items.map((row) => ({
        ...row,
        weight: row.weight.toString(),
        less: row.less.toString(),
        tunch: row.tunch.toString(),
        lab: row.lab.toString()
      })),
      totals,
      lastBalance: {
        amount: parseFloat(lastBalanceAmount) || 0,
        fine: parseFloat(lastBalanceFine) || 0
      },
      jamaDetail: {
        details: jamaDetails.trim(),
        weight: parseFloat(jamaWeight) || 0,
        netWt: parseFloat(jamaNetWt || jamaWeight) || 0,
        tunch: jamaTunch.toString(),
        fine: computedJamaFine,
        amount: parseFloat(jamaAmount) || 0
      },
      finalBaki,
      postedToUdhaar: postToLedger && !!selectedCustomerId
    };

    // Save to bill history
    setHistory((prev) => [newBill, ...prev]);

    // Integrate with Udhaar ledger
    if (postToLedger) {
      const customerId = selectedCustomerId;
      let finalCustList = [...customers];
      
      // If customer is selected
      if (customerId) {
        finalCustList = customers.map((cust) => {
          if (cust.id === customerId) {
            const updatedTransactions = [...(cust.transactions || [])];
            
            // Add labor charge as LENT
            if (totals.amount > 0) {
              updatedTransactions.push({
                id: `tx-bill-labor-${Date.now()}`,
                date,
                type: "LENT",
                amount: totals.amount,
                description: `Bill No. ${newBill.billNo} - Labor charges estimate`
              });
            }
            
            // Add cash payment as PAID
            if (parseFloat(jamaAmount) > 0) {
              updatedTransactions.push({
                id: `tx-bill-jama-${Date.now()}`,
                date,
                type: "PAID",
                amount: parseFloat(jamaAmount),
                description: `Bill No. ${newBill.billNo} - Cash Jama credit`,
                method: "Cash"
              });
            }
            
            return {
              ...cust,
              transactions: updatedTransactions
            };
          }
          return cust;
        });
        
        setCustomers(finalCustList);
        localStorage.setItem("erp_udhaar_customers", JSON.stringify(finalCustList));
        showToast("Posted transaction to Udhaar statement!", "success");
      }

      // Integrate with Finance ledger (general transactions)
      const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
      const transactionsToAdd = [];

      // Outflow/Inflow from labor (as income) and jama payment (as income/inflow)
      if (parseFloat(jamaAmount) > 0) {
        transactionsToAdd.push({
          id: `tx-fin-jama-${Date.now()}`,
          date,
          type: "INFLOW",
          category: "Sales Revenue",
          amount: parseFloat(jamaAmount),
          paymentMethod: "Cash",
          description: `Cash deposit from ${newBill.customerName} (Bill No. ${newBill.billNo})`
        });
      }

      if (transactionsToAdd.length > 0) {
        localStorage.setItem("erp_general_transactions", JSON.stringify([...transactionsToAdd, ...financeLedger]));
        showToast("Recorded cash flows in general finance ledger!", "success");
      }
    }

    showToast(`Invoice No. ${newBill.billNo} saved successfully!`);
    
    // Auto print trigger / preview
    setPreviewBill(newBill);
  };



  // ----------------------------------------------------
  // PRINT ENGINE
  // ----------------------------------------------------
  const handlePrint = (bill) => {
    setPreviewBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };



  return (
    <div className="space-y-6">
      
      {/* Toast Alert Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-scale-up ${
              n.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                : n.type === "error"
                ? "bg-red-950/80 border-red-500/30 text-red-300"
                : "bg-blue-950/80 border-blue-500/30 text-blue-300"
            } backdrop-blur-md`}
          >
            {n.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : n.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            ) : (
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{n.message}</span>
            <button onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))} className="text-white/40 hover:text-white ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Screen Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 screen-only">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Billing Panel</h1>
          <p className="text-sm text-slate-500 mt-1">Create estimates, calculate purities/labor rates, and export classic receipts.</p>
        </div>
      </div>

      {/* CREATE INVOICE VIEW */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 screen-only">
          
          {/* Main Input Form Column */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Header Settings & Customer Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              <div className="flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-3">
                <User className="w-5 h-5" />
                <h3 className="font-bold text-slate-800">Invoice Information</h3>
              </div>

              {/* Estimate Templates Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Top Banner Hindi Text</label>
                  <input
                    type="text"
                    value={topHeader}
                    onChange={(e) => setTopHeader(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Invoice Document Title</label>
                  <input
                    type="text"
                    value={billTitle}
                    onChange={(e) => setBillTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Customer Autocomplete Input */}
                <div className="relative" ref={custDropdownRef}>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Customer Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search / Add Customer"
                      value={customerName}
                      onFocus={() => setCustSearchFocused(true)}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setSelectedCustomerId(""); // clear ID if user typed fresh
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>

                  {custSearchFocused && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-56 overflow-y-auto z-40 animate-fade-in">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCustomer(c)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 flex justify-between items-center transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{c.phone || "No phone"}</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Saved</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-slate-500 text-sm text-center">
                          No matching customer. Will save as guest/new contact.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Customer Phone & Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 91995 XXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                    />
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Address / Region</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Jamui"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Bill details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Bill Number</label>
                  <input
                    type="text"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                    />
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Time</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                    />
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Grid Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calculator className="w-5 h-5" />
                  <h3 className="font-bold text-slate-800">Items Worksheet</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-blue-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Row
                </button>
              </div>

              <table className="w-full border-collapse text-left text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-2 w-[22%]">Item / Product Name</th>
                    <th className="py-2.5 px-2 w-[10%] text-right">Weight</th>
                    <th className="py-2.5 px-2 w-[15%]">Panni Detail</th>
                    <th className="py-2.5 px-2 w-[9%] text-right">Less</th>
                    <th className="py-2.5 px-2 w-[9%] text-right">Net Wt</th>
                    <th className="py-2.5 px-2 w-[8%] text-right">Tunch</th>
                    <th className="py-2.5 px-2 w-[12%]">Lab (Rate/Exp)</th>
                    <th className="py-2.5 px-2 w-[10%] text-right">Amt (Lab)</th>
                    <th className="py-2.5 px-2 w-[10%] text-right">Fine</th>
                    <th className="py-2.5 px-2 w-[5%] text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      {/* Item Autocomplete Input */}
                      <td className="py-2 px-1 relative">
                        <input
                          type="text"
                          placeholder="e.g. OP* KATORI"
                          value={row.item}
                          onFocus={() => setItemSearchFocused(index)}
                          onBlur={() => setTimeout(() => setItemSearchFocused(null), 250)}
                          onChange={(e) => handleRowChange(index, "item", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700"
                        />
                        {itemSearchFocused === index && products.length > 0 && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto z-40">
                            {products
                              .filter((p) => p.name.toLowerCase().includes(row.item.toLowerCase()))
                              .map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onMouseDown={() => {
                                    handleRowChange(index, "item", p.name.toUpperCase());
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-semibold text-slate-700 border-b border-slate-50"
                                >
                                  {p.name.toUpperCase()} ({p.category})
                                </button>
                              ))}
                          </div>
                        )}
                      </td>

                      {/* Weight */}
                      <td className="py-2 px-1">
                        <input
                          type="text"
                          placeholder="0"
                          value={row.weight}
                          onChange={(e) => handleRowChange(index, "weight", e.target.value)}
                          className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700 font-mono"
                        />
                      </td>

                      {/* Panni Detail */}
                      <td className="py-2 px-1">
                        <input
                          type="text"
                          placeholder="e.g. 8*2.7+49*2.3"
                          value={row.panniDetail}
                          onChange={(e) => handleRowChange(index, "panniDetail", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm text-slate-600 font-mono"
                        />
                      </td>

                      {/* Less */}
                      <td className="py-2 px-1">
                        <input
                          type="text"
                          placeholder="0"
                          value={row.less}
                          onChange={(e) => handleRowChange(index, "less", e.target.value)}
                          className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm text-slate-600 font-mono"
                        />
                      </td>

                      {/* Net Wt (Calculated) */}
                      <td className="py-2 px-1 text-right font-bold text-slate-800 font-mono">
                        {row.netWt || "0"}
                      </td>

                      {/* Tunch */}
                      <td className="py-2 px-1">
                        <input
                          type="text"
                          placeholder="0.0"
                          value={row.tunch}
                          onChange={(e) => handleRowChange(index, "tunch", e.target.value)}
                          className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700 font-mono"
                        />
                      </td>

                      {/* Lab Expression or Rate */}
                      <td className="py-2 px-1">
                        <input
                          type="text"
                          placeholder="850 or 17*12"
                          value={row.lab}
                          onChange={(e) => handleRowChange(index, "lab", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm text-slate-600 font-mono"
                        />
                      </td>

                      {/* Amount (Labor) Calculated */}
                      <td className="py-2 px-1 text-right font-bold text-slate-800 font-mono">
                        {row.amount || "-"}
                      </td>

                      {/* Fine Calculated */}
                      <td className="py-2 px-1 text-right font-bold text-slate-800 font-mono">
                        {row.fine || "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Grid Totals Row summary */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl">
                <span className="font-bold text-slate-700 text-sm">TOTAL SALE</span>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-semibold">Weight:</span>
                    <span className="font-bold text-slate-800 font-mono">{totals.weight}g</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-semibold">Less:</span>
                    <span className="font-bold text-slate-800 font-mono">{totals.less}g</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-semibold">Net Wt:</span>
                    <span className="font-bold text-slate-800 font-mono text-blue-600">{totals.netWt}g</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-semibold">Labor Amt:</span>
                    <span className="font-bold text-emerald-600 font-mono">₹{totals.amount}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-semibold">Fine:</span>
                    <span className="font-bold text-purple-600 font-mono">{totals.fine}g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Adjustments (Last Balance & Jama) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Last Bal & Jama Credit Sheet */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-3">
                  <RotateCcw className="w-5 h-5" />
                  <h3 className="font-bold text-slate-800">Balances & Jama Details</h3>
                </div>

                {/* Last Balance Inputs */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Last Balance</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Cash Balance (Amt)</label>
                      <input
                        type="number"
                        value={lastBalanceAmount}
                        placeholder="0"
                        onChange={(e) => setLastBalanceAmount(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Fine Balance (g)</label>
                      <input
                        type="number"
                        value={lastBalanceFine}
                        placeholder="0"
                        onChange={(e) => setLastBalanceFine(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Jama Deposit Inputs */}
                <div className="space-y-4 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jama Detail (Credit / Payment)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Deposits Details / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. KACHHI/807"
                        value={jamaDetails}
                        onChange={(e) => setJamaDetails(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Weight (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={jamaWeight}
                        onChange={(e) => {
                          setJamaWeight(e.target.value);
                          setJamaNetWt(e.target.value);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Net Wt (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={jamaNetWt}
                        onChange={(e) => setJamaNetWt(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Tunch (%)</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        value={jamaTunch}
                        onChange={(e) => setJamaTunch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Deposit Cash Deposit (Amt)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={jamaAmount}
                        onChange={(e) => setJamaAmount(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  {/* Jama calculated fine details */}
                  {(parseFloat(jamaNetWt || jamaWeight) > 0 || parseFloat(jamaTunch) > 0) && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded border border-dashed border-slate-200 text-slate-600 flex justify-between font-medium">
                      <span>Calculated Jama Fine:</span>
                      <span className="font-bold text-slate-800 font-mono">{computedJamaFine} g</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Settlement Display */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 border-b border-slate-100 pb-3 mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="font-bold text-slate-800">Final Outstanding Balance (BAKI)</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Baki cash card */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Baki Labor Amount</p>
                        <p className="text-2xl font-black text-emerald-700 font-mono mt-1">₹{finalBaki.amount}</p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <p>Sale: ₹{totals.amount}</p>
                        <p className="mt-0.5">Bal: +₹{parseFloat(lastBalanceAmount) || 0}</p>
                        <p className="mt-0.5">Jama: -₹{parseFloat(jamaAmount) || 0}</p>
                      </div>
                    </div>

                    {/* Baki fine card */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-purple-800 uppercase tracking-wide">Baki Fine Outstanding</p>
                        <p className="text-2xl font-black text-purple-700 font-mono mt-1">{finalBaki.fine} g</p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <p>Sale: {totals.fine}g</p>
                        <p className="mt-0.5">Bal: +{parseFloat(lastBalanceFine) || 0}g</p>
                        <p className="mt-0.5">Jama: -{computedJamaFine}g</p>
                      </div>
                    </div>
                  </div>

                  {/* Posting Ledger Integrations */}
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={postToLedger}
                        onChange={(e) => setPostToLedger(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-sm font-semibold text-slate-700">Update Udhaar Customer Profile & General Ledger</span>
                    </label>
                    
                    {!selectedCustomerId && postToLedger && (
                      <p className="text-xs text-amber-600 flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        Please select an existing customer from the autocomplete box above to post details to their statement.
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Controls */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl py-3 text-xs font-bold transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInvoice}
                    className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-blue-500/10 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save & Preview Invoice
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Sidebar Invoice Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-24">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Bill Preview
                </span>
                {previewBill && (
                  <button
                    onClick={() => handlePrint(previewBill)}
                    className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print PDF
                  </button>
                )}
              </div>

              {previewBill ? (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4 max-h-[550px] overflow-y-auto font-mono text-xs text-slate-600">
                  <div className="text-center font-bold text-slate-700 border-b border-dashed border-slate-200 pb-2">
                    <p className="text-[10px]">{previewBill.topHeader}</p>
                    <p className="text-sm font-black tracking-wider text-slate-800 mt-0.5">{previewBill.title}</p>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <div>
                      <p><span className="font-bold text-slate-800">Bill No:</span> #{previewBill.billNo}</p>
                      <p className="mt-1 font-bold text-slate-900">{previewBill.customerName}</p>
                      {previewBill.customerPhone && <p className="mt-0.5 text-slate-400">{previewBill.customerPhone}</p>}
                    </div>
                    <div className="text-right">
                      <p>{previewBill.date}</p>
                      <p className="mt-0.5">{previewBill.time}</p>
                    </div>
                  </div>
                  
                  {/* Small Summary Table */}
                  <div className="border-t border-b border-slate-200/60 py-2 space-y-1">
                    <div className="grid grid-cols-5 text-[9px] font-bold border-b border-slate-100 pb-1">
                      <span className="col-span-2">Item</span>
                      <span className="text-right">Net Wt</span>
                      <span className="text-right">Amt</span>
                      <span className="text-right">Fine</span>
                    </div>
                    {previewBill.items.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-5 text-[9px] text-slate-500 font-semibold py-0.5">
                        <span className="col-span-2 truncate">{row.item}</span>
                        <span className="text-right font-mono">{row.netWt}g</span>
                        <span className="text-right font-mono">{row.amount || "-"}</span>
                        <span className="text-right font-mono">{row.fine || "-"}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between font-bold">
                      <span>Total Sale Wt / Fine:</span>
                      <span>{previewBill.totals.netWt}g / {previewBill.totals.fine}g</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Sale Labor Amt:</span>
                      <span>₹{previewBill.totals.amount}</span>
                    </div>
                    {previewBill.jamaDetail.details && (
                      <div className="flex justify-between text-indigo-600 font-semibold border-t border-slate-100 pt-1">
                        <span>Jama ({previewBill.jamaDetail.details}):</span>
                        <span>{previewBill.jamaDetail.fine}g / ₹{previewBill.jamaDetail.amount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-slate-800 border-t border-slate-200/80 pt-1.5 text-[11px]">
                      <span>BAKI AMT / FINE:</span>
                      <span>₹{previewBill.finalBaki.amount} / {previewBill.finalBaki.fine}g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">No invoice compiled yet.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Fill the form and hit save to load a print preview.</p>
                </div>
              )}
            </div>
          </div>

        </div>


      {/* PRINT-ONLY TRADITIONAL ESTIMATE SLIP CONTAINER */}
      {/* Renders an identical replica of Rough_estimate_bill.jpeg */}
      {previewBill && (
        <div className="print-invoice print-only">
          <div className="print-container">
            {/* Header section */}
            <div className="print-header font-serif">
              <p className="traditional-hail">{previewBill.topHeader}</p>
              <h1 className="traditional-title">{previewBill.title}</h1>
            </div>

            {/* Meta client detail info row */}
            <div className="print-meta-grid">
              <div className="meta-col-left font-sans font-bold">
                <p>Bill No. &nbsp;<span className="font-mono">{previewBill.billNo}</span></p>
                <p className="meta-client-name mt-1">{previewBill.customerName}</p>
              </div>
              <div className="meta-col-right text-right font-sans font-bold">
                <p className="font-mono">{previewBill.time}</p>
                <p className="font-mono mt-1">{previewBill.date}</p>
              </div>
            </div>

            {/* Ledger Table */}
            <table className="traditional-bill-table font-sans">
              <thead>
                <tr>
                  <th className="col-amount text-center font-bold" style={{border: '1px solid black'}}>Amount</th>
                  <th className="col-item text-left font-bold" style={{border: '1px solid black'}}>Item</th>
                  <th className="col-weight text-right font-bold" style={{border: '1px solid black'}}>Weight</th>
                  <th className="col-panni text-left font-bold" style={{border: '1px solid black'}}>Panni Detail</th>
                  <th className="col-less text-right font-bold" style={{border: '1px solid black'}}>Less</th>
                  <th className="col-netwt text-right font-bold" style={{border: '1px solid black'}}>Net Wt.</th>
                  <th className="col-tunch text-right font-bold" style={{border: '1px solid black'}}>Tunch</th>
                  <th className="col-lab text-right font-bold" style={{border: '1px solid black'}}>Lab.</th>
                  <th className="col-fine text-right font-bold" style={{border: '1px solid black'}}>Fine</th>
                </tr>
              </thead>
              <tbody>
                {previewBill.items.map((row, idx) => (
                  <tr key={idx}>
                    <td className="col-amount font-mono text-center">{row.amount || ""}</td>
                    <td className="col-item text-left font-bold">{row.item}</td>
                    <td className="col-weight font-mono text-right">{row.weight}</td>
                    <td className="col-panni font-mono text-left">{row.panniDetail || ""}</td>
                    <td className="col-less font-mono text-right">{row.less || ""}</td>
                    <td className="col-netwt font-mono text-right">{row.netWt || ""}</td>
                    <td className="col-tunch font-mono text-right">{row.tunch}</td>
                    <td className="col-lab font-mono text-right">{row.lab || ""}</td>
                    <td className="col-fine font-mono text-right">{row.fine || ""}</td>
                  </tr>
                ))}

                {/* Fill empty items rows to mimic paper aesthetic if items count is small */}
                {Array.from({ length: Math.max(0, 10 - previewBill.items.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="empty-filler-row">
                    <td className="col-amount">&nbsp;</td>
                    <td className="col-item">&nbsp;</td>
                    <td className="col-weight">&nbsp;</td>
                    <td className="col-panni">&nbsp;</td>
                    <td className="col-less">&nbsp;</td>
                    <td className="col-netwt">&nbsp;</td>
                    <td className="col-tunch">&nbsp;</td>
                    <td className="col-lab">&nbsp;</td>
                    <td className="col-fine">&nbsp;</td>
                  </tr>
                ))}

                {/* TOTAL SALE ROW */}
                <tr className="row-total-sale">
                  <td className="col-amount font-mono text-center font-bold">{previewBill.totals.amount || ""}</td>
                  <td className="col-item text-left font-black">TOTAL SALE</td>
                  <td className="col-weight font-mono text-right font-bold">{previewBill.totals.weight}</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less font-mono text-right font-bold">{previewBill.totals.less || ""}</td>
                  <td className="col-netwt font-mono text-right font-bold">{previewBill.totals.netWt}</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">{previewBill.totals.fine}</td>
                </tr>

                {/* LAST BALANCE ROW */}
                <tr className="row-last-bal">
                  <td className="col-amount font-mono text-center font-bold">{previewBill.lastBalance.amount || ""}</td>
                  <td className="col-item text-left text-slate-500 font-bold">Last Bal. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="font-mono text-xs">{previewBill.date}</span></td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">{previewBill.lastBalance.fine || "0"}</td>
                </tr>

                {/* TOTAL SALE + LAST BAL ROW */}
                <tr className="row-inter-total">
                  <td className="col-amount font-mono text-center font-bold">
                    {previewBill.totals.amount + previewBill.lastBalance.amount || ""}
                  </td>
                  <td className="col-item text-left font-black">Total</td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">
                    {previewBill.totals.fine + previewBill.lastBalance.fine || ""}
                  </td>
                </tr>

                {/* JAMA DETAIL ROW */}
                <tr className="row-jama-detail">
                  <td className="col-amount font-mono text-center font-bold">
                    {previewBill.jamaDetail.amount || ""}
                  </td>
                  <td className="col-item text-left text-slate-600 font-bold">
                    Jama Detail <br />
                    <span className="font-normal">{previewBill.jamaDetail.details || ""}</span>
                  </td>
                  <td className="col-weight font-mono text-right">{previewBill.jamaDetail.weight || ""}</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt font-mono text-right">{previewBill.jamaDetail.netWt || ""}</td>
                  <td className="col-tunch font-mono text-right">{previewBill.jamaDetail.tunch || ""}</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">
                    {previewBill.jamaDetail.fine || ""}
                  </td>
                </tr>

                {/* BAKI FINAL ROW */}
                <tr className="row-baki-final">
                  <td className="col-amount font-mono text-center font-black text-lg">{previewBill.finalBaki.amount}</td>
                  <td className="col-item text-left font-black text-base">(BAKI) &nbsp;&nbsp;&nbsp;Final &nbsp;&nbsp;&nbsp;Total Kachhi - 1</td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch font-black text-center text-sm">(BAKI)</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-black text-lg">{previewBill.finalBaki.fine}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINT-ONLY MEDIA STYLES */}
      <style>{`
        /* Screen only hide print elements */
        .print-only {
          display: none;
        }

        @media print {
          /* Hide all screen interface elements */
          .screen-only, body * {
            display: none !important;
          }
          
          /* Override body margins and styles for printer */
          body, html {
            background-color: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            font-family: Arial, sans-serif !important;
          }

          .print-only, .print-only * {
            display: block !important;
          }

          /* Traditional slip layout structure */
          .print-container {
            width: 95% !important;
            max-width: 800px !important;
            margin: 15px auto !important;
            padding: 5px !important;
            background-color: #fff !important;
          }

          .print-header {
            text-align: center;
            margin-bottom: 20px;
          }

          .traditional-hail {
            font-size: 14px !important;
            font-weight: bold !important;
            margin: 0 0 4px 0 !important;
            letter-spacing: 1px;
            font-family: inherit;
          }

          .traditional-title {
            font-size: 15px !important;
            font-weight: bold !important;
            margin: 0 !important;
            text-decoration: underline !important;
            letter-spacing: 1.5px;
            font-family: inherit;
          }

          .print-meta-grid {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important;
            font-size: 13px !important;
            padding: 0 4px !important;
          }

          .meta-client-name {
            font-size: 13px !important;
            font-weight: bold !important;
            letter-spacing: 0.5px;
          }

          /* Main Table Styling - Double lines, thin gridlines */
          .traditional-bill-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border-top: 2px solid #000 !important;
            border-bottom: 2px solid #000 !important;
            font-size: 12px !important;
          }

          .traditional-bill-table th {
            border: 1px solid #000 !important;
            font-weight: bold !important;
            padding: 6px 4px !important;
            font-size: 12px !important;
            text-align: inherit;
            background-color: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .traditional-bill-table td {
            border: 1px solid #000 !important;
            padding: 6px 6px !important;
            height: 22px;
          }

          /* Explicit Column widths */
          .col-amount { width: 10% !important; text-align: center !important; }
          .col-item { width: 30% !important; }
          .col-weight { width: 10% !important; }
          .col-panni { width: 15% !important; }
          .col-less { width: 8% !important; }
          .col-netwt { width: 10% !important; }
          .col-tunch { width: 8% !important; }
          .col-lab { width: 10% !important; }
          .col-fine { width: 10% !important; }

          /* Empty spacer rows height and styling */
          .empty-filler-row td {
            height: 25px !important;
            border: 1px solid #000 !important;
          }

          /* Row Total Sale styling */
          .row-total-sale {
            border-top: 2px solid #000 !important;
            border-bottom: 1px solid #000 !important;
          }
          .row-total-sale td {
            font-weight: bold !important;
            background-color: #fff !important;
            border: 1px solid #000 !important;
          }

          /* Last Balance Row styling */
          .row-last-bal td {
            background-color: #fff !important;
            border: 1px solid #000 !important;
          }

          /* Inter Total Row styling */
          .row-inter-total td {
            font-weight: bold !important;
            border: 1px solid #000 !important;
          }

          /* Jama Detail Row styling */
          .row-jama-detail td {
            border: 1px solid #000 !important;
          }

          /* Baki Final Row styling (heavy highlight) */
          .row-baki-final {
            border-bottom: 2px solid #000 !important;
          }
          .row-baki-final td {
            font-weight: bold !important;
            border: 1px solid #000 !important;
            padding: 8px 6px !important;
          }
        }
      `}</style>

    </div>
  );
};

export default Billing;