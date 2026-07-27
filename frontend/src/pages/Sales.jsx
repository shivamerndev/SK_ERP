import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";

// Subcomponents
import SalesHeader from "../sales/components/SalesHeader";
import DatePresets from "../sales/components/DatePresets";
import KpiStats from "../sales/components/KpiStats";
import ComparisonStats from "../sales/components/ComparisonStats";
import ChartsSection from "../sales/components/ChartsSection";
import SalesFilterToolbar from "../sales/components/SalesFilterToolbar";
import SalesTable from "../sales/components/SalesTable";
import RecordSaleModal from "../sales/components/RecordSaleModal";
import ConfirmDeleteModal from "../sales/components/ConfirmDeleteModal";
import InvoiceDrawer from "../sales/components/InvoiceDrawer";
import LedgerTable from "../report/components/LedgerTable";

// Redux Custom Hook
import useSales from "../sales/useSales";

const Sales = () => {
  const {
    salesRecords,
    isLoading,
    fetchSalesRecords,
    createSaleBill,
    deleteSaleBill
  } = useSales();

  // Load Sales logs on mount
  useEffect(() => {
    fetchSalesRecords();
  }, []);

  // Page local state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateRangePreset, setDateRangePreset] = useState("All");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [bakiFilter, setBakiFilter] = useState("all");

  const [showCharts, setShowCharts] = useState(true);

  // Modals & Panels Active Selections
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Filter & Sort logs
  const filteredSales = useMemo(() => {
    let result = [...salesRecords];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        s =>
          s.billNo.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          (s.customerPhone && String(s.customerPhone).includes(q))
      );
    }

    // 2. Date Range presets
    if (dateRangePreset !== "All") {
      const todayStr = new Date().toISOString().split("T")[0];
      const today = new Date(todayStr);

      result = result.filter(s => {
        const sDate = new Date(s.date);

        if (dateRangePreset === "Today") {
          return s.date === todayStr;
        }
        if (dateRangePreset === "Yesterday") {
          const yest = new Date(today);
          yest.setDate(today.getDate() - 1);
          const yestStr = yest.toISOString().split("T")[0];
          return s.date === yestStr;
        }
        if (dateRangePreset === "ThisWeek") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          return sDate >= sevenDaysAgo && sDate <= today;
        }
        if (dateRangePreset === "ThisMonth") {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return sDate >= startOfMonth && sDate <= today;
        }
        if (dateRangePreset === "Custom") {
          if (customStartDate && customEndDate) {
            return s.date >= customStartDate && s.date <= customEndDate;
          }
          if (customStartDate) {
            return s.date >= customStartDate;
          }
          if (customEndDate) {
            return s.date <= customEndDate;
          }
        }
        return true;
      });
    }

    // 3. Balance Baki filter
    if (bakiFilter !== "all") {
      result = result.filter(s => {
        const bakiAmt = parseFloat(s.finalBaki?.amount || 0);
        const bakiFine = parseFloat(s.finalBaki?.fine || 0);

        if (bakiFilter === "outstanding_amt") {
          return bakiAmt > 0;
        }
        if (bakiFilter === "outstanding_fine") {
          return bakiFine > 0;
        }
        if (bakiFilter === "no_outstanding") {
          return bakiAmt === 0 && bakiFine === 0;
        }
        return true;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "date") {
        valA = a.date;
        valB = b.date;
        if (valA === valB) {
          return sortOrder === "asc"
            ? (a.totals?.amount || 0) - (b.totals?.amount || 0)
            : (b.totals?.amount || 0) - (a.totals?.amount || 0);
        }
      } else if (sortBy === "weight") {
        valA = a.totals?.netWt || 0;
        valB = b.totals?.netWt || 0;
      } else if (sortBy === "amount") {
        valA = a.totals?.amount || 0;
        valB = b.totals?.amount || 0;
      } else if (sortBy === "fine") {
        valA = a.totals?.fine || 0;
        valB = b.totals?.fine || 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [salesRecords, searchQuery, dateRangePreset, customStartDate, customEndDate, bakiFilter, sortBy, sortOrder]);

  // Real-time metrics
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalFine = 0;
    let totalWeight = 0;

    filteredSales.forEach(s => {
      totalRevenue += parseFloat(s.totals?.amount || 0);
      totalFine += parseFloat(s.totals?.fine || 0);
      totalWeight += parseFloat(s.totals?.netWt || 0);
    });

    return {
      totalRevenue,
      totalFine,
      totalWeight,
      activeInvoices: filteredSales.length
    };
  }, [filteredSales]);

  // comparisons
  const comparisons = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);

    const w1Start = new Date();
    w1Start.setDate(today.getDate() - 7);
    const w2Start = new Date();
    w2Start.setDate(today.getDate() - 14);

    let thisWeekRev = 0;
    let thisWeekFine = 0;
    let lastWeekRev = 0;
    let lastWeekFine = 0;

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let thisMonthRev = 0;
    let thisMonthFine = 0;
    let lastMonthRev = 0;
    let lastMonthFine = 0;

    salesRecords.forEach(s => {
      const sDate = new Date(s.date);
      const rev = parseFloat(s.totals?.amount || 0);
      const fine = parseFloat(s.totals?.fine || 0);

      // Week check
      if (sDate >= w1Start && sDate <= today) {
        thisWeekRev += rev;
        thisWeekFine += fine;
      } else if (sDate >= w2Start && sDate < w1Start) {
        lastWeekRev += rev;
        lastWeekFine += fine;
      }

      // Month check
      if (sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth) {
        thisMonthRev += rev;
        thisMonthFine += fine;
      } else if (
        (currentMonth === 0 && sDate.getFullYear() === currentYear - 1 && sDate.getMonth() === 11) ||
        (currentMonth > 0 && sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth - 1)
      ) {
        lastMonthRev += rev;
        lastMonthFine += fine;
      }
    });

    const calcChange = (current, previous) => {
      if (!previous) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      week: {
        rev: thisWeekRev,
        fine: thisWeekFine,
        revChange: calcChange(thisWeekRev, lastWeekRev),
        fineChange: calcChange(thisWeekFine, lastWeekFine),
        lastRev: lastWeekRev,
        lastFine: lastWeekFine
      },
      month: {
        rev: thisMonthRev,
        fine: thisMonthFine,
        revChange: calcChange(thisMonthRev, lastMonthRev),
        fineChange: calcChange(thisMonthFine, lastMonthFine),
        lastRev: lastMonthRev,
        lastFine: lastMonthFine
      }
    };
  }, [salesRecords]);

  // chartData
  const chartData = useMemo(() => {
    // 1. Dual-Axis
    const dateMap = {};
    filteredSales.forEach(s => {
      if (!dateMap[s.date]) {
        dateMap[s.date] = { date: s.date, Revenue: 0, FineWeight: 0 };
      }
      dateMap[s.date].Revenue += s.totals?.amount || 0;
      dateMap[s.date].FineWeight += s.totals?.fine || 0;
    });

    const dailyTrendData = Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-15);

    // 2. Item Performance
    const itemMap = {};
    filteredSales.forEach(s => {
      if (s.items) {
        s.items.forEach(it => {
          const name = String(it.item || "").trim().toUpperCase();
          if (name) {
            if (!itemMap[name]) {
              itemMap[name] = { name, Revenue: 0, Weight: 0 };
            }
            itemMap[name].Revenue += it.amount || 0;
            itemMap[name].Weight += it.netWt || 0;
          }
        });
      }
    });

    const itemPerformanceData = Object.values(itemMap)
      .sort((a, b) => b.Revenue - a.Revenue)
      .slice(0, 5);

    return { dailyTrendData, itemPerformanceData };
  }, [filteredSales]);

  // Export to CSV
  const handleExportCSV = () => {
    try {
      let csv = "data:text/csv;charset=utf-8,";
      csv += "Bill No,Date,Customer Name,Phone,Address,Total Net Weight(g),Total Labor Cash(INR),Total Fine Weight(g),Outstanding Baki(INR),Outstanding Fine(g),Posted To Udhaar\r\n";

      filteredSales.forEach(s => {
        const row = [
          s.billNo,
          s.date,
          `"${s.customerName}"`,
          s.customerPhone || "",
          `"${s.customerAddress || ""}"`,
          s.totals?.netWt || 0,
          s.totals?.amount || 0,
          s.totals?.fine || 0,
          s.finalBaki?.amount || 0,
          s.finalBaki?.fine || 0,
          s.postedToUdhaar ? "YES" : "NO"
        ];
        csv += row.join(",") + "\r\n";
      });

      const encoded = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encoded);
      link.setAttribute("download", `rough_estimates_sales_report_${new Date().toISOString().split("T")[0]}.csv`);
      link.click();
      toast.success("CSV Statement exported successfully!");
    } catch (e) {
      toast.error("Export failed.");
    }
  };

  // Handlers
  const handleRecordBillSubmit = async (billData) => {
    try {
      await createSaleBill(billData);
      setIsRecordOpen(false);
    } catch (err) {
      // toast trigger handled inside hook
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSale) return;
    try {
      await deleteSaleBill(selectedSale._id);
      setIsDeleteConfirmOpen(false);
      setSelectedSale(null);
    } catch (err) {
      // toast trigger handled inside hook
    }
  };

  const handlePrint = (bill) => {
    setSelectedSale(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const showClearButton = useMemo(() => {
    return searchQuery !== "" || dateRangePreset !== "All" || bakiFilter !== "all";
  }, [searchQuery, dateRangePreset, bakiFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("date");
    setSortOrder("desc");
    setDateRangePreset("All");
    setCustomStartDate("");
    setCustomEndDate("");
    setBakiFilter("all");
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <SalesHeader 
        onRecordBillClick={() => setIsRecordOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Date Range Preset Filters */}
      <DatePresets
        dateRangePreset={dateRangePreset}
        setDateRangePreset={setDateRangePreset}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* KPI stats Grid */}
      <KpiStats stats={stats} />

      {/* Weekly & Monthly Performance comparison details */}
      <ComparisonStats comparisons={comparisons} />

      {/* Recharts section visual trend panels */}
      <ChartsSection
        chartData={chartData}
        showCharts={showCharts}
        setShowCharts={setShowCharts}
      />

      {/* Filter toolbar searching & sorting panel */}
      <SalesFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        bakiFilter={bakiFilter}
        setBakiFilter={setBakiFilter}
        showClearButton={showClearButton}
        onClearFilters={handleClearFilters}
      />

      {/* Sales Logs Table Grid */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 p-12 text-center rounded-2xl text-slate-400 font-semibold shadow-sm">
          Loading sales records from database...
        </div>
      ) : (
        <SalesTable
          filteredSales={filteredSales}
          totalRecordsCount={salesRecords.length}
          onPrintClick={(s) => {
            setSelectedSale(s);
            setIsInvoiceOpen(true);
          }}
          onDeleteClick={(s) => {
            setSelectedSale(s);
            setIsDeleteConfirmOpen(true);
          }}
        />
      )}

      {/* Modal - RECORD NEW BILL */}
      <RecordSaleModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        onSubmit={handleRecordBillSubmit}
      />

      {/* Modal - DELETE CONFIRMATION */}
      <ConfirmDeleteModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        selectedSale={selectedSale}
      />

      {/* Drawer - SLIDEOUT TAX BILL RECEIPT */}
      <InvoiceDrawer
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        selectedSale={selectedSale}
        onPrint={handlePrint}
      />

      {/* Print slip portal render layout for print prompt */}
      {selectedSale && createPortal(<LedgerTable selectedBill={selectedSale} />, document.body)}

    </div>
  );
};

export default Sales;