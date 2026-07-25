import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Trash2,
  ExternalLink,
  X,
  History,
  TrendingUp,
  Coins,
  Scale,
  Calendar,
  User,
  Clock,
  ArrowUpRight,
  Filter,
  RotateCcw
} from "lucide-react";
import { toast } from "react-hot-toast";

// Default Seed Bill matching Billing.jsx
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

const Reports = () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("erp_bills");
    return saved ? JSON.parse(saved) : [SEED_BILL];
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bakiFilter, setBakiFilter] = useState("all"); // 'all' | 'outstanding_amt' | 'outstanding_fine' | 'no_outstanding'

  // Modal State
  const [selectedBill, setSelectedBill] = useState(null);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem("erp_bills", JSON.stringify(history));
  }, [history]);

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

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setBakiFilter("all");
    showToast("Filters reset to default", "info");
  };

  // ----------------------------------------------------
  // FILTERED DATA & CALCULATIONS
  // ----------------------------------------------------
  const filteredHistory = useMemo(() => {
    return history.filter((bill) => {
      // 1. Search Query Filter (Bill No or Client Name)
      const matchesSearch =
        bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.billNo.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Date Range Filter
      const billDate = bill.date; // Format YYYY-MM-DD
      let matchesStartDate = true;
      let matchesEndDate = true;

      if (startDate) {
        matchesStartDate = billDate >= startDate;
      }
      if (endDate) {
        matchesEndDate = billDate <= endDate;
      }

      // 3. Outstanding Baki Filter
      let matchesBaki = true;
      const bakiAmount = parseFloat(bill.finalBaki?.amount || 0);
      const bakiFine = parseFloat(bill.finalBaki?.fine || 0);

      if (bakiFilter === "outstanding_amt") {
        matchesBaki = bakiAmount > 0;
      } else if (bakiFilter === "outstanding_fine") {
        matchesBaki = bakiFine > 0;
      } else if (bakiFilter === "no_outstanding") {
        matchesBaki = bakiAmount === 0 && bakiFine === 0;
      }

      return matchesSearch && matchesStartDate && matchesEndDate && matchesBaki;
    });
  }, [history, searchQuery, startDate, endDate, bakiFilter]);

  // Dynamic Dashboard Metrics based on filtered data
  const metrics = useMemo(() => {
    let totalInvoices = filteredHistory.length;
    let totalLaborAmt = 0;
    let totalFineWt = 0;
    let outstandingBakiAmt = 0;
    let outstandingBakiFine = 0;

    filteredHistory.forEach((bill) => {
      totalLaborAmt += parseFloat(bill.totals?.amount || 0);
      totalFineWt += parseFloat(bill.totals?.fine || 0);
      outstandingBakiAmt += parseFloat(bill.finalBaki?.amount || 0);
      outstandingBakiFine += parseFloat(bill.finalBaki?.fine || 0);
    });

    return {
      totalInvoices,
      totalLaborAmt: Math.round(totalLaborAmt),
      totalFineWt: parseFloat(totalFineWt.toFixed(3)),
      outstandingBakiAmt: Math.round(outstandingBakiAmt),
      outstandingBakiFine: parseFloat(outstandingBakiFine.toFixed(3))
    };
  }, [filteredHistory]);

  // Aggregate Top Clients
  const topClients = useMemo(() => {
    const clientsMap = {};

    filteredHistory.forEach((bill) => {
      const name = bill.customerName.trim().toUpperCase();
      if (!clientsMap[name]) {
        clientsMap[name] = {
          name: bill.customerName,
          billsCount: 0,
          totalLabor: 0,
          totalFine: 0,
          bakiAmount: 0,
          bakiFine: 0
        };
      }
      clientsMap[name].billsCount += 1;
      clientsMap[name].totalLabor += parseFloat(bill.totals?.amount || 0);
      clientsMap[name].totalFine += parseFloat(bill.totals?.fine || 0);
      clientsMap[name].bakiAmount += parseFloat(bill.finalBaki?.amount || 0);
      clientsMap[name].bakiFine += parseFloat(bill.finalBaki?.fine || 0);
    });

    // Sort by total business volume (Labor Total)
    return Object.values(clientsMap)
      .sort((a, b) => b.totalLabor - a.totalLabor || b.billsCount - a.billsCount)
      .slice(0, 5);
  }, [filteredHistory]);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------
  const handleDeleteBill = (id) => {
    if (confirm("Are you sure you want to delete this invoice record from logs?")) {
      setHistory((prev) => prev.filter((b) => b.id !== id));
      if (selectedBill && selectedBill.id === id) {
        setSelectedBill(null);
      }
      showToast("Invoice deleted successfully!", "info");
    }
  };

  const handlePrint = (bill) => {
    setSelectedBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 screen-only">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Reports & Billing Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Perform in-depth analysis of invoices, track client outstanding dues, and print estimate sheets.
          </p>
        </div>
      </div>

      {/* ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 screen-only">
        {/* Total Bills */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bills</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{metrics.totalInvoices}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Invoices in selected period</p>
          </div>
        </div>

        {/* Total Labor Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Labor Cash</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">₹{metrics.totalLaborAmt}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Total compiled labor charges</p>
          </div>
        </div>

        {/* Total Fine Weight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sales Fine Wt.</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{metrics.totalFineWt}g</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Total sale fine credit weight</p>
          </div>
        </div>

        {/* Outstanding cash dues */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider font-semibold">Baki Amount</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-600">₹{metrics.outstandingBakiAmt}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Unpaid labor balance</p>
          </div>
        </div>

        {/* Outstanding fine dues */}
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider font-semibold">Baki Fine</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-purple-600">{metrics.outstandingBakiFine}g</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Unreturned metal fine balance</p>
          </div>
        </div>
      </div>

      {/* ADVANCED FILTER SYSTEM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 screen-only">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Filter className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-slate-800 text-sm">Advanced Search & Report Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Text Search */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Client / Bill No</label>
            <input
              type="text"
              placeholder="e.g. Vikash, #79..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-7 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Outstanding Filter Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outstanding Status</label>
            <select
              value={bakiFilter}
              onChange={(e) => setBakiFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Invoices</option>
              <option value="outstanding_amt">Outstanding Baki Amount &gt; 0</option>
              <option value="outstanding_fine">Outstanding Baki Fine &gt; 0</option>
              <option value="no_outstanding">Settled Bills (No Outstanding Dues)</option>
            </select>
          </div>
        </div>

        {/* Filter Toolbar Actions */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
          <p className="text-[11px] text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-700">{filteredHistory.length}</span> of{" "}
            <span className="font-bold text-slate-700">{history.length}</span> recorded invoices.
          </p>
          
          {(searchQuery || startDate || endDate || bakiFilter !== "all") && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg px-2.5 py-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 screen-only">
        {/* TOP CLIENTS PANEL */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <User className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm">Top Customer Accounts</h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                By Sales Vol.
              </span>
            </div>

            {topClients.length > 0 ? (
              <div className="divide-y divide-slate-100 space-y-3.5">
                {topClients.map((client, idx) => (
                  <div key={idx} className="pt-3.5 first:pt-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="font-black text-slate-800 text-xs truncate max-w-[150px]">
                        {client.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">
                        {client.billsCount} bills
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400">Total Labor</span>
                        <span className="font-bold text-emerald-600">₹{Math.round(client.totalLabor)}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400">Total Fine</span>
                        <span className="font-bold text-amber-600">{client.totalFine.toFixed(2)}g</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-dashed border-slate-100 text-[10px] text-slate-500 font-mono">
                      <div>
                        <span className="text-rose-500 font-semibold">Baki ₹{Math.round(client.bakiAmount)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-purple-600 font-semibold">Fine {client.bakiFine.toFixed(2)}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p className="text-xs font-semibold">No transactions aggregate yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* INVOICE HISTORY LOG VIEW */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-800">Saved Invoices</h2>
              </div>
            </div>

            {/* List display */}
            {filteredHistory.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                      <th className="p-3">Bill No</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3 text-right">Items Count</th>
                      <th className="p-3 text-right">Labor Total</th>
                      <th className="p-3 text-right font-semibold">Fine Total</th>
                      <th className="p-3 text-right text-rose-500 font-bold">Baki Amount</th>
                      <th className="p-3 text-right text-purple-600 font-bold">Baki Fine</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((bill) => (
                      <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors font-semibold text-slate-700">
                        <td className="p-3 text-indigo-600 font-bold font-mono">#{bill.billNo}</td>
                        <td className="p-3 font-bold text-slate-800">{bill.customerName}</td>
                        <td className="p-3 text-slate-500 font-mono">
                          {bill.date} <span className="text-[10px] text-slate-400">({bill.time})</span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-500">{bill.items?.length || 0} items</td>
                        <td className="p-3 text-right font-mono text-slate-500 font-semibold text-slate-700">₹{bill.totals?.amount || 0}</td>
                        <td className="p-3 text-right font-mono text-slate-500">{bill.totals?.fine || 0}g</td>
                        <td className="p-3 text-right font-mono text-rose-500 font-bold">₹{bill.finalBaki?.amount || 0}</td>
                        <td className="p-3 text-right font-mono text-purple-600 font-bold">{bill.finalBaki?.fine || 0}g</td>
                        <td className="p-3 text-center flex items-center justify-center gap-1.5 font-bold">
                          <button
                            onClick={() => setSelectedBill(bill)}
                            className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open View
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
                            className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-slate-500">No saved invoices found</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing filters or create a new invoice in the Billing page.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRINT-ONLY TRADITIONAL ESTIMATE SLIP CONTAINER (Visible only in system print prompt) */}
      {selectedBill && (
        <div className="print-invoice print-only">
          <div className="print-container">
            {/* Header section */}
            <div className="print-header font-serif">
              <p className="traditional-hail">{selectedBill.topHeader}</p>
              <h1 className="traditional-title">{selectedBill.title}</h1>
            </div>

            {/* Meta client detail info row */}
            <div className="print-meta-grid">
              <div className="meta-col-left font-sans font-bold">
                <p>Bill No. &nbsp;<span className="font-mono">{selectedBill.billNo}</span></p>
                <p className="meta-client-name mt-1">{selectedBill.customerName}</p>
              </div>
              <div className="meta-col-right text-right font-sans font-bold">
                <p className="font-mono">{selectedBill.time}</p>
                <p className="font-mono mt-1">{selectedBill.date}</p>
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
                {selectedBill.items?.map((row, idx) => (
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

                {/* Fill empty items rows to mimic paper aesthetic */}
                {Array.from({ length: Math.max(0, 10 - (selectedBill.items?.length || 0)) }).map((_, idx) => (
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
                  <td className="col-amount font-mono text-center font-bold">{selectedBill.totals?.amount || ""}</td>
                  <td className="col-item text-left font-black">TOTAL SALE</td>
                  <td className="col-weight font-mono text-right font-bold">{selectedBill.totals?.weight}</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less font-mono text-right font-bold">{selectedBill.totals?.less || ""}</td>
                  <td className="col-netwt font-mono text-right font-bold">{selectedBill.totals?.netWt}</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">{selectedBill.totals?.fine}</td>
                </tr>

                {/* LAST BALANCE ROW */}
                <tr className="row-last-bal">
                  <td className="col-amount font-mono text-center font-bold">{selectedBill.lastBalance?.amount || ""}</td>
                  <td className="col-item text-left text-slate-500 font-bold">Last Bal. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="font-mono text-xs">{selectedBill.date}</span></td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">{selectedBill.lastBalance?.fine || "0"}</td>
                </tr>

                {/* TOTAL SALE + LAST BAL ROW */}
                <tr className="row-inter-total">
                  <td className="col-amount font-mono text-center font-bold">
                    {(selectedBill.totals?.amount || 0) + (selectedBill.lastBalance?.amount || 0) || ""}
                  </td>
                  <td className="col-item text-left font-black">Total</td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch">&nbsp;</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">
                    {(selectedBill.totals?.fine || 0) + (selectedBill.lastBalance?.fine || 0) || ""}
                  </td>
                </tr>

                {/* JAMA DETAIL ROW */}
                <tr className="row-jama-detail">
                  <td className="col-amount font-mono text-center font-bold">
                    {selectedBill.jamaDetail?.amount || ""}
                  </td>
                  <td className="col-item text-left text-slate-600 font-bold">
                    Jama Detail <br />
                    <span className="font-normal">{selectedBill.jamaDetail?.details || ""}</span>
                  </td>
                  <td className="col-weight font-mono text-right">{selectedBill.jamaDetail?.weight || ""}</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt font-mono text-right">{selectedBill.jamaDetail?.netWt || ""}</td>
                  <td className="col-tunch font-mono text-right">{selectedBill.jamaDetail?.tunch || ""}</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-bold">
                    {selectedBill.jamaDetail?.fine || ""}
                  </td>
                </tr>

                {/* BAKI FINAL ROW */}
                <tr className="row-baki-final">
                  <td className="col-amount font-mono text-center font-black text-lg">{selectedBill.finalBaki?.amount}</td>
                  <td className="col-item text-left font-black text-base">(BAKI) &nbsp;&nbsp;&nbsp;Final &nbsp;&nbsp;&nbsp;Total Kachhi - 1</td>
                  <td className="col-weight">&nbsp;</td>
                  <td className="col-panni">&nbsp;</td>
                  <td className="col-less">&nbsp;</td>
                  <td className="col-netwt">&nbsp;</td>
                  <td className="col-tunch font-black text-center text-sm">(BAKI)</td>
                  <td className="col-lab">&nbsp;</td>
                  <td className="col-fine font-mono text-right font-black text-lg">{selectedBill.finalBaki?.fine}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL VIEW & PRINT PREVIEW MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs screen-only transition-opacity duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-scale-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-800">Invoice Draft Viewer</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold font-mono">
                  #{selectedBill.billNo}
                </span>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col lg:flex-row gap-6">
              {/* Left Side: Summary and Meta details */}
              <div className="lg:w-2/5 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-500" />
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-800 font-bold">{selectedBill.customerName}</span>
                    </div>
                    {selectedBill.customerPhone && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="font-mono text-slate-800">{selectedBill.customerPhone}</span>
                      </div>
                    )}
                    {selectedBill.customerAddress && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Address:</span>
                        <span className="text-slate-800">{selectedBill.customerAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Invoice Metadata
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="font-mono text-slate-800">{selectedBill.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time:</span>
                      <span className="font-mono text-slate-800">{selectedBill.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Top Header:</span>
                      <span className="text-slate-500 font-serif italic">{selectedBill.topHeader}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Invoice Title:</span>
                      <span className="text-slate-800 font-bold uppercase">{selectedBill.title}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-100 p-5 rounded-2xl border border-indigo-950/20 shadow-lg space-y-3.5">
                  <h4 className="font-black text-white text-sm border-b border-indigo-800 pb-2">
                    Final Outstanding Balance
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-indigo-300 font-semibold">Baki Amount:</span>
                    <span className="text-lg font-black text-rose-300 font-mono">
                      ₹{selectedBill.finalBaki?.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-indigo-300 font-semibold">Baki Fine Wt.:</span>
                    <span className="text-lg font-black text-purple-300 font-mono">
                      {selectedBill.finalBaki?.fine}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Paper Aesthetics Invoice Preview */}
              <div className="lg:w-3/5 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Print Preview Layout</span>
                  <button
                    onClick={() => handlePrint(selectedBill)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Print Receipt
                  </button>
                </div>
                
                {/* Scrollable container simulating paper draft */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-auto p-6 max-h-[500px]">
                  {/* Traditional Estimate Slip Replica */}
                  <div className="font-sans text-slate-900 leading-normal text-xs">
                    <div className="text-center mb-6 font-serif">
                      <p className="font-bold tracking-wider text-slate-600 text-[10px] uppercase">{selectedBill.topHeader}</p>
                      <h2 className="font-black text-base text-slate-900 border-b border-slate-900 inline-block pb-0.5 mt-1 tracking-widest">{selectedBill.title}</h2>
                    </div>

                    <div className="flex justify-between mb-4 font-bold border-b border-slate-100 pb-2">
                      <div>
                        <p className="text-[10px] text-slate-400">BILL NO</p>
                        <p className="font-mono text-indigo-600 text-sm mt-0.5">#{selectedBill.billNo}</p>
                        <p className="text-slate-800 text-[13px] mt-1.5 font-black uppercase">{selectedBill.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">DATE & TIME</p>
                        <p className="font-mono text-slate-800 mt-0.5">{selectedBill.date}</p>
                        <p className="font-mono text-slate-500 mt-0.5">{selectedBill.time}</p>
                      </div>
                    </div>

                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-y border-slate-900/60 bg-slate-50 font-bold">
                          <th className="p-2 text-center text-slate-600">Amount</th>
                          <th className="p-2 text-left text-slate-800">Item</th>
                          <th className="p-2 text-right text-slate-600">Weight</th>
                          <th className="p-2 text-left text-slate-600">Panni Detail</th>
                          <th className="p-2 text-right text-slate-600">Less</th>
                          <th className="p-2 text-right text-slate-600">Net Wt</th>
                          <th className="p-2 text-right text-slate-600">Tunch</th>
                          <th className="p-2 text-right text-slate-600">Lab</th>
                          <th className="p-2 text-right text-slate-800">Fine</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedBill.items?.map((row, idx) => (
                          <tr key={idx} className="font-semibold text-slate-700">
                            <td className="p-2 text-center font-mono text-slate-500">{row.amount || "-"}</td>
                            <td className="p-2 text-left font-black text-slate-800">{row.item}</td>
                            <td className="p-2 text-right font-mono">{row.weight}</td>
                            <td className="p-2 text-left font-mono text-[10px] text-slate-400">{row.panniDetail || "-"}</td>
                            <td className="p-2 text-right font-mono text-slate-400">{row.less || "-"}</td>
                            <td className="p-2 text-right font-mono">{row.netWt || "-"}</td>
                            <td className="p-2 text-right font-mono">{row.tunch}%</td>
                            <td className="p-2 text-right font-mono text-slate-500">{row.lab || "-"}</td>
                            <td className="p-2 text-right font-mono text-slate-800 font-bold">{row.fine || "-"}</td>
                          </tr>
                        ))}
                        {/* TOTAL SALE ROW */}
                        <tr className="border-t border-slate-900/60 font-black text-slate-800 bg-slate-50/50">
                          <td className="p-2 text-center font-mono">₹{selectedBill.totals?.amount}</td>
                          <td className="p-2 text-left">TOTAL SALE</td>
                          <td className="p-2 text-right font-mono">{selectedBill.totals?.weight}</td>
                          <td className="p-2"></td>
                          <td className="p-2 text-right font-mono">{selectedBill.totals?.less}</td>
                          <td className="p-2 text-right font-mono">{selectedBill.totals?.netWt}</td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2 text-right font-mono">{selectedBill.totals?.fine}g</td>
                        </tr>
                        {/* LAST BALANCE ROW */}
                        <tr className="text-slate-500 font-semibold">
                          <td className="p-2 text-center font-mono">₹{selectedBill.lastBalance?.amount || 0}</td>
                          <td className="p-2 text-left">Last Bal.</td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2 text-right font-mono">{selectedBill.lastBalance?.fine || 0}g</td>
                        </tr>
                        {/* TOTAL SALE + LAST BAL ROW */}
                        <tr className="font-bold text-slate-800 border-t border-dashed border-slate-200">
                          <td className="p-2 text-center font-mono">₹{(selectedBill.totals?.amount || 0) + (selectedBill.lastBalance?.amount || 0)}</td>
                          <td className="p-2 text-left">Total</td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2 text-right font-mono">{(selectedBill.totals?.fine || 0) + (selectedBill.lastBalance?.fine || 0)}g</td>
                        </tr>
                        {/* JAMA DETAIL ROW */}
                        <tr className="text-indigo-900 bg-indigo-50/30">
                          <td className="p-2 text-center font-mono">₹{selectedBill.jamaDetail?.amount || 0}</td>
                          <td className="p-2 text-left font-bold">
                            Jama Detail
                            {selectedBill.jamaDetail?.details && <span className="block text-[10px] text-indigo-500 font-normal">{selectedBill.jamaDetail.details}</span>}
                          </td>
                          <td className="p-2 text-right font-mono">{selectedBill.jamaDetail?.weight}</td>
                          <td className="p-2"></td>
                          <td className="p-2"></td>
                          <td className="p-2 text-right font-mono">{selectedBill.jamaDetail?.netWt}</td>
                          <td className="p-2 text-right font-mono">{selectedBill.jamaDetail?.tunch}%</td>
                          <td className="p-2"></td>
                          <td className="p-2 text-right font-mono font-bold">{selectedBill.jamaDetail?.fine || 0}g</td>
                        </tr>
                        {/* BAKI FINAL ROW */}
                        <tr className="border-y-2 border-slate-900 text-slate-900 bg-rose-50/20 font-black text-sm">
                          <td className="p-2.5 text-center font-mono text-rose-600">₹{selectedBill.finalBaki?.amount}</td>
                          <td className="p-2.5 text-left font-black text-slate-800">BAKI FINAL</td>
                          <td className="p-2.5"></td>
                          <td className="p-2.5"></td>
                          <td className="p-2.5"></td>
                          <td className="p-2.5"></td>
                          <td className="p-2.5 text-center text-xs font-semibold text-rose-500">(BAKI)</td>
                          <td className="p-2.5"></td>
                          <td className="p-2.5 text-right font-mono text-purple-700">{selectedBill.finalBaki?.fine}g</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer font-bold"
              >
                Close View
              </button>
            </div>
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

export default Reports;