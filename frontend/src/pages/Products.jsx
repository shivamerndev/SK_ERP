import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Check,
  Package,
  AlertTriangle,
  Info,
  DollarSign,
  Layers,
  Sparkles,
  Eye
} from "lucide-react";

// ----------------------------------------------------
// DEFAULT MOCK PRODUCTS (19 Items matching the counts)
// ----------------------------------------------------
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Diamond heart",
    category: "necklace",
    price: 1500,
    stocks: 1,
    status: "Inactive",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-2",
    name: "Golden plated (jesus)",
    category: "necklace",
    price: 500,
    stocks: 10,
    status: "Inactive",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-3",
    name: "Tiny hearted",
    category: "necklace",
    price: 599,
    stocks: 1,
    status: "Inactive",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-4",
    name: "Golden Triple Layered Necklace",
    category: "Necklace",
    price: 399,
    stocks: 54,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-5",
    name: "Mini flower shape",
    category: "necklace",
    price: 249,
    stocks: 10,
    status: "Inactive",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-6",
    name: "Classic Chronograph Watch",
    category: "Watches",
    price: 1250,
    stocks: 8,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-7",
    name: "Minimalist Silver Ring",
    category: "Ring",
    price: 150,
    stocks: 35,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-8",
    name: "Sapphire Crown Ring",
    category: "Ring",
    price: 899,
    stocks: 3,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-9",
    name: "Pearl Drop Earrings",
    category: "Earrings",
    price: 299,
    stocks: 0,
    status: "Inactive",
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-10",
    name: "Emerald Studs",
    category: "Earrings",
    price: 450,
    stocks: 14,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-11",
    name: "Rose Gold Herringbone Chain",
    category: "Necklace",
    price: 320,
    stocks: 22,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-12",
    name: "Luxury Diamond Solitaire Ring",
    category: "Ring",
    price: 2400,
    stocks: 2,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-13",
    name: "Silver Link Chain Bracelet",
    category: "Bracelet",
    price: 180,
    stocks: 41,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-14",
    name: "Premium Titanium Smartwatch",
    category: "Watches",
    price: 999,
    stocks: 15,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-15",
    name: "Opal Star Stud Earrings",
    category: "Earrings",
    price: 275,
    stocks: 5,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-16",
    name: "Adjustable Silver Bangle",
    category: "Bracelet",
    price: 125,
    stocks: 0,
    status: "Inactive",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-17",
    name: "Gold Hoop Earrings Large",
    category: "Earrings",
    price: 199,
    stocks: 50,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-18",
    name: "Minimalist Quartz Watch",
    category: "Watches",
    price: 499,
    stocks: 9,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-19",
    name: "Gothic Snake Ring",
    category: "Ring",
    price: 85,
    stocks: 12,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60"
  }
];

// High-quality placeholder images to pick from in modal
const PRESET_IMAGES = [
  { name: "Necklace 1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60" },
  { name: "Necklace 2", url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60" },
  { name: "Watch Gold", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60" },
  { name: "Ring Diamond", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60" },
  { name: "Earrings Pearl", url: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60" },
  { name: "Bracelet Charm", url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=150&auto=format&fit=crop&q=60" }
];

const Products = () => {
  // ----------------------------------------------------
  // STATE DEFINITIONS
  // ----------------------------------------------------
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("erp_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [selectedStockLevel, setSelectedStockLevel] = useState("All Stock");

  // Dropdown UI Open States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'category' | 'status' | 'price' | 'stock' | null

  // CRUD Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form Field States (Add / Edit)
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("necklace");
  const [formPrice, setFormPrice] = useState("");
  const [formStocks, setFormStocks] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formImageUrl, setFormImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formErrors, setFormErrors] = useState({});

  // Notification Toast State
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsList, setShowNotificationsList] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // ----------------------------------------------------
  // PERSISTENCE EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem("erp_products", JSON.stringify(products));
  }, [products]);

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
    setFormCategory("necklace");
    setFormPrice("");
    setFormStocks("");
    setFormStatus("Active");
    setFormImageUrl(PRESET_IMAGES[0].url);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setFormName(product.name);
    setFormCategory(product.category.toLowerCase());
    setFormPrice(product.price.toString());
    setFormStocks(product.stocks.toString());
    setFormStatus(product.status);
    setFormImageUrl(product.imageUrl || PRESET_IMAGES[0].url);
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Validations
  const validateForm = () => {
    const errors = {};
    if (!formName.trim()) errors.name = "Product name is required";
    if (!formPrice || parseFloat(formPrice) <= 0) errors.price = "Enter a valid positive price";
    if (formStocks === "" || parseInt(formStocks) < 0) errors.stocks = "Stocks cannot be negative";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProduct = {
      id: "prod-" + Date.now(),
      name: formName.trim(),
      category: formCategory.charAt(0).toUpperCase() + formCategory.slice(1),
      price: parseFloat(formPrice),
      stocks: parseInt(formStocks),
      status: formStatus,
      imageUrl: formImageUrl
    };

    setProducts((prev) => [newProduct, ...prev]);
    setIsAddModalOpen(false);
    addNotification(`Added product "${newProduct.name}"`, "success");
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === currentProduct.id
          ? {
            ...p,
            name: formName.trim(),
            category: formCategory.charAt(0).toUpperCase() + formCategory.slice(1),
            price: parseFloat(formPrice),
            stocks: parseInt(formStocks),
            status: formStatus,
            imageUrl: formImageUrl
          }
          : p
      )
    );
    setIsEditModalOpen(false);
    addNotification(`Updated product "${formName.trim()}"`, "success");
  };

  const handleDeleteProduct = () => {
    setProducts((prev) => prev.filter((p) => p.id !== currentProduct.id));
    setIsDeleteModalOpen(false);
    addNotification(`Deleted product "${currentProduct.name}"`, "danger");
    setCurrentProduct(null);
  };

  // Helper to toggle filter dropdowns
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
    setSelectedPriceRange("All Prices");
    setSelectedStockLevel("All Stock");
    setSearchQuery("");
  };

  // Checks if any filters are currently applied
  const areFiltersApplied = useMemo(() => {
    return (
      selectedCategory !== "All Categories" ||
      selectedStatus !== "All Status" ||
      selectedPriceRange !== "All Prices" ||
      selectedStockLevel !== "All Stock" ||
      searchQuery !== ""
    );
  }, [selectedCategory, selectedStatus, selectedPriceRange, selectedStockLevel, searchQuery]);

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesCat) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "All Categories") {
        if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // 3. Status Filter
      if (selectedStatus !== "All Status") {
        if (product.status !== selectedStatus) return false;
      }

      // 4. Price Filter
      if (selectedPriceRange !== "All Prices") {
        const price = product.price;
        if (selectedPriceRange === "Under 300" && price >= 300) return false;
        if (selectedPriceRange === "300 - 600" && (price < 300 || price > 600)) return false;
        if (selectedPriceRange === "Over 600" && price <= 600) return false;
      }

      // 5. Stock Level Filter
      if (selectedStockLevel !== "All Stock" && selectedStockLevel !== "In Stock") {
        const stock = product.stocks;
        if (selectedStockLevel === "Low Stock" && (stock === 0 || stock >= 10)) return false;
        if (selectedStockLevel === "Out of Stock" && stock > 0) return false;
      } else if (selectedStockLevel === "In Stock") {
        // MATCH "In Stock" as in template image
        if (product.stocks === 0) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedPriceRange, selectedStockLevel]);

  // Get categories from active products list for the dropdown filter options
  const categoriesList = useMemo(() => {
    const list = new Set(products.map((p) => p.category));
    return ["All Categories", ...Array.from(list)];
  }, [products]);

  return (
    <div className="page-container flex flex-col gap-6 select-none animate-fade-in">
      {/* ----------------------------------------------------
          1. HEADER PANEL
          ---------------------------------------------------- */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Products</h1>
          <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs transition-all hover:bg-blue-100/80">
            {filteredProducts.length} items
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Magnifying Glass Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 sm:w-64 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 mr-2 transition-all"
                autoFocus
              />
            )}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchQuery("");
              }}
              className={`p-2.5 rounded-xl transition-all ${isSearchOpen ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "hover:bg-slate-50 text-slate-500 hover:text-blue-600"
                }`}
              title="Search Products"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotificationsList(!showNotificationsList)}
              className="relative p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-all"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationsList && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl py-2 z-30 transition-all">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                  <span className="font-bold text-sm text-slate-800">Notifications Log</span>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1">
                      <Info size={16} className="text-slate-300" />
                      No recent activities logged
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50/80 border-b border-slate-100/50 flex gap-2.5 items-start">
                        <span className={`w-2 h-2 mt-1.5 rounded-full ${n.type === "success" ? "bg-emerald-500" : n.type === "danger" ? "bg-rose-500" : "bg-blue-500"
                          }`} />
                        <div className="flex-1 flex flex-col">
                           <span className="text-xs text-slate-700 font-medium leading-relaxed">{n.message}</span>
                           <span className="text-[10px] text-slate-400 mt-0.5">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. FILTERS & ACTIONS TOOLBAR
          ---------------------------------------------------- */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm" ref={dropdownRef}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("category")}
                className={`border rounded-xl px-4 py-2 text-slate-700 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${activeDropdown === "category" || selectedCategory !== "All Categories"
                    ? "border-blue-500 ring-2 ring-blue-500/10 text-blue-700 bg-blue-50/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "category" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "category" && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors"
                    >
                      <span className="capitalize">{cat}</span>
                      {selectedCategory === cat && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("status")}
                className={`border rounded-xl px-4 py-2 text-slate-700 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${activeDropdown === "status" || selectedStatus !== "All Status"
                    ? "border-blue-500 ring-2 ring-blue-500/10 text-blue-700 bg-blue-50/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <span>{selectedStatus}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "status" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "status" && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                  {["All Status", "Active", "Inactive"].map((stat) => (
                    <button
                      key={stat}
                      onClick={() => {
                        setSelectedStatus(stat);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors"
                    >
                      {stat}
                      {selectedStatus === stat && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("price")}
                className={`border rounded-xl px-4 py-2 text-slate-700 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${activeDropdown === "price" || selectedPriceRange !== "All Prices"
                    ? "border-blue-500 ring-2 ring-blue-500/10 text-blue-700 bg-blue-50/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <span>{selectedPriceRange}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "price" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "price" && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                  {["All Prices", "Under 300", "300 - 600", "Over 600"].map((rng) => (
                    <button
                      key={rng}
                      onClick={() => {
                        setSelectedPriceRange(rng);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors"
                    >
                      {rng}
                      {selectedPriceRange === rng && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Level Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("stock")}
                className={`border rounded-xl px-4 py-2 text-slate-700 text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${activeDropdown === "stock" || selectedStockLevel !== "All Stock"
                    ? "border-blue-500 ring-2 ring-blue-500/10 text-blue-700 bg-blue-50/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <span>{selectedStockLevel}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "stock" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "stock" && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                  {["All Stock", "In Stock", "Low Stock", "Out of Stock"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setSelectedStockLevel(lvl);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors"
                    >
                      {lvl}
                      {selectedStockLevel === lvl && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Clear Filters Label */}
            {areFiltersApplied && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-blue-50/60 transition-all flex items-center gap-1 cursor-pointer"
              >
                <X size={14} /> Clear Filters
              </button>
            )}

            {/* Add Product Button */}
            <button
              onClick={handleOpenAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Selected Filter Tags indicator */}
        {areFiltersApplied && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 mt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Active filters:</span>
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
                Search: "{searchQuery}"
                <X size={12} className="cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setSearchQuery("")} />
              </span>
            )}
            {selectedCategory !== "All Categories" && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
                Category: {selectedCategory}
                <X size={12} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => setSelectedCategory("All Categories")} />
              </span>
            )}
            {selectedStatus !== "All Status" && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
                Status: {selectedStatus}
                <X size={12} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => setSelectedStatus("All Status")} />
              </span>
            )}
            {selectedPriceRange !== "All Prices" && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
                Price: {selectedPriceRange}
                <X size={12} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => setSelectedPriceRange("All Prices")} />
              </span>
            )}
            {selectedStockLevel !== "All Stock" && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
                Stock: {selectedStockLevel}
                <X size={12} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => setSelectedStockLevel("All Stock")} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          3. PRODUCTS TABLE
          ---------------------------------------------------- */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider w-[40%]">
                  Product Name
                </th>
                <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[15%]">
                  Price
                </th>
                <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[15%]">
                  Stocks
                </th>
                <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-center w-[15%]">
                  Status
                </th>
                <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-center w-[15%]">
                  Action Buttons
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Package size={48} className="text-slate-200 animate-bounce" />
                      <span className="font-semibold text-slate-600 text-base">No products found</span>
                      <span className="text-xs text-slate-400 max-w-sm leading-normal">
                        No items match your active filters. Try adjusting your search query or reset filters.
                      </span>
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100/80 px-4 py-2 rounded-xl font-bold transition-all border border-blue-100"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-4">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              // If image fails to load, replace with fallback SVG
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        {/* Fallback avatar */}
                        <div
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 items-center justify-center font-extrabold text-sm border border-blue-200/50 shadow-sm shadow-blue-100"
                          style={{ display: product.imageUrl ? "none" : "flex" }}
                        >
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                            {product.name}
                          </span>
                          <span className="text-slate-400 text-xs mt-0.5 capitalize">{product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-right font-bold text-slate-700 font-mono">
                      {product.price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 px-6 text-right">
                      <span className={`text-sm font-semibold ${product.stocks === 0 ? "text-rose-500 font-bold" : "text-slate-600"}`}>
                        {product.stocks}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all ${product.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="bg-blue-50/50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all border border-blue-100/30 hover:border-blue-200 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDeleteModal(product)}
                          className="bg-rose-50/50 text-rose-600 hover:bg-rose-100 p-2 rounded-lg transition-all border border-rose-100/30 hover:border-rose-200 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------------------------------------------
          4. ADD PRODUCT MODAL
          ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-600" size={18} />
                <h3 className="font-extrabold text-slate-800 text-lg">Add New Product</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter product title..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  {formErrors.name && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.name}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all capitalize font-medium"
                    >
                      <option value="necklace">Necklace</option>
                      <option value="bracelet">Bracelet</option>
                      <option value="earrings">Earrings</option>
                      <option value="ring">Ring</option>
                      <option value="watches">Watches</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="e.g. 599"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
                    />
                    {formErrors.price && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.price}</span>}
                  </div>

                  {/* Stocks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stocks</label>
                    <input
                      type="number"
                      value={formStocks}
                      onChange={(e) => setFormStocks(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                    />
                    {formErrors.stocks && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.stocks}</span>}
                  </div>
                </div>

                {/* Product Image Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Image Preset</label>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setFormImageUrl(img.url)}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-square cursor-pointer transition-all hover:scale-105 ${formImageUrl === img.url ? "border-blue-600 scale-105 shadow-md shadow-blue-100" : "border-slate-100 hover:border-slate-300"
                          }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {formImageUrl === img.url && (
                          <div className="absolute inset-0 bg-blue-600/15 flex items-center justify-center">
                            <span className="bg-blue-600 text-white rounded-full p-0.5"><Check size={10} /></span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold text-slate-400 mb-1">Or paste custom Image URL</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100/50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-blue-500/15"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          5. EDIT PRODUCT MODAL
          ---------------------------------------------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Edit className="text-blue-600" size={18} />
                <h3 className="font-extrabold text-slate-800 text-lg">Edit Product details</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditProduct}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter product title..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  {formErrors.name && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.name}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all capitalize font-medium"
                    >
                      <option value="necklace">Necklace</option>
                      <option value="bracelet">Bracelet</option>
                      <option value="earrings">Earrings</option>
                      <option value="ring">Ring</option>
                      <option value="watches">Watches</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="e.g. 599"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
                    />
                    {formErrors.price && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.price}</span>}
                  </div>

                  {/* Stocks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stocks</label>
                    <input
                      type="number"
                      value={formStocks}
                      onChange={(e) => setFormStocks(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                    />
                    {formErrors.stocks && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.stocks}</span>}
                  </div>
                </div>

                {/* Product Image Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Image Preset</label>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setFormImageUrl(img.url)}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-square cursor-pointer transition-all hover:scale-105 ${formImageUrl === img.url ? "border-blue-600 scale-105 shadow-md shadow-blue-100" : "border-slate-100 hover:border-slate-300"
                          }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {formImageUrl === img.url && (
                          <div className="absolute inset-0 bg-blue-600/15 flex items-center justify-center">
                            <span className="bg-blue-600 text-white rounded-full p-0.5"><Check size={10} /></span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold text-slate-400 mb-1">Or paste custom Image URL</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-xs text-slate-600 placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100/50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-blue-500/15"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          6. DELETE CONFIRMATION MODAL
          ---------------------------------------------------- */}
      {isDeleteModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200/50">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-800 text-base">Delete Product?</h3>
                <p className="text-slate-400 text-xs leading-relaxed px-4">
                  Are you sure you want to delete <span className="font-semibold text-slate-700">"{currentProduct.name}"</span>?
                  This action is irreversible and will remove the item immediately.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-center gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100/50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer shadow-sm hover:shadow-rose-500/15"
              >
                Delete Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;