import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

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
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  AlertCircle,
  Filter,
  FileText,
  ChevronDown,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Box,
  Sliders,
  Scale,
  IndianRupeeIcon
} from "lucide-react";
import { toast } from "react-hot-toast";
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
import ProductTable from "../products/components/ProductTable";
import useProduct from "../products/useProduct";
import FilterToolbar from "../products/components/FilterToolbar";
import ConfirmModal from "../utils/ConfirmModal";
import EditProduct from "../products/components/EditProduct";
import AddProduct from "../products/components/AddProduct";
import Header from "../products/components/Header";

const STOCKS_LIMIT = 10

const DEFAULT_CATEGORIES = ["bichiya", "got", "earring", "ring", "bracelet", "payal", "kangan", "katori", "necklace", "watches"];


const PRESET_IMAGES = [
  { name: "Necklace 1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60" },
  { name: "Necklace 2", url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60" },
  { name: "Watch Gold", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60" },
  { name: "Ring Diamond", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60" },
  { name: "Earrings Pearl", url: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60" },
  { name: "Bracelet Charm", url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=150&auto=format&fit=crop&q=60" }
];



const Inventory = () => {

  const { products = [], handleAllProducts, handleCreateProduct, handleUpdateProduct, handleDeleteProduct } = useProduct();
  const location = useLocation();

  useEffect(() => {
    handleAllProducts();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All Categories";

  const setSelectedCategory = (category) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (category && category !== "All Categories") {
        newParams.set("category", category);
      } else {
        newParams.delete("category");
      }
      return newParams;
    });
  };

  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedWeightRange, setSelectedWeightRange] = useState("All Weights");
  const [selectedStockLevel, setSelectedStockLevel] = useState("All Stock");

  const [liveSilverRate, setLiveSilverRate] = useState(() => {
    const savedRate = localStorage.getItem("erp_live_silver_rate");
    return savedRate ? parseFloat(savedRate) : 85.0; // ₹85 per gram default
  });

  const [purityFilter, setPurityFilter] = useState("All"); // All, 925, 900, 999
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // All, Available, LowStock, OutOfStock

  const [sortBy, setSortBy] = useState("name"); // name, weight, stocks, value, tunch
  const [sortOrder, setSortOrder] = useState("asc");

  const [showCharts, setShowCharts] = useState(true);

  // Modals & Drawers
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);

  const [selectedDesign, setSelectedDesign] = useState(null);

  const [adjustForm, setAdjustForm] = useState({
    type: "ADD", // ADD, REMOVE
    qty: "",
    reason: "Purchase Receipt"
  });

  const [adjustErrors, setAdjustErrors] = useState({});

  // Dropdown UI Open States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'category' | 'status' | 'weight' | 'stock' | null

  // CRUD Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("payal");
  const [customCategory, setCustomCategory] = useState("");
  const [formPieces, setFormPieces] = useState("");
  const [formWeight, setFormWeight] = useState("");
  const [formTunch, setFormTunch] = useState("");
  const [formLab, setFormLab] = useState("");
  const [formPanniDetail, setFormPanniDetail] = useState("");
  const [formImageUrl, setFormImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formErrors, setFormErrors] = useState({});

  const allCategories = useMemo(() => {
    const list = new Set([
      ...DEFAULT_CATEGORIES,
      ...products.map((p) => p.category?.toLowerCase()?.trim())
    ]);
    return Array.from(list).filter(Boolean).sort();
  }, [products]);

  // Notification Toast State
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsList, setShowNotificationsList] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Click Outside Event listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationsList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------------------------------
  // ACTIONS / LOGIC
  // ----------------------------------------------------
  const addNotification = (message, type = "info") => {
    const id = Date.now();
    const newNotif = { id, message, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 10)); // Limit to last 10
  };

  const handleOpenAddModal = () => {
    setFormName("");
    setFormCategory(allCategories[0] || "payal");
    setCustomCategory("");
    setFormPieces("0");
    setFormWeight("");
    setFormTunch("0");
    setFormLab("0");
    setFormPanniDetail("0");
    setFormImageUrl(PRESET_IMAGES[0].url);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setFormName(product.name);
    setFormCategory(product.category?.toLowerCase() || "payal");
    setCustomCategory("");
    setFormPieces(product.pieces?.toString() || "0");
    setFormWeight(Array.isArray(product.weight) ? product.weight.join(", ") : "");
    setFormTunch(product.tunch?.toString() || "0");
    setFormLab(product.lab?.toString() || "0");
    setFormPanniDetail(product.panniDetail?.toString() || "0");
    setFormImageUrl(product.image || PRESET_IMAGES[0].url);
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("id");
    if (productId && products.length > 0) {
      const prod = products.find(p => String(p._id) === String(productId));
      if (prod) {
        handleOpenEditModal(prod);
        // Clean up URL query parameters without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [products, location.search]);



  const handleDeleteConfirm = () => {
    handleDeleteProduct(currentProduct._id)
      .then(() => {
        setIsDeleteModalOpen(false);
        addNotification(`Deleted product "${currentProduct.name}"`, "danger");
        setCurrentProduct(null);
      })
      .catch(() => { });
  };

  // Helper to toggle filter dropdowns
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearchParams({});
    setSelectedStatus("All Status");
    setSelectedWeightRange("All Weights");
    setSelectedStockLevel("All Stock");
    setSearchQuery("");
    setPurityFilter("All");
    setCategoryFilter("All");
    setStockFilter("All");
  };

  // Checks if any filters are currently applied
  const areFiltersApplied = useMemo(() => {
    return (
      selectedCategory !== "All Categories" ||
      selectedStatus !== "All Status" ||
      selectedWeightRange !== "All Weights" ||
      selectedStockLevel !== "All Stock" ||
      searchQuery !== "" ||
      purityFilter !== "All" ||
      categoryFilter !== "All" ||
      stockFilter !== "All"
    );
  }, [selectedCategory, selectedStatus, selectedWeightRange, selectedStockLevel, searchQuery, purityFilter, categoryFilter, stockFilter]);

  // ----------------------------------------------------
  // FILTERING & SORTING LOGIC
  // ----------------------------------------------------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter (can be set by query params categoryFilter or selectedCategory)
    const activeCategory = categoryFilter !== "All" ? categoryFilter : (selectedCategory !== "All Categories" ? selectedCategory : "All");
    if (activeCategory !== "All") {
      result = result.filter(product => product.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // 3. Purity Filter (Tunch standard)
    if (purityFilter !== "All") {
      result = result.filter(product => {
        const purityValue = parseFloat(purityFilter);
        // Map 925 to 92.5, 900 to 90, 999 to 99.9
        const targetTunch = purityValue >= 100 ? purityValue / 10 : purityValue;
        return product.tunch === targetTunch;
      });
    }

    // 4. Calculated Status Filter
    if (selectedStatus !== "All Status") {
      result = result.filter(product => {
        const calculatedStatus = product.pieces > 0 ? "Active" : "Inactive";
        return calculatedStatus === selectedStatus;
      });
    }

    // 5. Weight Filter
    if (selectedWeightRange !== "All Weights") {
      result = result.filter(product => {
        const totalWeight = Array.isArray(product.weight) ? product.weight.reduce((sum, w) => sum + w, 0) : 0;
        if (selectedWeightRange === "Under 20g" && totalWeight >= 20) return false;
        if (selectedWeightRange === "20g - 50g" && (totalWeight < 20 || totalWeight > 50)) return false;
        if (selectedWeightRange === "Over 50g" && totalWeight <= 50) return false;
        return true;
      });
    }

    // 6. Stock Level Filter (Stock status)
    const activeStockFilter = stockFilter !== "All" ? stockFilter : (selectedStockLevel !== "All Stock" ? selectedStockLevel : "All");
    if (activeStockFilter !== "All") {
      result = result.filter(product => {
        const stock = product.pieces || 0;
        if ((activeStockFilter === "Low Stock" || activeStockFilter === "LowStock") && (stock === 0 || stock > STOCKS_LIMIT)) return false;
        if ((activeStockFilter === "Out of Stock" || activeStockFilter === "OutOfStock") && stock > 0) return false;
        if (activeStockFilter === "In Stock" && stock === 0) return false;
        if (activeStockFilter === "Available" && stock <= STOCKS_LIMIT) return false;
        return true;
      });
    }

    // 7. Sorting
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "name") {
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
      } else if (sortBy === "weight") {
        valA = Array.isArray(a.weight) ? a.weight.reduce((sum, w) => sum + w, 0) : 0;
        valB = Array.isArray(b.weight) ? b.weight.reduce((sum, w) => sum + w, 0) : 0;
      } else if (sortBy === "stocks" || sortBy === "pieces") {
        valA = a.pieces || 0;
        valB = b.pieces || 0;
      } else if (sortBy === "value") {
        valA = getStockValuation(a, liveSilverRate);
        valB = getStockValuation(b, liveSilverRate);
      } else if (sortBy === "tunch") {
        valA = a.tunch || 0;
        valB = b.tunch || 0;
      } else {
        valA = (a.name || "").toLowerCase();
        valB = (b.name || "").toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchQuery, selectedCategory, categoryFilter, purityFilter, selectedStatus, selectedWeightRange, stockFilter, selectedStockLevel, sortBy, sortOrder, liveSilverRate]);

  // Get categories from active products list for the dropdown filter options
  const categoriesList = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All Categories", ...Array.from(list)];
  }, [products]);



  const handleOpenDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleOpenAdjustStockModal = (product) => {
    setSelectedDesign(product);
    setIsAdjustStockOpen(true);
  };

  const handleOpenTagModal = (product) => {
    setSelectedDesign(product);
    setIsTagOpen(true);
  };



  const fileInputRef = useRef(null);

  // ----------------------------------------------------
  // PERSIST TO LOCAL STORAGE
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_live_silver_rate", liveSilverRate.toString());
  }, [liveSilverRate]);

  // Keep selected design synchronized in case of stock adjust
  useEffect(() => {
    if (selectedDesign) {
      const current = products.find(p => String(p._id) === String(selectedDesign._id));
      if (current) {
        setSelectedDesign(current);
      }
    }
  }, [products]);

  // TOAST HANDLER using react-hot-toast
  const triggerToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  // ----------------------------------------------------
  // BUSINESS CALCULATIONS FOR WHOLSELLER STOCKS
  // ----------------------------------------------------
  const getSilverCost = (product, rate) => {
    const totalWeight = Array.isArray(product.weight) ? product.weight.reduce((sum, w) => sum + w, 0) : 0;
    // Metal value = fine weight * silver rate
    return totalWeight * rate * ((product.tunch || 0) / 100);
  };

  const getMakingCost = (product) => {
    const totalWeight = Array.isArray(product.weight) ? product.weight.reduce((sum, w) => sum + w, 0) : 0;
    // lab is labor rate per kg, so labor cost = totalWeight * (lab / 1000)
    return totalWeight * ((product.lab || 0) / 1000);
  };

  const getWholesaleUnitCost = (product, rate) => {
    const costBeforeGST = getSilverCost(product, rate) + getMakingCost(product);
    // Standard GST on silver ornaments in India is 3%
    return costBeforeGST * 1.03;
  };

  const getStockValuation = (product, rate) => {
    return getWholesaleUnitCost(product, rate);
  };

  const getPureSilverWeight = (product) => {
    const totalWeight = Array.isArray(product.weight) ? product.weight.reduce((sum, w) => sum + w, 0) : 0;
    return totalWeight * ((product.tunch || 0) / 100);
  };

  // ----------------------------------------------------
  // CALCULATE SUMMARY KPI STATS
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let uniqueSKUs = products.length;
    let totalPieces = 0;
    let totalGrossWeight = 0;
    let totalValuation = 0;
    let pureSilverWeight = 0;
    let lowStockCount = 0;

    products.forEach(p => {
      const pcs = Number(p.pieces || 0);
      const totalWeight = Array.isArray(p.weight) ? p.weight.reduce((sum, w) => sum + w, 0) : 0;
      totalPieces += pcs;
      totalGrossWeight += totalWeight;
      totalValuation += getStockValuation(p, liveSilverRate);
      pureSilverWeight += getPureSilverWeight(p);

      if (pcs <= STOCKS_LIMIT) {
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
  }, [products, liveSilverRate]);

  // ----------------------------------------------------
  // FILTERING & SORTING DIRECTORY
  // ----------------------------------------------------
  const filteredDesigns = filteredProducts;

  // ----------------------------------------------------
  // CHART DATA PREPARATION
  // ----------------------------------------------------
  const chartData = useMemo(() => {
    // 1. Weight by Category
    const categoryWeight = {};
    products.forEach(p => {
      const totalWeight = Array.isArray(p.weight) ? p.weight.reduce((sum, w) => sum + w, 0) : 0;
      const cat = p.category ? p.category.toLowerCase().trim() : "other";
      categoryWeight[cat] = (categoryWeight[cat] || 0) + Math.round(totalWeight);
    });

    const weightCategoryData = Object.keys(categoryWeight).map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      "Total Weight (g)": categoryWeight[cat]
    }));

    // 2. Purity variety distribution
    const purityPieces = {};
    products.forEach(p => {
      const purityLabel = `${p.tunch || 0}% Tunch`;
      purityPieces[purityLabel] = (purityPieces[purityLabel] || 0) + (p.pieces || 0);
    });

    const purityVarietyData = Object.keys(purityPieces).map(pur => ({
      name: pur,
      Pieces: purityPieces[pur]
    }));

    // 3. Stock Status breakdown
    let avCount = 0;
    let lowCount = 0;
    let zeroCount = 0;

    products.forEach(p => {
      const stocks = p.pieces || 0;
      if (stocks <= 0) zeroCount++;
      else if (stocks <= STOCKS_LIMIT) lowCount++;
      else avCount++;
    });

    const statusPieData = [
      { name: "Sufficient (>10 pc)", value: avCount, color: "#10b981" },
      { name: "Low Stock (1-10 pc)", value: lowCount, color: "#f59e0b" },
      { name: "Out of Stock", value: zeroCount, color: "#ef4444" }
    ].filter(d => d.value > 0);

    return { weightCategoryData, purityVarietyData, statusPieData };
  }, [products]);

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

    let finalStock = selectedDesign.pieces || 0;
    if (adjustForm.type === "ADD") {
      finalStock += adjustQty;
    } else {
      finalStock = Math.max(0, finalStock - adjustQty);
    }

    handleUpdateProduct(selectedDesign._id, {
      name: selectedDesign.name,
      category: selectedDesign.category,
      pieces: finalStock,
      weight: selectedDesign.weight,
      tunch: selectedDesign.tunch,
      lab: selectedDesign.lab || 0,
      panniDetail: selectedDesign.panniDetail || 0,
      image: selectedDesign.image
    })
      .then(() => {
        setIsAdjustStockOpen(false);
        setAdjustForm({ type: "ADD", qty: "", reason: "Purchase Receipt" });
        setAdjustErrors({});
        triggerToast(`Stock quantity modified for ${selectedDesign.name}.`);
      })
      .catch(() => { });
  };

  // ----------------------------------------------------
  // BACKUPS
  // ----------------------------------------------------
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(products, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const fileName = `silver_wholeseller_products_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
      triggerToast("Product backup downloaded!");
    } catch (e) {
      triggerToast("Failed to backup products.", "error");
    }
  };

  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Product Name,Category,Tunch(%),Gross Weight(g),Labor Rate(INR/kg),Pieces (pcs),Unit Cost(INR),Total Valuation(INR)\r\n";

      filteredProducts.forEach(p => {
        const uCost = getWholesaleUnitCost(p, liveSilverRate);
        const tVal = getStockValuation(p, liveSilverRate);
        const totalWeight = Array.isArray(p.weight) ? p.weight.reduce((sum, w) => sum + w, 0) : 0;
        const row = [
          p._id,
          `"${p.name}"`,
          p.category,
          p.tunch,
          totalWeight,
          p.lab || 0,
          p.pieces,
          (uCost / (p.pieces || 1)).toFixed(2),
          tVal.toFixed(2)
        ];
        csvContent += row.join(",") + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `silver_wholesale_products_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      triggerToast("CSV product report exported!");
    } catch (e) {
      triggerToast("CSV export failed.", "error");
    }
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) {
          triggerToast("Invalid format: Backup must be a list of products.", "error");
          return;
        }

        const isValid = data.every(d =>
          d.name &&
          d.category &&
          typeof d.tunch === "number" &&
          Array.isArray(d.weight) &&
          typeof d.pieces === "number"
        );

        if (!isValid) {
          triggerToast("Structure properties do not match product schema.", "error");
          return;
        }

        // Iteratively create each product in the backend
        let successCount = 0;
        for (const item of data) {
          try {
            await handleCreateProduct({
              name: item.name,
              category: item.category.toLowerCase(),
              pieces: item.pieces,
              weight: item.weight,
              tunch: item.tunch,
              lab: item.lab || 0,
              panniDetail: item.panniDetail || 0,
              image: item.image
            });
            successCount++;
          } catch (err) {
            console.error("Failed to import product", item.name, err);
          }
        }
        triggerToast(`Restored ${successCount} products successfully!`, "success");
      } catch (err) {
        triggerToast("Failed to parse JSON backup.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="space-y-6">



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
              onClick={handleOpenAddModal}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-500/10"
            >
              <Plus className="w-4 h-4" />
              Add Product
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
            <IndianRupeeIcon className="w-6 h-6" />
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

            {/* Chart 2: Purity variety distribution */}
            <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Stock Pieces Mix by Silver Purity Standard</h4>
              <div className="h-64">
                {chartData.purityVarietyData && chartData.purityVarietyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.purityVarietyData} margin={{ left: -15, right: 10, bottom: 5 }}>
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

        <Header
          filteredProducts={filteredProducts}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          setNotifications={setNotifications}
          showNotificationsList={showNotificationsList}
          setShowNotificationsList={setShowNotificationsList}
          notificationRef={notificationRef}
        />


        {/* Advanced Sorting & Purity Panel */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 flex flex-wrap items-center justify-between gap-4">

          {/* Quick sorting dropdowns */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
            >
              <option value="name">Product Name</option>
              <option value="weight">Piece Weight</option>
              <option value="stocks">Stock Pieces</option>
              <option value="value">Stock Valuation</option>
              <option value="tunch">Purity Standard</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold cursor-pointer"
              title="Toggle Sort Order"
            >
              {sortOrder === "asc" ? "ASC ↑" : "DESC ↓"}
            </button>
          </div>

          {/* Filter by Purity */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Purity:</span>
            <select
              value={purityFilter}
              onChange={(e) => setPurityFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Purities</option>
              <option value="925">92.5% Sterling</option>
              <option value="900">90.0% Coin Silver</option>
              <option value="999">99.9% Fine Silver</option>
            </select>
          </div>

        </div>




        <FilterToolbar
          dropdownRef={dropdownRef}
          toggleDropdown={toggleDropdown}
          activeDropdown={activeDropdown}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoriesList={categoriesList}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedWeightRange={selectedWeightRange}
          setSelectedWeightRange={setSelectedWeightRange}
          selectedStockLevel={selectedStockLevel}
          setSelectedStockLevel={setSelectedStockLevel}
          areFiltersApplied={areFiltersApplied}
          handleClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleOpenAddModal={handleOpenAddModal}
        />

        {/* Directory Table element */}
        <div className="overflow-x-auto">
          {filteredProducts.length > 0 ? (
            <ProductTable
              filteredProducts={filteredProducts}
              handleOpenEditModal={handleOpenEditModal}
              handleOpenDeleteModal={handleOpenDeleteModal}
              handleOpenAdjustStockModal={handleOpenAdjustStockModal}
              handleOpenTagModal={handleOpenTagModal}
              handleClearFilters={handleClearFilters}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <span className="text-base font-semibold">No products found matching filters</span>
              <p className="text-xs text-slate-400 mt-1">Try resetting search or dropdown filters above</p>
            </div>
          )}
        </div>

        {/* Directory Footer info */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Displaying {filteredProducts.length} of {products.length} unique products</span>
          <span>Calculations depend on daily Silver Metal base rate: ₹{liveSilverRate}/gram</span>
        </div>

      </div>

      {isAddModalOpen && (
        <AddProduct
          setIsAddModalOpen={setIsAddModalOpen}
          allCategories={allCategories}
          handleCreateProduct={handleCreateProduct}
          addNotification={addNotification}
        />
      )}

      {isEditModalOpen && <EditProduct currentProduct={currentProduct} allCategories={allCategories} setIsEditModalOpen={setIsEditModalOpen} handleUpdateProduct={handleUpdateProduct} addNotification={addNotification} />}

      {isDeleteModalOpen && currentProduct && (
        <ConfirmModal
          title="Delete Product?"
          message="This action is irreversible and will remove the item immediately."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* --- QUICK STOCK ADJUST MODAL --- */}
      {isAdjustStockOpen && selectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform scale-100 transition-transform">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-800 leading-tight">Adjust Stock Quantity</h3>
                <span className="text-[10px] text-indigo-600  font-bold mt-0.5">{selectedDesign.category?.toUpperCase()} • {selectedDesign.name}</span>
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
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg border border-indigo-100 text-sm font-black">{selectedDesign.pieces} pcs</span>
              </div>

              {/* Adjust Type Switcher */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAdjustForm(prev => ({ ...prev, type: "ADD" }))}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${adjustForm.type === "ADD"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    ADD Stock (Inflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm(prev => ({ ...prev, type: "REMOVE" }))}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${adjustForm.type === "REMOVE"
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
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${adjustErrors.qty ? "border-rose-400" : "border-slate-200"
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
                  {selectedDesign.tunch === 92.5 ? "92.5 Sterling" : `${selectedDesign.tunch}% Tunch`}
                </span>
              </div>

              {/* Barcode Mock */}
              <div className="flex flex-col items-center justify-center py-2 border-y border-dashed border-slate-200 my-2">
                <div className="flex gap-[1px] items-center h-10 w-44 bg-white px-2 border border-slate-100 rounded">
                  {/* Generate barcode line mockup using arbitrary widths */}
                  {[2, 1, 3, 1, 4, 1, 2, 2, 1, 3, 1, 1, 4, 2, 1, 2, 3, 1, 1, 2, 1, 4, 1, 2, 1, 1, 3].map((w, i) => (
                    <div
                      key={i}
                      className="h-7 bg-slate-900"
                      style={{ width: `${w}px`, opacity: i % 2 === 0 ? 1 : 0 }}
                    />
                  ))}
                </div>
                <span className=" text-[9px] text-slate-500 font-bold mt-1 tracking-widest">{selectedDesign._id?.slice(-8).toUpperCase()}</span>
              </div>

              {/* Tag detail specs */}
              <div className="space-y-2 text-xs">

                <div className="text-center font-bold text-slate-800 text-sm leading-tight mb-2">
                  {selectedDesign.name}
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Gross Weight:</span>
                  <span className="text-slate-800 font-extrabold">{(Array.isArray(selectedDesign.weight) ? selectedDesign.weight.reduce((a, b) => a + b, 0) : 0).toFixed(2)} g</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Pieces:</span>
                  <span className="text-slate-800 font-extrabold">{selectedDesign.pieces} pcs</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Pure Silver:</span>
                  <span className="text-slate-800 font-extrabold">
                    {getPureSilverWeight(selectedDesign).toFixed(2)} g
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Labor Charge:</span>
                  <span className="text-slate-800 font-bold">₹{selectedDesign.lab || 0}/kg</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-[11px] font-semibold text-slate-500">
                  <span>Base Rate:</span>
                  <span className="text-slate-700">₹{liveSilverRate}/g</span>
                </div>

                <div className="flex justify-between pt-1 font-bold">
                  <span className="text-[11px] text-slate-600">Wholesale Valuation:</span>
                  <span className="text-sm text-indigo-600 font-black">
                    ₹{Math.round(getStockValuation(selectedDesign, liveSilverRate)).toLocaleString("en-IN")}
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