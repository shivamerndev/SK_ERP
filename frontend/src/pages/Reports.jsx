import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, History, TrendingUp, Coins, Scale, User } from "lucide-react";
import PrintModal from "../report/components/PrintModal";
import ReportFilter from "../report/components/ReportFilter";
import LedgerTable from "../report/components/LedgerTable";
import SavedInvoices from "../report/components/SavedInvoices";
import useReport from "../report/hook/useReport";
import { showToast } from "../utils/toast.utils";

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

  const { handleGetReports, selectedBill, history } = useReport()

  useEffect(() => {
    handleGetReports()
  }, [])


  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bakiFilter, setBakiFilter] = useState("all"); // 'all' | 'outstanding_amt' | 'outstanding_fine' | 'no_outstanding'


  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setBakiFilter("all");
    showToast("Filters reset to default", "info");
  };


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

        <SavedInvoices filteredHistory={filteredHistory} />

      </div>

      {/* PRINT-ONLY TRADITIONAL ESTIMATE SLIP CONTAINER (Visible only in system print prompt) */}
      {selectedBill && createPortal(<LedgerTable selectedBill={selectedBill} />, document.body)}

      {selectedBill && <PrintModal selectedBill={selectedBill} />}


    </div>
  );
};

export default Reports;