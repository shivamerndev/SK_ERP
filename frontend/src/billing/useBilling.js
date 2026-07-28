import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBillHistory, saveBillHistory, getProductsList } from "./billing.service";
import { getAllCustomersService } from "../customers/customer.service";
import { toast } from "react-hot-toast";
import {
  updateField,
  setCustomers as setCustomersAction,
  setProducts as setProductsAction,
  setHistory as setHistoryAction,
  addItemRow,
  removeItemRow,
  updateItemRow,
  clearForm as clearFormAction
} from "../store/features/billing.slice";


const useBilling = (init = false) => {


  const dispatch = useDispatch();


  const { billNo, custSearchFocused, itemSearchFocused, customerName, customerPhone,
    customerAddress, selectedCustomerId, customers, products, history, date, time, topHeader,
    billTitle, items, lastBalanceAmount, lastBalanceFine, jamaDetails, jamaWeight, jamaNetWt,
    jamaTunch, jamaAmount, silverRate, postToLedger, previewBill } = useSelector((state) => state.billing);


  // Helper to create updater functions that update specific Redux state fields
  const setField = (key) => (val) => dispatch(updateField({ key, value: val }));
  // Helper to create functions that dispatch direct actions
  const dispatchAction = (actionCreator) => (val) => dispatch(actionCreator(val));

  const setCustomers = dispatchAction(setCustomersAction);
  const setProducts = dispatchAction(setProductsAction);
  const setHistory = dispatchAction(setHistoryAction);

  const setBillNo = setField("billNo");
  const setCustomerName = setField("customerName");
  const setCustomerPhone = setField("customerPhone");
  const setCustomerAddress = setField("customerAddress");
  const setSelectedCustomerId = setField("selectedCustomerId");

  const setDate = setField("date");
  const setTime = setField("time");
  const setTopHeader = setField("topHeader");
  const setBillTitle = setField("billTitle");

  const setItems = setField("items");

  const setLastBalanceAmount = setField("lastBalanceAmount");
  const setLastBalanceFine = setField("lastBalanceFine");

  const setJamaDetails = setField("jamaDetails");
  const setJamaWeight = setField("jamaWeight");
  const setJamaNetWt = setField("jamaNetWt");
  const setJamaTunch = setField("jamaTunch");
  const setJamaAmount = setField("jamaAmount");
  const setSilverRate = setField("silverRate");

  const setPostToLedger = setField("postToLedger");
  const setPreviewBill = setField("previewBill");

  const setCustSearchFocused = setField("custSearchFocused");
  const setItemSearchFocused = setField("itemSearchFocused");

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
    if (!init) return;
    setProducts(getProductsList());

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
  }, [init]);

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
    dispatch(updateItemRow({ index, field, value }));
  };

  const handleAddRow = () => {
    dispatch(addItemRow());
  };

  const handleRemoveRow = (index) => {
    dispatch(removeItemRow(index));
  };

  const handleClearForm = () => {
    dispatch(clearFormAction());
    showToast("Form cleared", "info");
  };

  // SAVE & POST OPERATIONS
  const handleSaveInvoice = async (formDataObj) => {
    if (formDataObj && typeof formDataObj.preventDefault === "function") {
      formDataObj.preventDefault();
    }

    const dataObj = (formDataObj && typeof formDataObj.preventDefault !== "function") ? formDataObj : {};

    const fBillNo = dataObj.billNo ?? billNo;
    const fCustomerName = dataObj.customerName ?? customerName;
    const fCustomerPhone = dataObj.customerPhone ?? customerPhone;
    const fCustomerAddress = dataObj.customerAddress ?? customerAddress;
    const fDate = dataObj.date ?? date;
    const fTime = dataObj.time ?? time;
    const fTopHeader = dataObj.topHeader ?? topHeader;
    const fBillTitle = dataObj.billTitle ?? billTitle;

    const fLastBalanceAmount = dataObj.lastBalanceAmount ?? lastBalanceAmount;
    const fLastBalanceFine = dataObj.lastBalanceFine ?? lastBalanceFine;

    const fJamaDetails = dataObj.jamaDetails ?? jamaDetails;
    const fJamaWeight = dataObj.jamaWeight ?? jamaWeight;
    const fJamaNetWt = dataObj.jamaNetWt ?? jamaNetWt;
    const fJamaTunch = dataObj.jamaTunch ?? jamaTunch;
    const fJamaAmount = dataObj.jamaAmount ?? jamaAmount;
    const fSilverRate = dataObj.silverRate ?? silverRate;

    let fPostToLedger = postToLedger;
    if (dataObj.postToLedger !== undefined) {
      fPostToLedger = dataObj.postToLedger === "true" || dataObj.postToLedger === "on" || !!dataObj.postToLedger;
    }

    if (!fCustomerName.trim()) {
      showToast("Customer name is required", "error");
      return;
    }
    if (items.some((row) => !row.item.trim())) {
      showToast("All items must have a name", "error");
      return;
    }

    try {

      const newBill = {
        billNo: fBillNo || String(history.length + 80),
        customerName: fCustomerName.trim().toUpperCase(),
        customerPhone: fCustomerPhone,
        customerAddress: fCustomerAddress.trim(),
        customerId: selectedCustomerId ? Number(selectedCustomerId) : null,
        date: fDate,
        time: fTime,
        topHeader: fTopHeader.trim(),
        title: fBillTitle.trim(),
        items: items.map((row) => ({
          ...row,
          weight: row.weight.toString(),
          less: row.less.toString(),
          tunch: row.tunch.toString(),
          lab: row.lab.toString()
        })),
        totals,
        lastBalance: {
          amount: parseFloat(fLastBalanceAmount) || 0,
          fine: parseFloat(fLastBalanceFine) || 0
        },
        jamaDetail: {
          details: fJamaDetails.trim(),
          weight: parseFloat(fJamaWeight) || 0,
          netWt: parseFloat(fJamaNetWt || fJamaWeight) || 0,
          tunch: fJamaTunch.toString(),
          fine: computedJamaFine,
          amount: parseFloat(fJamaAmount) || 0
        },
        finalBaki,
        silverRate: parseFloat(fSilverRate) || 0,
        convertedFineAmount,
        postedToUdhaar: fPostToLedger && !!selectedCustomerId
      };

      const res = await saveBillHistory(newBill);
      const savedBill = res.data.data;

      // Save to bill history
      dispatch(updateField({ key: "history", value: [savedBill, ...history] }));

      showToast(`Invoice No. ${savedBill.billNo} saved successfully!`);

      // Auto print trigger / preview
      dispatch(updateField({ key: "previewBill", value: savedBill }));
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to save invoice", "error");
    }
  };

  const handlePrint = (bill) => {
    dispatch(updateField({ key: "previewBill", value: bill }));
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return {

    // States
    customers, products, history, billNo, customerName, customerPhone, customerAddress, selectedCustomerId,
    date, time, topHeader, billTitle, items, lastBalanceAmount, lastBalanceFine, jamaDetails, jamaWeight,
    jamaNetWt, jamaTunch, jamaAmount, silverRate, postToLedger, previewBill, custSearchFocused, itemSearchFocused,

    // Setters
    setBillNo, setCustomerName, setCustomerPhone, setCustomerAddress, setSelectedCustomerId, setDate,
    setTime, setTopHeader, setBillTitle, setItems, setLastBalanceAmount, setLastBalanceFine, setJamaDetails,
    setJamaWeight, setJamaNetWt, setJamaTunch, setJamaAmount, setSilverRate, setPostToLedger, setPreviewBill,
    setCustSearchFocused, setItemSearchFocused,

    // Computed
    totals, computedJamaFine, totalFineBeforeSettle,
    convertedFineAmount, finalBaki, filteredCustomers,

    // Handlers
    showToast, handleSelectCustomer, handleRowChange, handleAddRow, handleRemoveRow, handleClearForm,
    handleSaveInvoice, handlePrint

  };
};

export default useBilling;
