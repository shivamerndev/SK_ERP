import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
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
import PrintModal from "../report/components/PrintModal";
import ReportFilter from "../report/components/ReportFilter";

// Default Seed Bill matching Billing.jsx
const SEED_BILL = {
  "_id": "6a66e9b5d52d4f09a7107678",
  "billNo": "1",
  "customerName": "VIKASH BHAGAT JI",
  "customerPhone": 9935345723,
  "customerAddress": "jamui,Bihar",
  "customerId": 6,
  "date": "2026-07-27",
  "time": "10:38 AM",
  "topHeader": "|| SHREE GANESHAYAA NAMAH ||",
  "title": "ROUGH ESTIMATE",
  "items": [
    {
      "item": "ss nice got",
      "weight": "931",
      "panniDetail": "",
      "less": "",
      "netWt": 931,
      "tunch": "60",
      "lab": "800",
      "amount": 745,
      "fine": 559,
      "_id": "6a66e9b5d52d4f09a7107679"
    }
  ],
  "totals": {
    "weight": 931,
    "less": 0,
    "netWt": 931,
    "amount": 745,
    "fine": 559
  },
  "lastBalance": {
    "amount": 2197,
    "fine": 796
  },
  "jamaDetail": {
    "details": "",
    "weight": 0,
    "netWt": 0,
    "tunch": "",
    "fine": 0,
    "amount": 200000
  },
  "finalBaki": {
    "amount": 105920,
    "fine": 0
  },
  "silverRate": 223600,
  "convertedFineAmount": 302978,
  "postedToUdhaar": true,
  "createdAt": "2026-07-27T05:16:37.147Z",
  "updatedAt": "2026-07-27T05:16:37.147Z",
  "__v": 0
}

const Reports = () => {
  
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


  const handleDeleteBill = (id) => {
    if (confirm("Are you sure you want to delete this invoice record from logs?")) {
      setHistory((prev) => prev.filter((b) => b.id !== id));
      if (selectedBill && selectedBill.id === id) {
        setSelectedBill(null);
      }
      showToast("Invoice deleted successfully!", "info");
    }
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
      
      <ReportFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        bakiFilter={bakiFilter}
        setBakiFilter={setBakiFilter}
        handleResetFilters={handleResetFilters}
        filteredHistory={filteredHistory}
      />


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
      {selectedBill && createPortal(
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
                  <th className="col-amount text-center font-bold" style={{ border: '1px solid black' }}>Amount</th>
                  <th className="col-item text-left font-bold" style={{ border: '1px solid black' }}>Item</th>
                  <th className="col-weight text-right font-bold" style={{ border: '1px solid black' }}>Weight</th>
                  <th className="col-panni text-left font-bold" style={{ border: '1px solid black' }}>Panni Detail</th>
                  <th className="col-less text-right font-bold" style={{ border: '1px solid black' }}>Less</th>
                  <th className="col-netwt text-right font-bold" style={{ border: '1px solid black' }}>Net Wt.</th>
                  <th className="col-tunch text-right font-bold" style={{ border: '1px solid black' }}>Tunch</th>
                  <th className="col-lab text-right font-bold" style={{ border: '1px solid black' }}>Lab.</th>
                  <th className="col-fine text-right font-bold" style={{ border: '1px solid black' }}>Fine</th>
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
        </div>,
        document.body
      )}

      {selectedBill && <PrintModal selectedBill={selectedBill} setSelectedBill={setSelectedBill} />}

      <style>{`
        .print-only {
          display: none;
        }

        @media print {
          /* Hide all sibling elements of the print container under body */
          body > *:not(.print-invoice) {
            display: none !important;
          }
          
          /* Override body margins and styles for printer */
          body, html {
            background-color: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
            font-family: Arial, sans-serif !important;
          }

          @page {
            size: auto;
            margin: 10mm;
          }

          .print-only {
            display: block !important;
          }

          /* Traditional slip layout structure */
          .print-container {
            width: 95% !important;
            max-width: 800px !important;
            margin: 15px auto !important;
            padding: 5px !important;
            background-color: #fff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
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