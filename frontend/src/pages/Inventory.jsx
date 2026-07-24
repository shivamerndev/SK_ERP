import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Download,
  Upload,
  ChevronRight,
  Info,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  AlertCircle,
  Filter,
  FileText,
  CheckCircle,
  ChevronDown,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Box,
  Sliders,
  Scale
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts";

// ----------------------------------------------------
// INITIAL SEED DESIGNS (Silver Jewelry Wholesaler Catalog)
// ----------------------------------------------------
const INITIAL_DESIGNS = [
  {
    id: "dsn-1",
    sku: "SLV-PY-001",
    name: "Sterling Bridal Payal (Anklet)",
    category: "Anklets",
    purity: 925, // 925 Sterling
    weight: 42.5, // grams per piece
    finish: "Oxidized Antique",
    makingChargeType: "PER_GRAM",
    makingCharge: 12, // ₹12 per gram
    stocks: 25, // pieces
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&auto=format&fit=crop&q=60",
    notes: "Heavy traditional design. Highly popular in wedding season."
  },
  {
    id: "dsn-2",
    sku: "SLV-RG-002",
    name: "Oxidized Floral Band Ring",
    category: "Rings",
    purity: 925,
    weight: 6.8,
    finish: "Oxidized Antique",
    makingChargeType: "PER_GRAM",
    makingCharge: 15, // ₹15 per gram
    stocks: 150,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60",
    notes: "Lightweight unisex design. Sells in bulk packs of 10."
  },
  {
    id: "dsn-3",
    sku: "SLV-KD-003",
    name: "Classic Rajasthani Kada (Bracelet)",
    category: "Bracelets",
    purity: 925,
    weight: 35.0,
    finish: "High-Polish White",
    makingChargeType: "PER_GRAM",
    makingCharge: 10,
    stocks: 45,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60",
    notes: "Screw lock mechanism. Solid silver weight."
  },
  {
    id: "dsn-4",
    sku: "SLV-CH-004",
    name: "Unisex Curb Link Chain",
    category: "Chains",
    purity: 925,
    weight: 18.2,
    finish: "Rhodium Plated",
    makingChargeType: "PER_GRAM",
    makingCharge: 8,
    stocks: 80,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60",
    notes: "Tarnish resistant Rhodium shield. 20-inch standard length."
  },
  {
    id: "dsn-5",
    sku: "SLV-TR-005",
    name: "Traditional Adjustable Bichhiya (Toe Rings)",
    category: "Toe Rings",
    purity: 900, // 90% Coin silver
    weight: 4.5,
    finish: "Pure Silver Polish",
    makingChargeType: "FLAT_PIECE",
    makingCharge: 40, // ₹40 flat making charge per piece
    stocks: 300,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=150&auto=format&fit=crop&q=60",
    notes: "Sold in pairs. Fast moving daily wear ornament."
  },
  {
    id: "dsn-6",
    sku: "SLV-ER-006",
    name: "Sterling Filigree Jhumkas",
    category: "Earrings",
    purity: 925,
    weight: 12.4,
    finish: "Gold Vermeil",
    makingChargeType: "FLAT_PIECE",
    makingCharge: 250, // ₹250 flat gold plating charge
    stocks: 8, // Low Stock Alert
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60",
    notes: "18K Gold Plated Sterling Silver base. High premium craftsmanship."
  }
];

const STOCKS_LIMIT = 10; // Wholesale low stock trigger

const Inventory = () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  const [designs, setDesigns] = useState(() => {
    const saved = localStorage.getItem("erp_silver_inventory");
    return saved ? JSON.parse(saved) : INITIAL_DESIGNS;
  });

  const [liveSilverRate, setLiveSilverRate] = useState(() => {
    const savedRate = localStorage.getItem("erp_live_silver_rate");
    return savedRate ? parseFloat(savedRate) : 85.0; // ₹85 per gram default
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [purityFilter, setPurityFilter] = useState("All"); // All, 925, 900
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [finishFilter, setFinishFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // All, Available, LowStock, OutOfStock

  const [sortBy, setSortBy] = useState("sku"); // sku, name, weight, stocks, value
  const [sortOrder, setSortOrder] = useState("asc");

  const [showCharts, setShowCharts] = useState(true);

  // Modals & Drawers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);

  const [selectedDesign, setSelectedDesign] = useState(null);

  // Forms
  const [addForm, setAddForm] = useState({
    sku: "",
    name: "",
    category: "Rings",
    purity: 925,
    weight: "",
    finish: "High-Polish White",
    makingChargeType: "PER_GRAM",
    makingCharge: "",
    stocks: "",
    notes: "",
    imageUrl: ""
  });

  const [editForm, setEditForm] = useState({
    id: "",
    sku: "",
    name: "",
    category: "",
    purity: 925,
    weight: "",
    finish: "",
    makingChargeType: "PER_GRAM",
    makingCharge: "",
    stocks: "",
    notes: "",
    imageUrl: ""
  });

  const [adjustForm, setAdjustForm] = useState({
    type: "ADD", // ADD, REMOVE
    qty: "",
    reason: "Purchase Receipt"
  });

  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [adjustErrors, setAdjustErrors] = useState({});

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  
  const fileInputRef = useRef(null);

  // ----------------------------------------------------
  // PERSIST TO LOCAL STORAGE
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_silver_inventory", JSON.stringify(designs));
  }, [designs]);

  useEffect(() => {
    localStorage.setItem("erp_live_silver_rate", liveSilverRate.toString());
  }, [liveSilverRate]);

  // Keep selected design synchronized in case of stock adjust
  useEffect(() => {
    if (selectedDesign) {
      const current = designs.find(d => d.id === selectedDesign.id);
      if (current) {
        setSelectedDesign(current);
      }
    }
  }, [designs]);

  // ----------------------------------------------------
  // TOAST HANDLER
  // ----------------------------------------------------
  const triggerToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ----------------------------------------------------
  // BUSINESS CALCULATIONS FOR WHOLSELLER STOCKS
  // ----------------------------------------------------
  const getSilverCost = (item, rate) => {
    // Metal value = weight * silver rate * purity percentage
    return item.weight * rate * (item.purity / 1000);
  };

  const getMakingCost = (item) => {
    if (item.makingChargeType === "PER_GRAM") {
      return item.weight * item.makingCharge;
    }
    return item.makingCharge;
  };

  const getWholesaleUnitCost = (item, rate) => {
    const costBeforeGST = getSilverCost(item, rate) + getMakingCost(item);
    // Standard GST on silver ornaments in India is 3%
    return costBeforeGST * 1.03;
  };

  const getStockValuation = (item, rate) => {
    return item.stocks * getWholesaleUnitCost(item, rate);
  };

  const getPureSilverWeight = (item) => {
    return item.stocks * item.weight * (item.purity / 1000);
  };

  // ----------------------------------------------------
  // CALCULATE SUMMARY KPI STATS
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let uniqueSKUs = designs.length;
    let totalPieces = 0;
    let totalGrossWeight = 0;
    let totalValuation = 0;
    let pureSilverWeight = 0;
    let lowStockCount = 0;

    designs.forEach(d => {
      totalPieces += Number(d.stocks || 0);
      totalGrossWeight += Number(d.stocks || 0) * Number(d.weight || 0);
      totalValuation += getStockValuation(d, liveSilverRate);
      pureSilverWeight += getPureSilverWeight(d);
      
      if (d.stocks <= STOCKS_LIMIT) {
        lowStockCount++;
      }
    });

    return {
      uniqueSKUs,
      totalPieces,
      totalGrossWeight,
      totalValuation,
      pureSilverWeight,
      lowStockCount
    };
  }, [designs, liveSilverRate]);

  // ----------------------------------------------------
  // FILTERING & SORTING DIRECTORY
  // ----------------------------------------------------
  const filteredDesigns = useMemo(() => {
    let result = [...designs];

    // Search SKU / Name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        d =>
          d.sku.toLowerCase().includes(q) ||
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    // Purity Filter
    if (purityFilter !== "All") {
      result = result.filter(d => d.purity === Number(purityFilter));
    }

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter(d => d.category === categoryFilter);
    }

    // Finish Filter
    if (finishFilter !== "All") {
      result = result.filter(d => d.finish === finishFilter);
    }

    // Stock Status
    if (stockFilter !== "All") {
      result = result.filter(d => {
        if (stockFilter === "Available") return d.stocks > STOCKS_LIMIT;
        if (stockFilter === "LowStock") return d.stocks > 0 && d.stocks <= STOCKS_LIMIT;
        if (stockFilter === "OutOfStock") return d.stocks <= 0;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "sku") {
        valA = a.sku.toLowerCase();
        valB = b.sku.toLowerCase();
      } else if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "weight") {
        valA = a.weight;
        valB = b.weight;
      } else if (sortBy === "stocks") {
        valA = a.stocks;
        valB = b.stocks;
      } else if (sortBy === "value") {
        valA = getStockValuation(a, liveSilverRate);
        valB = getStockValuation(b, liveSilverRate);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [designs, searchQuery, purityFilter, categoryFilter, finishFilter, stockFilter, sortBy, sortOrder, liveSilverRate]);

  // ----------------------------------------------------
  // CHART DATA PREPARATION
  // ----------------------------------------------------
  const chartData = useMemo(() => {
    // 1. Weight by Category
    const categoryWeight = {};
    designs.forEach(d => {
      const gWeight = (d.stocks || 0) * (d.weight || 0);
      categoryWeight[d.category] = (categoryWeight[d.category] || 0) + Math.round(gWeight);
    });

    const weightCategoryData = Object.keys(categoryWeight).map(cat => ({
      name: cat,
      "Total Weight (g)": categoryWeight[cat]
    }));

    // 2. Metal Finishes mix
    const finishPieces = {};
    designs.forEach(d => {
      finishPieces[d.finish] = (finishPieces[d.finish] || 0) + d.stocks;
    });

    const finishVarietyData = Object.keys(finishPieces).map(fin => ({
      name: fin,
      Pieces: finishPieces[fin]
    }));

    // 3. Stock Status breakdown
    let avCount = 0;
    let lowCount = 0;
    let zeroCount = 0;

    designs.forEach(d => {
      if (d.stocks <= 0) zeroCount++;
      else if (d.stocks <= STOCKS_LIMIT) lowCount++;
      else avCount++;
    });

    const statusPieData = [
      { name: "Sufficient (>10 pc)", value: avCount, color: "#10b981" },
      { name: "Low Stock (1-10 pc)", value: lowCount, color: "#f59e0b" },
      { name: "Out of Stock", value: zeroCount, color: "#ef4444" }
    ].filter(d => d.value > 0);

    return { weightCategoryData, finishVarietyData, statusPieData };
  }, [designs]);

  // ----------------------------------------------------
  // SUBMIT ADD DESIGN
  // ----------------------------------------------------
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const weightVal = parseFloat(addForm.weight);
    const chargeVal = parseFloat(addForm.makingCharge);
    const stockVal = parseInt(addForm.stocks);

    if (!addForm.sku.trim()) {
      errors.sku = "SKU is required";
    } else if (designs.some(d => d.sku.toUpperCase() === addForm.sku.toUpperCase().trim())) {
      errors.sku = "Design SKU code already exists";
    }

    if (!addForm.name.trim()) errors.name = "Design Name is required";
    if (isNaN(weightVal) || weightVal <= 0) errors.weight = "Weight must be greater than 0";
    if (isNaN(chargeVal) || chargeVal < 0) errors.makingCharge = "Making charge must be positive";
    if (isNaN(stockVal) || stockVal < 0) errors.stocks = "Stocks must be 0 or higher";

    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    const newDesign = {
      id: "dsn-" + Date.now(),
      sku: addForm.sku.toUpperCase().trim(),
      name: addForm.name.trim(),
      category: addForm.category,
      purity: Number(addForm.purity),
      weight: weightVal,
      finish: addForm.finish,
      makingChargeType: addForm.makingChargeType,
      makingCharge: chargeVal,
      stocks: stockVal,
      notes: addForm.notes.trim() || "No notes added.",
      imageUrl: addForm.imageUrl.trim() || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150"
    };

    setDesigns(prev => [...prev, newDesign]);
    setIsAddOpen(false);
    
    // Reset Form
    setAddForm({
      sku: "",
      name: "",
      category: "Rings",
      purity: 925,
      weight: "",
      finish: "High-Polish White",
      makingChargeType: "PER_GRAM",
      makingCharge: "",
      stocks: "",
      notes: "",
      imageUrl: ""
    });
    setAddErrors({});
    triggerToast(`Design SKU ${newDesign.sku} added to wholeseller registry!`);
  };

  // ----------------------------------------------------
  // SUBMIT EDIT DESIGN
  // ----------------------------------------------------
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const weightVal = parseFloat(editForm.weight);
    const chargeVal = parseFloat(editForm.makingCharge);
    const stockVal = parseInt(editForm.stocks);

    if (!editForm.sku.trim()) {
      errors.sku = "SKU is required";
    } else if (designs.some(d => d.sku.toUpperCase() === editForm.sku.toUpperCase().trim() && d.id !== editForm.id)) {
      errors.sku = "Design SKU code already registered to another item";
    }

    if (!editForm.name.trim()) errors.name = "Design name is required";
    if (isNaN(weightVal) || weightVal <= 0) errors.weight = "Weight must be positive";
    if (isNaN(chargeVal) || chargeVal < 0) errors.makingCharge = "Making charge must be positive";
    if (isNaN(stockVal) || stockVal < 0) errors.stocks = "Stocks must be positive";

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setDesigns(prev => prev.map(d => {
      if (d.id === editForm.id) {
        return {
          ...d,
          sku: editForm.sku.toUpperCase().trim(),
          name: editForm.name.trim(),
          category: editForm.category,
          purity: Number(editForm.purity),
          weight: weightVal,
          finish: editForm.finish,
          makingChargeType: editForm.makingChargeType,
          makingCharge: chargeVal,
          stocks: stockVal,
          notes: editForm.notes.trim(),
          imageUrl: editForm.imageUrl.trim() || d.imageUrl
        };
      }
      return d;
    }));

    setIsEditOpen(false);
    setEditErrors({});
    triggerToast(`Design ${editForm.sku} updated successfully.`);
  };

  // ----------------------------------------------------
  // DELETE DESIGN
  // ----------------------------------------------------
  const handleDeleteConfirm = () => {
    if (!selectedDesign) return;
    setDesigns(prev => prev.filter(d => d.id !== selectedDesign.id));
    setIsDeleteOpen(false);
    triggerToast(`Design SKU "${selectedDesign.sku}" deleted.`);
    setSelectedDesign(null);
  };

  // ----------------------------------------------------
  // QUICK QUANTITY ADJUSTMENT
  // ----------------------------------------------------
  const handleAdjustStock = (e) => {
    e.preventDefault();
    const errors = {};
    const adjustQty = parseInt(adjustForm.qty);

    if (isNaN(adjustQty) || adjustQty <= 0) {
      errors.qty = "Quantity must be a positive integer";
    }

    if (Object.keys(errors).length > 0) {
      setAdjustErrors(errors);
      return;
    }

    setDesigns(prev => prev.map(d => {
      if (d.id === selectedDesign.id) {
        let finalStock = d.stocks;
        if (adjustForm.type === "ADD") {
          finalStock += adjustQty;
        } else {
          finalStock = Math.max(0, finalStock - adjustQty);
        }
        return {
          ...d,
          stocks: finalStock
        };
      }
      return d;
    }));

    setIsAdjustStockOpen(false);
    setAdjustForm({ type: "ADD", qty: "", reason: "Purchase Receipt" });
    setAdjustErrors({});
    triggerToast(`Stock quantity modified for ${selectedDesign.sku}.`);
  };

  // ----------------------------------------------------
  // BACKUPS
  // ----------------------------------------------------
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(designs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const fileName = `silver_wholeseller_inventory_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
      triggerToast("Inventory backup downloaded!");
    } catch (e) {
      triggerToast("Failed to backup stock registry.", "error");
    }
  };

  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "SKU,Design Name,Category,Purity(%),Weight(g),Finish,Charge Type,Making Charge,Stocks (pcs),Total Weight(g),Unit Cost(INR),Total Valuation(INR)\r\n";

      filteredDesigns.forEach(d => {
        const uCost = getWholesaleUnitCost(d, liveSilverRate);
        const tVal = getStockValuation(d, liveSilverRate);
        const row = [
          d.sku,
          `"${d.name}"`,
          d.category,
          d.purity,
          d.weight,
          d.finish,
          d.makingChargeType,
          d.makingCharge,
          d.stocks,
          d.stocks * d.weight,
          uCost.toFixed(2),
          tVal.toFixed(2)
        ];
        csvContent += row.join(",") + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `silver_wholesale_stocks_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      triggerToast("CSV stock report exported!");
    } catch (e) {
      triggerToast("CSV export failed.", "error");
    }
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) {
          triggerToast("Invalid format: Backup must be a list of designs.", "error");
          return;
        }

        const isValid = data.every(d =>
          d.id &&
          d.sku &&
          d.name &&
          d.category &&
          typeof d.purity === "number" &&
          typeof d.weight === "number" &&
          d.finish &&
          typeof d.stocks === "number"
        );

        if (!isValid) {
          triggerToast("Structure properties do not match wholesale schema.", "error");
          return;
        }

        setDesigns(data);
        triggerToast("Stock registry restored successfully!", "success");
      } catch (err) {
        triggerToast("Failed to parse JSON backup.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="space-y-6">

      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all duration-300 transform scale-100 hover:scale-102 ${
              toast.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : toast.type === "error" 
                ? "bg-rose-50 text-rose-800 border-rose-200" 
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Live Market Controller & Title Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
        
        {/* Title Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">Silver Wholesaler Inventory & Stocks</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Valuate stock contents by weight (grams), manage purity standards (925 sterling / 900 coin), stamp barcode labels, and trigger stock alerts.
          </p>
        </div>

        {/* Dynamic Silver rate adjuster + actions */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/30 p-3 rounded-xl border border-white/10 self-start xl:self-auto">
          
          {/* Rate Adjuster */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Daily Silver Rate</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-extrabold">₹</span>
                <input
                  type="number"
                  step={0.1}
                  value={liveSilverRate}
                  onChange={(e) => {
                    const r = parseFloat(e.target.value);
                    setLiveSilverRate(isNaN(r) ? 0 : r);
                  }}
                  className="w-16 bg-slate-800/80 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-black text-center focus:outline-none focus:border-indigo-500 text-yellow-400"
                />
                <span className="text-[10px] text-slate-400">/ gram</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {/* Directory buttons */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {/* Add New Design */}
            <button
              onClick={() => {
                setAddForm({
                  sku: "",
                  name: "",
                  category: "Rings",
                  purity: 925,
                  weight: "",
                  finish: "High-Polish White",
                  makingChargeType: "PER_GRAM",
                  makingCharge: "",
                  stocks: "",
                  notes: "",
                  imageUrl: ""
                });
                setAddErrors({});
                setIsAddOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-500/10"
            >
              <Plus className="w-4 h-4" />
              Add Design SKU
            </button>

            {/* Backups */}
            <button
              onClick={handleExportCSV}
              title="Download Stock CSV Statement"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportJSON}
              title="JSON backup"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all cursor-pointer text-xs font-bold"
            >
              JSON
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              title="Restore Backup"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
          </div>

        </div>

      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Unique Designs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Active Catalog</span>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.uniqueSKUs}</h3>
            <p className="text-[10px] text-slate-400">Unique jewelry SKUs</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Total Pieces */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Stock Pieces</span>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.totalPieces.toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">Combined jewelry units</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Box className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: Gross Weight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Gross Weight</span>
            <h3 className="text-2xl font-extrabold text-slate-800">
              {(stats.totalGrossWeight / 1000).toFixed(2)} kg
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold">{stats.totalGrossWeight.toLocaleString("en-IN")} grams gross</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Scale className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Pure Silver weight */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Fine Silver Content</span>
            <h3 className="text-2xl font-extrabold text-slate-800">
              {(stats.pureSilverWeight / 1000).toFixed(2)} kg
            </h3>
            <p className="text-[10px] text-emerald-600 font-bold">{(stats.pureSilverWeight).toFixed(1)}g pure metal</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 5: Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:translate-y-[-2px] transition-transform duration-200">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Stock Valuation</span>
            <h3 className="text-2xl font-extrabold text-slate-800">₹{Math.round(stats.totalValuation).toLocaleString("en-IN")}</h3>
            <p className="text-[10px] text-slate-400">At live ₹{liveSilverRate}/g rate</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Expandable Charts panel */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Warehouse Stocks Visual Analytics</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{showCharts ? "Hide Analytics" : "Show Analytics"}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCharts ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showCharts && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Chart 1: Weight by Category */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Silver Weight Distribution (Grams by Category)</h4>
              <div className="h-64">
                {chartData.weightCategoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.weightCategoryData} margin={{ left: -15, right: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                        formatter={(val) => [`${val.toLocaleString("en-IN")} g`, "Gross Weight"]}
                      />
                      <Bar dataKey="Total Weight (g)" fill="#818cf8" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">No items in inventory.</div>
                )}
              </div>
            </div>

            {/* Chart 2: Finish variety distribution */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Stock Pieces Mix by Metal Finish Style</h4>
              <div className="h-64">
                {chartData.finishVarietyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.finishVarietyData} margin={{ left: -15, right: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                        formatter={(val) => [`${val} pcs`]}
                      />
                      <Bar dataKey="Pieces" fill="#34d399" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">No pieces in stock.</div>
                )}
              </div>
            </div>

            {/* Chart 3: Stock alerts status */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Inventory Stock Level Distribution</h4>
                <div className="h-44 flex items-center justify-center">
                  {chartData.statusPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => [`${val} Design(s)`, "Count"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-xs text-center">No stock status statistics.</div>
                  )}
                </div>
              </div>
              <div className="flex justify-around text-xs mt-2 border-t border-slate-200/50 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Sufficient</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Low Stock</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Out of stock</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Directory Table Area */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Search & Advanced Filters Panel */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs by SKU code or name..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick sorting dropdowns */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="sku">SKU Code</option>
                <option value="name">Design Name</option>
                <option value="weight">Piece Weight</option>
                <option value="stocks">Stock Quantity</option>
                <option value="value">Stock Valuation</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold cursor-pointer"
                title="Toggle Sort Order"
              >
                {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
              </button>
            </div>

          </div>

          {/* Filtering row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Filter by Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jewelry Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Rings">Rings</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Chains">Chains</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Anklets">Anklets (Payal)</option>
                <option value="Toe Rings">Toe Rings</option>
              </select>
            </div>

            {/* Filter by Purity */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Silver Purity</label>
              <select
                value={purityFilter}
                onChange={(e) => setPurityFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Purities</option>
                <option value="925">925 Sterling (92.5%)</option>
                <option value="900">900 Coin Silver (90.0%)</option>
                <option value="999">999 Fine Silver (99.9%)</option>
              </select>
            </div>

            {/* Filter by Finish */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metal Finish Style</label>
              <select
                value={finishFilter}
                onChange={(e) => setFinishFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Finishes</option>
                <option value="Oxidized Antique">Oxidized Antique</option>
                <option value="High-Polish White">High-Polish White</option>
                <option value="Rhodium Plated">Rhodium Plated</option>
                <option value="Gold Vermeil">Gold Vermeil</option>
                <option value="Pure Silver Polish">Pure Silver Polish</option>
              </select>
            </div>

            {/* Stock Level Alerts */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warehouse Level</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="All">All Stock Levels</option>
                <option value="Available">Sufficient (&gt;10 pcs)</option>
                <option value="LowStock">Low Stock (1-10 pcs)</option>
                <option value="OutOfStock">Out of Stock (0 pcs)</option>
              </select>
            </div>

            {/* Clear Filters (if active) */}
            {(categoryFilter !== "All" || purityFilter !== "All" || finishFilter !== "All" || stockFilter !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setPurityFilter("All");
                  setFinishFilter("All");
                  setStockFilter("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}

          </div>
        </div>

        {/* Directory Table element */}
        <div className="overflow-x-auto">
          {filteredDesigns.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Design SKU & Name</th>
                  <th className="px-6 py-4">Details (Purity / Finish)</th>
                  <th className="px-6 py-4">Weight (g)</th>
                  <th className="px-6 py-4">Wholesale charges</th>
                  <th className="px-6 py-4 text-center">Available Stock</th>
                  <th className="px-6 py-4 text-right">Computed Unit Cost</th>
                  <th className="px-6 py-4 text-right">Stock Valuation</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDesigns.map((d) => {
                  const unitCost = getWholesaleUnitCost(d, liveSilverRate);
                  const stockVal = getStockValuation(d, liveSilverRate);
                  const grossWeight = d.stocks * d.weight;
                  const isLow = d.stocks <= STOCKS_LIMIT;
                  const isOut = d.stocks <= 0;

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* SKU and name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={d.imageUrl}
                            alt={d.name}
                            className="w-10 h-10 rounded-xl border border-slate-200 object-cover flex-shrink-0 bg-slate-50 shadow-sm"
                          />
                          <div className="flex flex-col min-w-0">
                            <span 
                              onClick={() => {
                                setSelectedDesign(d);
                                setIsTagOpen(true);
                              }}
                              className="font-mono font-bold text-xs text-indigo-600 hover:underline cursor-pointer"
                              title="Click to view Barcode tag"
                            >
                              {d.sku}
                            </span>
                            <span className="font-semibold text-slate-800 truncate text-xs mt-0.5">{d.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Purity & Finish */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-700">{d.finish}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            {d.purity === 925 ? "925 Sterling" : d.purity === 999 ? "999 Fine" : `${d.purity} grade`}
                          </span>
                        </div>
                      </td>

                      {/* Weight per piece */}
                      <td className="px-6 py-4 font-semibold text-slate-700 text-xs">
                        {d.weight.toFixed(2)} g
                      </td>

                      {/* Making charges */}
                      <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                        {d.makingChargeType === "PER_GRAM" ? (
                          <span>₹{d.makingCharge}/g</span>
                        ) : (
                          <span>₹{d.makingCharge} flat</span>
                        )}
                      </td>

                      {/* Available Stock */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                            isOut 
                              ? "bg-rose-50 text-rose-700 border-rose-200" 
                              : isLow 
                              ? "bg-amber-50 text-amber-700 border-amber-200" 
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                            {d.stocks} pcs
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{grossWeight.toFixed(1)}g total</span>
                        </div>
                      </td>

                      {/* Unit cost */}
                      <td className="px-6 py-4 text-right text-slate-700 font-bold text-xs">
                        ₹{Math.round(unitCost).toLocaleString("en-IN")}
                        <span className="block text-[9px] text-slate-400 font-semibold">with 3% GST</span>
                      </td>

                      {/* Stock Valuation */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-extrabold text-slate-800 text-xs">
                          ₹{Math.round(stockVal).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Quick Adjust Stock */}
                          <button
                            onClick={() => {
                              setSelectedDesign(d);
                              setAdjustForm({ type: "ADD", qty: "", reason: "Purchase Receipt" });
                              setAdjustErrors({});
                              setIsAdjustStockOpen(true);
                            }}
                            className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                            title="Adjust Stock Qty"
                          >
                            +/- Stock
                          </button>

                          {/* Print Tag */}
                          <button
                            onClick={() => {
                              setSelectedDesign(d);
                              setIsTagOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-50 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="Barcode Tag"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => {
                              setEditForm({
                                id: d.id,
                                sku: d.sku,
                                name: d.name,
                                category: d.category,
                                purity: d.purity,
                                weight: d.weight,
                                finish: d.finish,
                                makingChargeType: d.makingChargeType,
                                makingCharge: d.makingCharge,
                                stocks: d.stocks,
                                notes: d.notes,
                                imageUrl: d.imageUrl
                              });
                              setEditErrors({});
                              setIsEditOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setSelectedDesign(d);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove design"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <span className="text-base font-semibold">No jewelry designs found matching filters</span>
              <p className="text-xs text-slate-400 mt-1">Try resetting search or dropdown filters above</p>
            </div>
          )}
        </div>

        {/* Directory Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Displaying {filteredDesigns.length} of {designs.length} unique catalog designs</span>
          <span>Calculations depend on daily Silver Metal base rate: ₹{liveSilverRate}/gram</span>
        </div>

      </div>

      {/* --- ADD DESIGN MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Add New Silver Design SKU</h3>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Grid 1: SKU & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* SKU Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Design SKU Code *</label>
                  <input
                    type="text"
                    value={addForm.sku}
                    onChange={(e) => setAddForm(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="e.g. SLV-RG-001"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono font-bold ${
                      addErrors.sku ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.sku && <span className="text-xs font-semibold text-rose-500">{addErrors.sku}</span>}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Design Name *</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Floral Band Ring"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.name ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.name && <span className="text-xs font-semibold text-rose-500">{addErrors.name}</span>}
                </div>

              </div>

              {/* Grid 2: Category, Purity & Finish */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                
                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Category</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                    className="px-2 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Chains">Chains</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Anklets">Anklets (Payal)</option>
                    <option value="Toe Rings">Toe Rings</option>
                  </select>
                </div>

                {/* Purity */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Silver Purity</label>
                  <select
                    value={addForm.purity}
                    onChange={(e) => setAddForm(prev => ({ ...prev, purity: Number(e.target.value) }))}
                    className="px-2 py-2 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={925}>925 Sterling</option>
                    <option value={900}>900 Coin</option>
                    <option value={999}>999 Fine</option>
                    <option value={800}>800 payal</option>
                  </select>
                </div>

                {/* Finish */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Metal Finish</label>
                  <select
                    value={addForm.finish}
                    onChange={(e) => setAddForm(prev => ({ ...prev, finish: e.target.value }))}
                    className="px-2 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="High-Polish White">High-Polish White</option>
                    <option value="Oxidized Antique">Oxidized Antique</option>
                    <option value="Rhodium Plated">Rhodium Plated</option>
                    <option value="Gold Vermeil">Gold Vermeil</option>
                    <option value="Pure Silver Polish">Pure Silver Polish</option>
                  </select>
                </div>

              </div>

              {/* Grid 3: Weight & Stock */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Weight */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Weight per Piece (grams) *</label>
                  <input
                    type="number"
                    step={0.01}
                    value={addForm.weight}
                    onChange={(e) => setAddForm(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g. 12.4"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.weight ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.weight && <span className="text-xs font-semibold text-rose-500">{addErrors.weight}</span>}
                </div>

                {/* Stock pieces */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Wholesale Qty in Stock *</label>
                  <input
                    type="number"
                    value={addForm.stocks}
                    onChange={(e) => setAddForm(prev => ({ ...prev, stocks: e.target.value }))}
                    placeholder="Total pieces"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.stocks ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.stocks && <span className="text-xs font-semibold text-rose-500">{addErrors.stocks}</span>}
                </div>

              </div>

              {/* Grid 4: Making Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                
                {/* Charge type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Making Charge Type</label>
                  <select
                    value={addForm.makingChargeType}
                    onChange={(e) => setAddForm(prev => ({ ...prev, makingChargeType: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-sm font-semibold bg-white"
                  >
                    <option value="PER_GRAM">₹ / Gram Weight (Standard)</option>
                    <option value="FLAT_PIECE">₹ Flat per Piece (Surtax)</option>
                  </select>
                </div>

                {/* Charge Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Charge Rate (₹) *</label>
                  <input
                    type="number"
                    value={addForm.makingCharge}
                    onChange={(e) => setAddForm(prev => ({ ...prev, makingCharge: e.target.value }))}
                    placeholder="e.g. 15 or 250"
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      addErrors.makingCharge ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {addErrors.makingCharge && <span className="text-xs font-semibold text-rose-500">{addErrors.makingCharge}</span>}
                </div>

              </div>

              {/* Image URL & Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Image URL (Optional)</label>
                <input
                  type="text"
                  value={addForm.imageUrl}
                  onChange={(e) => setAddForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/jewelry-image.jpg"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Design Notes</label>
                <textarea
                  value={addForm.notes}
                  onChange={(e) => setAddForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional design specifics, metal purity certificate tags, or manufacturing details."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
                />
              </div>

              {/* Modal Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Register Design
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- EDIT DESIGN MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Edit Wholesaler Design SKU</h3>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Grid 1: SKU & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* SKU Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Design SKU Code *</label>
                  <input
                    type="text"
                    value={editForm.sku}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sku: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono font-bold ${
                      editErrors.sku ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.sku && <span className="text-xs font-semibold text-rose-500">{editErrors.sku}</span>}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Design Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.name ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.name && <span className="text-xs font-semibold text-rose-500">{editErrors.name}</span>}
                </div>

              </div>

              {/* Grid 2: Category, Purity & Finish */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                
                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="px-2 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Chains">Chains</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Anklets">Anklets (Payal)</option>
                    <option value="Toe Rings">Toe Rings</option>
                  </select>
                </div>

                {/* Purity */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Silver Purity</label>
                  <select
                    value={editForm.purity}
                    onChange={(e) => setEditForm(prev => ({ ...prev, purity: Number(e.target.value) }))}
                    className="px-2 py-2 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={925}>925 Sterling</option>
                    <option value={900}>900 Coin</option>
                    <option value={999}>999 Fine</option>
                    <option value={800}>800 payal</option>
                  </select>
                </div>

                {/* Finish */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500 uppercase">Metal Finish</label>
                  <select
                    value={editForm.finish}
                    onChange={(e) => setEditForm(prev => ({ ...prev, finish: e.target.value }))}
                    className="px-2 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="High-Polish White">High-Polish White</option>
                    <option value="Oxidized Antique">Oxidized Antique</option>
                    <option value="Rhodium Plated">Rhodium Plated</option>
                    <option value="Gold Vermeil">Gold Vermeil</option>
                    <option value="Pure Silver Polish">Pure Silver Polish</option>
                  </select>
                </div>

              </div>

              {/* Grid 3: Weight & Stock */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Weight */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Weight per Piece (grams) *</label>
                  <input
                    type="number"
                    step={0.01}
                    value={editForm.weight}
                    onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.weight ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.weight && <span className="text-xs font-semibold text-rose-500">{editErrors.weight}</span>}
                </div>

                {/* Stock pieces */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Wholesale Qty in Stock *</label>
                  <input
                    type="number"
                    value={editForm.stocks}
                    onChange={(e) => setEditForm(prev => ({ ...prev, stocks: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.stocks ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.stocks && <span className="text-xs font-semibold text-rose-500">{editErrors.stocks}</span>}
                </div>

              </div>

              {/* Grid 4: Making Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                
                {/* Charge type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Making Charge Type</label>
                  <select
                    value={editForm.makingChargeType}
                    onChange={(e) => setEditForm(prev => ({ ...prev, makingChargeType: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-sm font-semibold bg-white"
                  >
                    <option value="PER_GRAM">₹ / Gram Weight (Standard)</option>
                    <option value="FLAT_PIECE">₹ Flat per Piece (Surtax)</option>
                  </select>
                </div>

                {/* Charge Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Charge Rate (₹) *</label>
                  <input
                    type="number"
                    value={editForm.makingCharge}
                    onChange={(e) => setEditForm(prev => ({ ...prev, makingCharge: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      editErrors.makingCharge ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {editErrors.makingCharge && <span className="text-xs font-semibold text-rose-500">{editErrors.makingCharge}</span>}
                </div>

              </div>

              {/* Image URL & Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Image URL (Optional)</label>
                <input
                  type="text"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Design Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
                />
              </div>

              {/* Modal Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 animate-scale-up">
            
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Remove Design from Stock Master?</h3>
            </div>
            
            <p className="text-sm text-slate-500">
              Are you sure you want to delete design SKU <strong>{selectedDesign?.sku}</strong> (<em>{selectedDesign?.name}</em>)? This will wipe out all stock records, gram weights, and pricing formulas for this item.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
              >
                Cancel, Keep
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Remove SKU
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- QUICK STOCK ADJUST MODAL --- */}
      {isAdjustStockOpen && selectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-800 leading-tight">Adjust Stock Quantity</h3>
                <span className="text-[10px] text-indigo-600 font-mono font-bold mt-0.5">{selectedDesign.sku} • {selectedDesign.name}</span>
              </div>
              <button 
                onClick={() => setIsAdjustStockOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
              
              {/* Current Stocks Display */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                <span>Current Pieces in Stock:</span>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg border border-indigo-100 text-sm font-black">{selectedDesign.stocks} pcs</span>
              </div>

              {/* Adjust Type Switcher */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAdjustForm(prev => ({ ...prev, type: "ADD" }))}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      adjustForm.type === "ADD" 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ADD Stock (Inflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm(prev => ({ ...prev, type: "REMOVE" }))}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      adjustForm.type === "REMOVE" 
                        ? "bg-rose-600 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    REMOVE Stock (Sale/Issue)
                  </button>
                </div>
              </div>

              {/* Qty */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Quantity (Pieces) *</label>
                <input
                  type="number"
                  placeholder="Enter number of pieces"
                  value={adjustForm.qty}
                  onChange={(e) => setAdjustForm(prev => ({ ...prev, qty: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${
                    adjustErrors.qty ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {adjustErrors.qty && <span className="text-xs font-semibold text-rose-500">{adjustErrors.qty}</span>}
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Adjustment Reason</label>
                <select
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                >
                  {adjustForm.type === "ADD" ? (
                    <>
                      <option value="Purchase Receipt">Supplier Purchase Receipt</option>
                      <option value="Returned Stock">Customer Return</option>
                      <option value="Audit Correction">Audit Inventory Correction (+)</option>
                    </>
                  ) : (
                    <>
                      <option value="Wholesale Sale">Bulk Wholesaler Sale</option>
                      <option value="Sample Pack">Customer Sample Issue</option>
                      <option value="Audit Correction">Audit Inventory Correction (-)</option>
                      <option value="Damage">Melting/Damage Scrap Out</option>
                    </>
                  )}
                </select>
              </div>

              {/* Modal Footer actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAdjustStockOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Commit Stock Adjust
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- SLIDE OUT DRAWER / BARCODE VOUCHER TAG GENERATOR --- */}
      {isTagOpen && selectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          
          {/* Card Container */}
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 space-y-5 transform scale-100 transition-transform">
            
            {/* Header Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-slate-700">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm">Wholesaler Jewelry Tag</h3>
              </div>
              <button 
                onClick={() => setIsTagOpen(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAG CONTAINER (Simulates printable jewelry card label) */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-indigo-200 space-y-4 relative overflow-hidden shadow-inner">
              
              {/* String attachment hole mock */}
              <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-white border border-indigo-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
              </div>

              {/* Jewelry Stamp */}
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-indigo-600 text-white font-black text-[9px] rounded uppercase tracking-wider">
                  {selectedDesign.purity === 925 ? "92.5 Sterling" : `${selectedDesign.purity} Fine`}
                </span>
              </div>

              {/* Barcode Mock */}
              <div className="flex flex-col items-center justify-center py-2 border-y border-dashed border-slate-200 my-2">
                <div className="flex gap-[1px] items-center h-10 w-44 bg-white px-2 border border-slate-100 rounded">
                  {/* Generate barcode line mockup using arbitrary widths */}
                  {[2,1,3,1,4,1,2,2,1,3,1,1,4,2,1,2,3,1,1,2,1,4,1,2,1,1,3].map((w, i) => (
                    <div 
                      key={i} 
                      className="h-7 bg-slate-900" 
                      style={{ width: `${w}px`, opacity: i % 2 === 0 ? 1 : 0 }} 
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-500 font-bold mt-1 tracking-widest">{selectedDesign.sku}</span>
              </div>

              {/* Tag detail specs */}
              <div className="space-y-2 text-xs">
                
                <div className="text-center font-bold text-slate-800 text-sm leading-tight mb-2">
                  {selectedDesign.name}
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Gross Weight:</span>
                  <span className="text-slate-800 font-extrabold">{selectedDesign.weight.toFixed(2)} g</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Pure Silver:</span>
                  <span className="text-slate-800 font-extrabold">
                    {(selectedDesign.weight * (selectedDesign.purity / 1000)).toFixed(2)} g
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Metal Finish:</span>
                  <span className="text-slate-800 font-bold">{selectedDesign.finish}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Base Rate:</span>
                  <span className="text-slate-700">₹{liveSilverRate}/g</span>
                </div>

                <div className="flex justify-between pt-1 font-bold">
                  <span className="text-[11px] text-slate-600">Wholesale Valuation:</span>
                  <span className="text-sm text-indigo-600 font-black">
                    ₹{Math.round(getWholesaleUnitCost(selectedDesign, liveSilverRate)).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="block text-[8px] text-slate-400 text-center font-medium leading-none mt-1">Calculated unit price contains 3% wholeseller GST stamp</span>

              </div>

            </div>

            {/* Print trigger button mockup */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.print();
                  triggerToast("Jewelry tag printed successfully.");
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Print tag label
              </button>
              <button
                onClick={() => setIsTagOpen(false)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;