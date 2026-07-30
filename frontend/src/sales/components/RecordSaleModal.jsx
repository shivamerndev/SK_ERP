import { useState, useEffect, useMemo, useRef } from "react";
import { X, Plus, Trash2, ShoppingCart } from "lucide-react";
import { getAllCustomersService } from "../../customers/customer.service";

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
  } catch {
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

const RecordSaleModal = ({ isOpen, onClose, onSubmit }) => {
  // Autocomplete data
  const [customers, setCustomers] = useState([]);
  const [custSearchFocused, setCustSearchFocused] = useState(false);

  // Form State
  const [billNo, setBillNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [topHeader, setTopHeader] = useState("|| SHREE GANESHAYAA NAMAH ||");
  const [billTitle, setBillTitle] = useState("ROUGH ESTIMATE");

  const [items, setItems] = useState([{ ...EMPTY_ROW }]);

  const [lastBalanceAmount, setLastBalanceAmount] = useState("");
  const [lastBalanceFine, setLastBalanceFine] = useState("");

  const [jamaDetails, setJamaDetails] = useState("");
  const [jamaWeight, setJamaWeight] = useState("");
  const [jamaNetWt, setJamaNetWt] = useState("");
  const [jamaTunch, setJamaTunch] = useState("");
  const [jamaAmount, setJamaAmount] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [postToLedger, setPostToLedger] = useState(true);

  const autocompleteRef = useRef(null);

  // Load Initial Data
  useEffect(() => {
    // Current Time
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${String(hours).padStart(2, "0")}:${minutes} ${ampm}`);
    };
    updateTime();

    // Fetch Customers
    const loadCustomers = async () => {
      try {
        const res = await getAllCustomersService();
        setCustomers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };
    loadCustomers();
  }, []);

  // Click outside listener for Customer Autocomplete
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setCustSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!customerName) return customers;
    return customers.filter((c) => {
      const name = (c.fullName || c.name || "").toLowerCase();
      return name.includes(customerName.toLowerCase());
    });
  }, [customerName, customers]);

  const handleSelectCustomer = (cust) => {
    setSelectedCustomerId(cust.id || cust._id || "");
    setCustomerName(cust.name || cust.fullName);
    setCustomerPhone(cust.phone || "");
    setCustomerAddress(cust.notes || cust.address || "");

    const cashBal = cust.totalLend || 0;
    setLastBalanceAmount(cashBal > 0 ? String(cashBal) : "");
    setLastBalanceFine("");
    setCustSearchFocused(false);
  };

  // Computations
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

  // Form Row Actions
  const handleRowChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "panniDetail") {
      const autoLess = parsePanniDetail(value);
      if (autoLess !== null) {
        updated[index].less = String(autoLess);
      }
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    if (items.some((row) => !row.item.trim())) return;

    const newBill = {
      billNo: billNo || "",
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

    onSubmit(newBill);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-800">Record Estimate Bill Slip</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">

          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Top Header</label>
              <input
                type="text"
                value={topHeader}
                onChange={(e) => setTopHeader(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Invoice Title</label>
              <input
                type="text"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Bill No (Auto-set if blank)</label>
              <input
                type="text"
                value={billNo}
                placeholder="e.g. 81"
                onChange={(e) => setBillNo(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
              />
            </div>
          </div>

          {/* Customer Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Customer Search Autocomplete */}
            <div ref={autocompleteRef} className="relative flex flex-col gap-1 md:col-span-2">
              <label className="font-bold text-slate-500 uppercase">Customer Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customerName}
                  onFocus={() => setCustSearchFocused(true)}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setSelectedCustomerId(""); // clear selection if editing text
                  }}
                  placeholder="Type name to search or add..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-white font-bold"
                />
                {custSearchFocused && filteredCustomers.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50 divide-y divide-slate-100">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 block transition-colors"
                      >
                        {c.fullName || c.name} (Address: {c.address || "N/A"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Customer Phone</label>
              <input
                type="number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10 digit number"
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Customer Address</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="e.g. Jamui"
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
              />
            </div>

          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
              />
            </div>
          </div>

          {/* Items worksheet worksheet grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wide">Jewelry Items Worksheet</h4>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item Row
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase">
                    <th className="px-3 py-2">Item Description *</th>
                    <th className="px-3 py-2 w-20 text-center">Gross Wt</th>
                    <th className="px-3 py-2 w-32 text-center">Panni detail</th>
                    <th className="px-3 py-2 w-20 text-center">Less (Wt)</th>
                    <th className="px-3 py-2 w-20 text-center">Net Wt</th>
                    <th className="px-3 py-2 w-16 text-center">Tunch (%)</th>
                    <th className="px-3 py-2 w-24 text-center">Lab / Charges</th>
                    <th className="px-3 py-2 w-20 text-right">Labor Cash</th>
                    <th className="px-3 py-2 w-20 text-right">Fine Wt</th>
                    <th className="px-3 py-2 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">

                      {/* Item description */}
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          value={row.item}
                          placeholder="Item name"
                          onChange={(e) => handleRowChange(idx, "item", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md focus:outline-none"
                        />
                      </td>

                      {/* Weight */}
                      <td className="p-2">
                        <input
                          type="number"
                          step={0.01}
                          required
                          value={row.weight}
                          placeholder="0.0"
                          onChange={(e) => handleRowChange(idx, "weight", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-center focus:outline-none "
                        />
                      </td>

                      {/* Panni Details */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.panniDetail}
                          placeholder="e.g. 4*2.4"
                          onChange={(e) => handleRowChange(idx, "panniDetail", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-center focus:outline-none  text-[9px]"
                        />
                      </td>

                      {/* Less */}
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.less}
                          placeholder="0.0"
                          onChange={(e) => handleRowChange(idx, "less", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-center focus:outline-none "
                        />
                      </td>

                      {/* Net Wt */}
                      <td className="p-2 text-center font-bold text-slate-700 ">
                        {row.netWt}
                      </td>

                      {/* Tunch */}
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.tunch}
                          placeholder="%"
                          onChange={(e) => handleRowChange(idx, "tunch", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-center focus:outline-none "
                        />
                      </td>

                      {/* Lab */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.lab}
                          placeholder="rate/Gram"
                          onChange={(e) => handleRowChange(idx, "lab", e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-center focus:outline-none "
                        />
                      </td>

                      {/* Labor cash */}
                      <td className="p-2 text-right text-emerald-600 font-bold ">
                        ₹{row.amount}
                      </td>

                      {/* Fine wt */}
                      <td className="p-2 text-right text-indigo-600 font-bold ">
                        {row.fine}
                      </td>

                      {/* Remove Row */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-slate-300 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Worksheet Totals summary row */}
            <div className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl flex flex-wrap gap-6 items-center justify-end font-bold text-slate-700">
              <span>Total Weight: <span className="">{totals.weight}g</span></span>
              <span>Total Less: <span className="">{totals.less}g</span></span>
              <span className="text-slate-800">Total Net Wt: <span className="">{totals.netWt}g</span></span>
              <span className="text-indigo-600 font-extrabold">Total Fine: <span className="">{totals.fine}g</span></span>
              <span className="text-emerald-600 font-black">Total Labor: <span className="">₹{totals.amount}</span></span>
            </div>
          </div>

          {/* Settling / Deposits / Jama Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">

            {/* Balance & Deposits */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1.5">
                Adjustment & Deposits (Jama)
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Last balance Amount (Cash)</label>
                  <input
                    type="number"
                    value={lastBalanceAmount}
                    onChange={(e) => setLastBalanceAmount(e.target.value)}
                    placeholder="₹0"
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Last balance Fine (Grams)</label>
                  <input
                    type="number"
                    value={lastBalanceFine}
                    onChange={(e) => setLastBalanceFine(e.target.value)}
                    placeholder="0.0 g"
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500 uppercase">Jama (Deposit) Details description</label>
                <input
                  type="text"
                  value={jamaDetails}
                  onChange={(e) => setJamaDetails(e.target.value)}
                  placeholder="e.g. Old silver exchange / CASH paid"
                  className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="font-bold text-slate-500 uppercase">Jama Gross Wt</label>
                  <input
                    type="number"
                    value={jamaWeight}
                    onChange={(e) => setJamaWeight(e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="font-bold text-slate-500 uppercase">Jama Net Wt</label>
                  <input
                    type="number"
                    value={jamaNetWt}
                    onChange={(e) => setJamaNetWt(e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="font-bold text-slate-500 uppercase">Jama Tunch</label>
                  <input
                    type="number"
                    value={jamaTunch}
                    onChange={(e) => setJamaTunch(e.target.value)}
                    placeholder="%"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="font-bold text-slate-500 uppercase font-black text-indigo-600">Jama Fine Wt</label>
                  <div className="px-2 py-1.5 border border-slate-100 rounded-lg bg-slate-50 text-slate-700 text-center font-bold ">
                    {computedJamaFine} g
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Jama Cash Amount (Paid)</label>
                  <input
                    type="number"
                    value={jamaAmount}
                    onChange={(e) => setJamaAmount(e.target.value)}
                    placeholder="₹0"
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Silver Rate applied (₹ per kg)</label>
                  <input
                    type="number"
                    value={silverRate}
                    onChange={(e) => setSilverRate(e.target.value)}
                    placeholder="e.g. 223600"
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none "
                  />
                </div>
              </div>
            </div>

            {/* Calculations Preview & Final Settlement */}
            <div className="bg-indigo-50/50 p-5 border border-indigo-100 rounded-xl space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-indigo-900 uppercase tracking-wide border-b border-indigo-100/50 pb-2 mb-3">
                  Summary & Final Settlement
                </h4>

                <div className="space-y-3 font-medium text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Labor Charges total:</span>
                    <strong className="text-slate-800 ">₹{totals.amount}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Worksheet Fine Weight:</span>
                    <strong className="text-slate-800 ">{totals.fine} g</strong>
                  </div>

                  <div className="border-t border-indigo-100/50 my-2 pt-2 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Deposited Jama Cash:</span>
                      <span className="font-bold text-slate-700 ">-₹{parseFloat(jamaAmount) || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Deposited Jama Fine:</span>
                      <span className="font-bold text-slate-700 ">-{computedJamaFine} g</span>
                    </div>
                  </div>

                  {parseFloat(silverRate) > 0 ? (
                    <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 text-[11px] space-y-1.5">
                      <div className="flex justify-between font-bold text-indigo-900">
                        <span>Fine Metal Settlement:</span>
                        <span>Silver Conversion</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Net Fine Balance weight:</span>
                        <span className="">{totalFineBeforeSettle} g</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Rate per gram (₹{silverRate}/1000):</span>
                        <span className="">₹{(parseFloat(silverRate) / 1000).toFixed(2)}/g</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-indigo-700 pt-1 border-t border-indigo-50">
                        <span>Metal Cash equivalent:</span>
                        <span className="">₹{convertedFineAmount}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500 text-[10px] text-center font-bold">
                      No silver rate entered. Metal fine outstanding will be computed in grams.
                    </div>
                  )}
                </div>
              </div>

              {/* Final Outstanding Balance indicators */}
              <div className="space-y-4 pt-3 border-t border-indigo-100/60">
                <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-inner space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Final Outstanding Balance (Baki)</span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-xl font-black ">
                      ₹{finalBaki.amount.toLocaleString("en-IN")}
                    </strong>
                    {finalBaki.fine > 0 && (
                      <span className="font-bold text-xs ">
                        + {finalBaki.fine.toFixed(2)}g Fine
                      </span>
                    )}
                  </div>
                </div>

                {/* Ledger integration checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ledgerSync"
                    disabled={!selectedCustomerId}
                    checked={postToLedger && !!selectedCustomerId}
                    onChange={(e) => setPostToLedger(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="ledgerSync" className="text-slate-700 font-bold select-none cursor-pointer">
                    Sync and Post balances to customer Udhaar Ledger accounts
                  </label>
                </div>
                {!selectedCustomerId && (
                  <p className="text-[10px] text-rose-500 font-bold">
                    * Balance posting disabled. Select a registered customer from catalog to sync with ledger.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              Post & Save Invoice
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RecordSaleModal;
