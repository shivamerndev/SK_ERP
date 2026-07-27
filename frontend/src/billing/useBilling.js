import { useState, useEffect, useMemo } from "react";
import { getBillHistory, saveBillHistory, getProductsList } from "./billing.service";
import { getAllCustomersService } from "../customers/customer.service";
import { toast } from "react-hot-toast";

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

const useBilling = () => {
  // Data Sources
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);

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
  const [jamaAmount, setJamaAmount] = useState("");
  const [silverRate, setSilverRate] = useState("");

  // Options
  const [postToLedger, setPostToLedger] = useState(true);
  const [previewBill, setPreviewBill] = useState(null);

  // Autocomplete UI status
  const [custSearchFocused, setCustSearchFocused] = useState(false);
  const [itemSearchFocused, setItemSearchFocused] = useState(null); // row index

  // Toast Helper using react-hot-toast
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  // LOAD SEED/EXTERNAL DATA
  useEffect(() => {
    
    // setProducts(getProductsList());

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

    // Fetch Customers from backend
    const loadCustomers = async () => {
      try {
        const res = await getAllCustomersService();
        setCustomers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };

    // Fetch Bills from backend
    const loadBills = async () => {
      try {
        const res = await getBillHistory();
        const bills = res.data?.data || [];
        setHistory(bills);
        const maxNo = bills.reduce((acc, curr) => {
          const val = parseInt(curr.billNo);
          return !isNaN(val) ? Math.max(acc, val) : acc;
        }, 0);
        setBillNo(String(maxNo ? maxNo + 1 : 1));
      } catch (err) {
        console.error("Failed to load bill history", err);
      }
    };

    loadCustomers();
    loadBills();
  }, []);

  // DATA AUTOLOAD ON CUSTOMER SELECT
  const handleSelectCustomer = (cust) => {
    setSelectedCustomerId(cust.id || cust._id);
    setCustomerName(cust.name || cust.fullName);
    setCustomerPhone(cust.phone || "");
    setCustomerAddress(cust.notes || cust.address || "");

    // Calculate outstanding cash balance if backend returns it
    const cashBal = cust.totalLend || 0;

    // Prefill Last Balance Cash
    setLastBalanceAmount(cashBal > 0 ? String(cashBal) : "0");
    setLastBalanceFine("0");
    setCustSearchFocused(false);
    showToast(`Loaded customer profile: ${cust.name || cust.fullName}`, "info");
  };

  // REAL-TIME COMPUTATIONS
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

  const totalFineBeforeSettle = useMemo(() => {
    const lastFine = parseFloat(lastBalanceFine) || 0;
    return totals.fine + lastFine - computedJamaFine;
  }, [totals.fine, lastBalanceFine, computedJamaFine]);

  const convertedFineAmount = useMemo(() => {
    const rate = parseFloat(silverRate) || 0;
    if (rate <= 0) return 0;
    return Math.round((totalFineBeforeSettle * rate) / 1000);
  }, [totalFineBeforeSettle, silverRate]);

  // Baki Outputs
  const finalBaki = useMemo(() => {
    const lastCash = parseFloat(lastBalanceAmount) || 0;
    const jamaCash = parseFloat(jamaAmount) || 0;

    if (parseFloat(silverRate) > 0) {
      return {
        amount: Math.round(totals.amount + lastCash - jamaCash + convertedFineAmount),
        fine: 0
      };
    } else {
      return {
        amount: Math.round(totals.amount + lastCash - jamaCash),
        fine: Math.round(totalFineBeforeSettle)
      };
    }
  }, [totals.amount, lastBalanceAmount, jamaAmount, silverRate, convertedFineAmount, totalFineBeforeSettle]);

  // Autocomplete lists
  const filteredCustomers = useMemo(() => {
    if (!customerName) return customers;
    return customers.filter((c) => {
      const targetName = (c.fullName || c.name || "").toLowerCase();
      return targetName.includes(customerName.toLowerCase());
    });
  }, [customerName, customers]);

  // INPUT HANDLERS
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
    setSilverRate("");

    // Auto-generate next Bill No
    const maxNo = history.reduce((acc, curr) => {
      const val = parseInt(curr.billNo);
      return !isNaN(val) ? Math.max(acc, val) : acc;
    }, 0);
    setBillNo(String(maxNo ? maxNo + 1 : 80));

    showToast("Form cleared", "info");
  };

  // SAVE & POST OPERATIONS
  const handleSaveInvoice = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerName.trim()) {
      showToast("Customer name is required", "error");
      return;
    }
    if (items.some((row) => !row.item.trim())) {
      showToast("All items must have a name", "error");
      return;
    }

    try {
      const newBill = {
        billNo: billNo || String(history.length + 80),
        customerName: customerName.trim().toUpperCase(),
        customerPhone: customerPhone,
        customerAddress: customerAddress.trim(),
        customerId: selectedCustomerId ? Number(selectedCustomerId) : null,
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
        silverRate: parseFloat(silverRate) || 0,
        convertedFineAmount,
        postedToUdhaar: postToLedger && !!selectedCustomerId
      };

      const res = await saveBillHistory(newBill);
      const savedBill = res.data.data;

      // Save to bill history
      setHistory((prev) => [savedBill, ...prev]);

      showToast(`Invoice No. ${savedBill.billNo} saved successfully!`);

      // Auto print trigger / preview
      setPreviewBill(savedBill);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to save invoice", "error");
    }
  };

  const handlePrint = (bill) => {
    setPreviewBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return {
    // States
    customers,
    products,
    history,
    billNo,
    customerName,
    customerPhone,
    customerAddress,
    selectedCustomerId,
    date,
    time,
    topHeader,
    billTitle,
    items,
    lastBalanceAmount,
    lastBalanceFine,
    jamaDetails,
    jamaWeight,
    jamaNetWt,
    jamaTunch,
    jamaAmount,
    silverRate,
    postToLedger,
    previewBill,
    custSearchFocused,
    itemSearchFocused,

    // Setters
    setBillNo,
    setCustomerName,
    setCustomerPhone,
    setCustomerAddress,
    setSelectedCustomerId,
    setDate,
    setTime,
    setTopHeader,
    setBillTitle,
    setItems,
    setLastBalanceAmount,
    setLastBalanceFine,
    setJamaDetails,
    setJamaWeight,
    setJamaNetWt,
    setJamaTunch,
    setJamaAmount,
    setSilverRate,
    setPostToLedger,
    setPreviewBill,
    setCustSearchFocused,
    setItemSearchFocused,

    // Computed
    totals,
    computedJamaFine,
    totalFineBeforeSettle,
    convertedFineAmount,
    finalBaki,
    filteredCustomers,

    // Handlers
    showToast,
    handleSelectCustomer,
    handleRowChange,
    handleAddRow,
    handleRemoveRow,
    handleClearForm,
    handleSaveInvoice,
    handlePrint
  };
};

export default useBilling;
