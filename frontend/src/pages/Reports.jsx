import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { History } from "lucide-react";
import PrintModal from "../report/components/PrintModal";
import ReportFilter from "../report/components/ReportFilter";
import LedgerTable from "../report/components/LedgerTable";
import SavedInvoices from "../report/components/SavedInvoices";
import useReport from "../report/hook/useReport";
import { showToast } from "../utils/toast.utils";
import TopCustomers from "../report/components/TopCustomers";
import SummaryCard from "../report/components/SummaryCard";


const Reports = () => {

  const { handleGetReports, selectedBill, history } = useReport()

  useEffect(() => {
    handleGetReports()
  }, [])


  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bakiFilter, setBakiFilter] = useState("all"); // 'all' | 'outstanding_amt' | 'outstanding_fine' | 'no_outstanding'



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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-3 screen-only">
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

      <SummaryCard metrics={metrics} />

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

        <TopCustomers topClients={topClients} />

        <SavedInvoices filteredHistory={filteredHistory} />

      </div>

      {/* PRINT-ONLY TRADITIONAL ESTIMATE SLIP CONTAINER (Visible only in system print prompt) */}
      {selectedBill && createPortal(<LedgerTable selectedBill={selectedBill} />, document.body)}

      {selectedBill && <PrintModal selectedBill={selectedBill} />}


    </div>
  );
};

export default Reports;