import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../utils/toast.utils";
import { purchaseService } from "./purchase.service";
import { setPurchaseRecords, setProductsList, setIsLoading, setPurchaseFormAction } from "../store/features/purchase.slice";


const parseTunchExpression = (expr) => {
  if (!expr) return 0;
  try {
    const clean = String(expr).replace(/\s+/g, "");
    if (clean.includes("+")) {
      const parts = clean.split("+");
      return parts.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
    }
    return parseFloat(clean) || 0;
  } catch (e) {
    return 0;
  }
};

const parseMathExpression = (expr) => {
  if (!expr) return 0;
  try {
    const clean = String(expr).replace(/\s+/g, "");
    if (!/^[0-9.+\-*/()]+$/.test(clean)) {
      return parseFloat(clean) || 0;
    }
    const result = new Function(`return (${clean})`)();
    return typeof result === "number" && !isNaN(result) ? result : 0;
  } catch (e) {
    return 0;
  }
};


const INITIAL_PURCHASES_FALLBACK = [
  {
    _id: "purchase-1",
    billCode: "PUR-2026-101",
    date: "2026-06-10",
    supplierName: "Apex Silver Refinery",
    silverRate: 80000,
    oldBalanceFine: 0,
    oldBalanceAmount: 0,
    items: [
      {
        sku: "SLV-RG-002",
        productName: "Oxidized Floral Band Ring",
        quantity: 50,
        weight: 340.0,
        less: 0,
        netWeight: 340.0,
        tunch: "92.5",
        effectivePurity: 92.5,
        labRate: 10,
        labRateType: "PER_KG",
        amount: 3400,
        fine: 314.5
      }
    ],
    totals: {
      weight: 340.0,
      less: 0,
      netWt: 340.0,
      amount: 3400,
      fine: 314.5
    },
    cost: 31518,
    paymentMethod: "Bank Transfer"
  }
];

const usePurchase = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const purchaseRecords = useSelector((state) => state.purchase.purchaseRecords);
  const productsList = useSelector((state) => state.purchase.productsList);
  const isLoading = useSelector((state) => state.purchase.isLoading);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateRangePreset, setDateRangePreset] = useState("All"); // All, Today, Yesterday, ThisWeek, ThisMonth, Custom
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [sortBy, setSortBy] = useState("date"); // date, weight, cost
  const [sortOrder, setSortOrder] = useState("desc");

  const [showCharts, setShowCharts] = useState(true);

  // Modals & Panels state
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Rich Multi-Item Form State (synced with Redux slice state)
  const purchaseForm = useSelector((state) => state.purchase.purchaseForm);
  const setPurchaseForm = (valOrFunc) => {
    const nextVal = typeof valOrFunc === "function" ? valOrFunc(purchaseForm) : valOrFunc;
    dispatch(setPurchaseFormAction(nextVal));
  };

  // Fetch purchases and products on mount
  const fetchBackendData = async () => {
    dispatch(setIsLoading(true));
    try {
      const purchasesRes = await purchaseService.getPurchases();
      if (purchasesRes.data && purchasesRes.data.data) {
        dispatch(setPurchaseRecords(purchasesRes.data.data));
      } else {
        dispatch(setPurchaseRecords(INITIAL_PURCHASES_FALLBACK));
      }
    } catch (err) {
      console.warn("Using fallback purchases data:", err.message);
      dispatch(setPurchaseRecords(INITIAL_PURCHASES_FALLBACK));
    }

    try {
      const productsRes = await purchaseService.getProducts();
      if (productsRes.data && productsRes.data.data) {
        dispatch(setProductsList(productsRes.data.data));
      }
    } catch (err) {
      console.error("Failed to load products list:", err.message);
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // ----------------------------------------------------
  // REAL-TIME FORM CALCULATIONS ENGINE
  // ----------------------------------------------------
  const calculatedFormValues = useMemo(() => {
    let totalWeight = 0;
    let totalLess = 0;
    let totalNetWeight = 0;
    let totalLaborAmount = 0;
    let totalFineWeight = 0;

    const parsedItems = purchaseForm.items.map((item) => {
      const w = parseFloat(item.weight) || 0;
      const l = parseMathExpression(item.less);
      const qty = parseInt(item.quantity) || 0;
      const netWt = Math.max(0, w - l);

      const effectivePurity = parseTunchExpression(item.tunch);
      const fine = netWt * (effectivePurity / 100);

      let amount = 0;
      const rate = parseFloat(item.labRate) || 0;
      if (item.labRateType === "PER_KG") {
        amount = netWt * (rate / 1000);
      } else if (item.labRateType === "PER_GRAM") {
        amount = netWt * rate;
      } else if (item.labRateType === "FLAT") {
        amount = qty * rate;
      }

      totalWeight += w;
      totalLess += l;
      totalNetWeight += netWt;
      totalLaborAmount += amount;
      totalFineWeight += fine;

      return {
        ...item,
        effectiveLess: l,
        netWeight: netWt,
        effectivePurity,
        fine: Math.round(fine * 100) / 100,
        amount: Math.round(amount)
      };
    });

    let jamaWeight = 0;
    let jamaLess = 0;
    let jamaNetWt = 0;
    let jamaFine = 0;

    const parsedJama = purchaseForm.jamaDetails.map((item) => {
      const w = parseFloat(item.weight) || 0;
      const l = parseFloat(item.less) || 0;
      const net = Math.max(0, w - l);
      const t = parseFloat(item.tunch) || 0;
      const fine = net * (t / 100);

      jamaWeight += w;
      jamaLess += l;
      jamaNetWt += net;
      jamaFine += fine;

      return {
        ...item,
        netWeight: net,
        fine: Math.round(fine * 100) / 100
      };
    });

    let totalCashJama = 0;
    const parsedCash = purchaseForm.cashJamaList.map((item) => {
      const amt = parseFloat(item.amount) || 0;
      totalCashJama += amt;
      return {
        ...item,
        amount: amt
      };
    });

    const oldBalFine = parseFloat(purchaseForm.oldBalanceFine) || 0;
    const oldBalAmt = parseFloat(purchaseForm.oldBalanceAmount) || 0;

    const grandTotalFine = totalFineWeight + oldBalFine;
    const grandTotalAmount = totalLaborAmount + oldBalAmt;

    const outstandingFine = Math.max(0, grandTotalFine - jamaFine);

    // Convert rate per Kg to rate per gram
    const ratePerGram = (parseFloat(purchaseForm.silverRate) || 0) / 1000;
    const bhawSilverCost = outstandingFine * ratePerGram;
    const netCashPayable = Math.round(bhawSilverCost + grandTotalAmount);

    // 3% GST included in final net cash payable
    const gst = Math.round(netCashPayable * 0.03);
    const grandTotalNet = netCashPayable + gst;

    const finalOutstandingAmount = Math.max(0, grandTotalNet - totalCashJama);
    const finalOutstandingFine = Math.max(0, grandTotalFine - jamaFine);

    return {
      items: parsedItems,
      jamaDetails: parsedJama,
      cashJamaList: parsedCash,
      totals: {
        weight: totalWeight,
        less: totalLess,
        netWt: totalNetWeight,
        amount: Math.round(totalLaborAmount),
        fine: Math.round(totalFineWeight * 100) / 100
      },
      jamaTotals: {
        weight: jamaWeight,
        less: jamaLess,
        netWt: jamaNetWt,
        fine: Math.round(jamaFine * 100) / 100
      },
      grandTotalFine: Math.round(grandTotalFine * 100) / 100,
      grandTotalAmount: Math.round(grandTotalAmount),
      outstandingFine: Math.round(outstandingFine * 100) / 100,
      bhawSilverCost: Math.round(bhawSilverCost),
      netCashPayable,
      gst,
      grandTotalNet,
      totalCashJama,
      finalOutstandingAmount,
      finalOutstandingFine
    };
  }, [purchaseForm]);

  // ----------------------------------------------------
  // FILTER & SORT DATA
  // ----------------------------------------------------
  const filteredPurchases = useMemo(() => {
    let result = [...purchaseRecords];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.billCode?.toLowerCase().includes(q) ||
          p.supplierName?.toLowerCase().includes(q) ||
          p.items?.some((item) => item.productName?.toLowerCase().includes(q))
      );
    }

    // Payment Filter
    if (paymentFilter !== "All") {
      result = result.filter((p) => p.paymentMethod === paymentFilter);
    }

    // Date range preset filter
    if (dateRangePreset !== "All") {
      const todayStr = new Date().toISOString().split("T")[0];
      const today = new Date(todayStr);

      result = result.filter((p) => {
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
        valA = a.totals?.weight || a.totalWeight || 0;
        valB = b.totals?.weight || b.totalWeight || 0;
      } else if (sortBy === "cost") {
        valA = a.cost;
        valB = b.cost;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    purchaseRecords,
    searchQuery,
    paymentFilter,
    dateRangePreset,
    customStartDate,
    customEndDate,
    sortBy,
    sortOrder
  ]);

  // ----------------------------------------------------
  // CALCULATE KPI SUMMARIES
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let cost = 0;
    let weight = 0;
    let pieces = 0;

    filteredPurchases.forEach((p) => {
      cost += Number(p.cost || 0);
      weight += Number(p.totals?.weight || p.totalWeight || 0);
      if (p.items && p.items.length > 0) {
        p.items.forEach((item) => {
          pieces += Number(item.quantity || 0);
        });
      } else {
        pieces += Number(p.quantity || 0);
      }
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
  // PERFORMANCE COMPARISONS
  // ----------------------------------------------------
  const comparisons = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);

    const w1Start = new Date();
    w1Start.setDate(today.getDate() - 7);
    const w2Start = new Date();
    w2Start.setDate(today.getDate() - 14);

    let thisWeekCost = 0;
    let thisWeekWeight = 0;
    let lastWeekCost = 0;
    let lastWeekWeight = 0;

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let thisMonthCost = 0;
    let thisMonthWeight = 0;
    let lastMonthCost = 0;
    let lastMonthWeight = 0;

    purchaseRecords.forEach((p) => {
      const pDate = new Date(p.date);
      const cost = Number(p.cost || 0);
      const weight = Number(p.totals?.weight || p.totalWeight || 0);

      if (pDate >= w1Start && pDate <= today) {
        thisWeekCost += cost;
        thisWeekWeight += weight;
      } else if (pDate >= w2Start && pDate < w1Start) {
        lastWeekCost += cost;
        lastWeekWeight += weight;
      }

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
    const dateMap = {};
    filteredPurchases.forEach((p) => {
      if (!dateMap[p.date]) {
        dateMap[p.date] = { date: p.date, Cost: 0, "Weight (g)": 0 };
      }
      dateMap[p.date].Cost += p.cost;
      dateMap[p.date]["Weight (g)"] += (p.totals?.weight || p.totalWeight || 0);
    });

    const dailyTrendData = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-15);

    const catMap = {};
    filteredPurchases.forEach((p) => {
      const weight = (p.totals?.weight || p.totalWeight || 0);
      const category = p.category || "General";

      if (p.items && p.items.length > 0) {
        p.items.forEach((item) => {
          const itemCat = item.category || "General";
          if (!catMap[itemCat]) {
            catMap[itemCat] = { name: itemCat, Cost: 0, "Weight (g)": 0 };
          }
          const propCost = p.cost * (item.netWeight / (p.totals?.netWt || 1));
          catMap[itemCat].Cost += propCost;
          catMap[itemCat]["Weight (g)"] += item.netWeight;
        });
      } else {
        if (!catMap[category]) {
          catMap[category] = { name: category, Cost: 0, "Weight (g)": 0 };
        }
        catMap[category].Cost += p.cost;
        catMap[category]["Weight (g)"] += weight;
      }
    });

    const categoryPurchasesData = Object.values(catMap);

    const skuMap = {};
    filteredPurchases.forEach((p) => {
      if (p.items && p.items.length > 0) {
        p.items.forEach((item) => {
          if (!skuMap[item.sku]) {
            skuMap[item.sku] = { sku: item.sku, name: item.productName, Cost: 0, "Weight (g)": 0 };
          }
          const propCost = p.cost * (item.netWeight / (p.totals?.netWt || 1));
          skuMap[item.sku].Cost += propCost;
          skuMap[item.sku]["Weight (g)"] += item.netWeight;
        });
      } else {
        const skuKey = p.sku || "GEN";
        if (!skuMap[skuKey]) {
          skuMap[skuKey] = { sku: skuKey, name: p.productName || "General Restock", Cost: 0, "Weight (g)": 0 };
        }
        skuMap[skuKey].Cost += p.cost;
        skuMap[skuKey]["Weight (g)"] += (p.totals?.weight || p.totalWeight || 0);
      }
    });

    const topSKUsData = Object.values(skuMap)
      .sort((a, b) => b.Cost - a.Cost)
      .slice(0, 5);

    return { dailyTrendData, categoryPurchasesData, topSKUsData };
  }, [filteredPurchases]);

  // ----------------------------------------------------
  // SUBMIT RECORD NEW PURCHASE
  // ----------------------------------------------------
  const handleRecordPurchaseSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseForm.supplierName.trim()) {
      showToast("Supplier name is required", "error");
      return;
    }
    const hasInvalidItem = purchaseForm.items.some(
      (item) => !item.sku || item.sku === "NEW_ITEM" || !item.productName || !item.productName.trim()
    );
    if (purchaseForm.items.length === 0 || hasInvalidItem) {
      showToast("Please make sure all items have a valid product selected or entered", "error");
      return;
    }

    try {
      const payload = {
        supplierName: purchaseForm.supplierName.trim(),
        date: purchaseForm.date,
        silverRate: parseFloat(purchaseForm.silverRate) || 0,
        oldBalanceFine: parseFloat(purchaseForm.oldBalanceFine) || 0,
        oldBalanceAmount: parseFloat(purchaseForm.oldBalanceAmount) || 0,
        items: calculatedFormValues.items.map((it) => {
          const { effectiveLess, ...cleaned } = it;
          return {
            ...cleaned,
            less: typeof effectiveLess === "number" ? effectiveLess : (parseFloat(it.less) || 0)
          };
        }),
        jamaDetails: calculatedFormValues.jamaDetails,
        cashJamaList: calculatedFormValues.cashJamaList,
        totals: {
          weight: calculatedFormValues.totals.weight,
          less: calculatedFormValues.totals.less,
          netWt: calculatedFormValues.totals.netWt,
          amount: calculatedFormValues.totals.amount,
          fine: calculatedFormValues.totals.fine
        },
        netCashPayable: calculatedFormValues.grandTotalNet,
        cost: calculatedFormValues.grandTotalNet,
        paymentMethod: purchaseForm.cashJamaList.length > 0
          ? purchaseForm.cashJamaList[0].type.replace("_", " ")
          : "Cash",
        finalOutstanding: {
          amount: calculatedFormValues.finalOutstandingAmount,
          fine: calculatedFormValues.finalOutstandingFine
        }
      };

      await purchaseService.createPurchase(payload);

      // Also log general transaction in localStorage for Finance page compatibility
      const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
      const financeTx = {
        id: "gen-" + Date.now(),
        date: purchaseForm.date,
        type: "OUTFLOW",
        category: "Material Purchases",
        amount: payload.cost,
        paymentMethod: payload.paymentMethod,
        description: `Wholesale Purchase Estimate from ${payload.supplierName} (Items: ${payload.items.length}, Net Wt: ${payload.totals.netWt.toFixed(2)}g)`
      };
      localStorage.setItem("erp_general_transactions", JSON.stringify([financeTx, ...financeLedger]));

      showToast("Wholesale restock estimate bill recorded successfully!");

      // Reload purchases
      await fetchBackendData();

      setIsRecordOpen(false);
      // Reset Form
      setPurchaseForm({
        supplierName: "",
        date: new Date().toISOString().split("T")[0],
        silverRate: 85000,
        oldBalanceFine: 0,
        oldBalanceAmount: 0,
        items: [
          {
            sku: "",
            productName: "",
            quantity: 1,
            weight: "",
            less: "",
            tunch: "92.5",
            labRate: 0,
            labRateType: "PER_KG"
          }
        ],
        jamaDetails: [],
        cashJamaList: []
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to record purchase bill", "error");
    }
  };

  // ----------------------------------------------------
  // DELETE PURCHASE (Reverts stocks)
  // ----------------------------------------------------
  const handleDeleteConfirm = async () => {
    if (!selectedPurchase) return;
    try {
      await purchaseService.deletePurchase(selectedPurchase._id);

      // Revert in localStorage finance transactions too
      const financeLedger = JSON.parse(localStorage.getItem("erp_general_transactions") || "[]");
      const updatedFinance = financeLedger.filter((tx) => {
        return !(tx.description.includes(selectedPurchase.supplierName) && tx.amount === selectedPurchase.cost);
      });
      localStorage.setItem("erp_general_transactions", JSON.stringify(updatedFinance));

      showToast(`Bill ${selectedPurchase.billCode} cancelled and inventory reverted!`);

      await fetchBackendData();
      setIsDeleteConfirmOpen(false);
      setSelectedPurchase(null);
    } catch (err) {
      showToast("Failed to cancel purchase bill", "error");
    }
  };

  // ----------------------------------------------------
  // EXPORT PURCHASES CSV
  // ----------------------------------------------------
  const handleExportCSV = () => {
    try {
      let csv = "data:text/csv;charset=utf-8,";
      csv += "Bill Code,Date,Supplier Vendor,Total Weight(g),Total Fine(g),Total Labor(INR),Valuation(INR),Payment Method\r\n";

      filteredPurchases.forEach((p) => {
        const row = [
          p.billCode,
          p.date,
          `"${p.supplierName}"`,
          p.totals?.weight || p.totalWeight || 0,
          p.totals?.fine || 0,
          p.totals?.amount || 0,
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
      showToast("CSV purchase statement exported!");
    } catch (e) {
      showToast("Export failed.", "error");
    }
  };

  return {
    purchaseRecords,
    productsList,
    isLoading,

    // Filters state
    searchQuery,
    setSearchQuery,
    paymentFilter,
    setPaymentFilter,
    dateRangePreset,
    setDateRangePreset,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // UI state
    showCharts,
    setShowCharts,
    isRecordOpen,
    setIsRecordOpen,
    selectedPurchase,
    setSelectedPurchase,
    isBillOpen,
    setIsBillOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,

    // Form state
    purchaseForm,
    setPurchaseForm,

    // Computed values
    calculatedFormValues,
    filteredPurchases,
    stats,
    comparisons,
    chartData,

    // Actions
    fetchBackendData,
    handleRecordPurchaseSubmit,
    handleDeleteConfirm,
    handleExportCSV
  };
};

export default usePurchase;