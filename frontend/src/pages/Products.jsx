import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import useProduct from "../products/useProduct";
import AddProduct from "../products/components/AddProduct.jsx";
import ProductTable from "../products/components/ProductTable.jsx";
import FilterToolbar from "../products/components/FilterToolbar.jsx";
import ConfirmModal from "../utils/ConfirmModal.jsx";
import Header from "../products/components/Header.jsx";
import EditProduct from "../products/components/EditProduct.jsx";



const DEFAULT_CATEGORIES = ["bichiya", "got", "earring", "ring", "bracelet", "payal", "kangan", "katori", "necklace", "watches"];


const PRESET_IMAGES = [
  { name: "Necklace 1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60" },
  { name: "Necklace 2", url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60" },
  { name: "Watch Gold", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60" },
  { name: "Ring Diamond", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60" },
  { name: "Earrings Pearl", url: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60" },
  { name: "Bracelet Charm", url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=150&auto=format&fit=crop&q=60" }
];

const Products = () => {

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

  // Auto-open edit modal if product ID exists in URL query parameter (e.g. from navbar search)
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

  const handleOpenDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };


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
  };

  // Checks if any filters are currently applied
  const areFiltersApplied = useMemo(() => {
    return (
      selectedCategory !== "All Categories" ||
      selectedStatus !== "All Status" ||
      selectedWeightRange !== "All Weights" ||
      selectedStockLevel !== "All Stock" ||
      searchQuery !== ""
    );
  }, [selectedCategory, selectedStatus, selectedWeightRange, selectedStockLevel, searchQuery]);

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesCat = product.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "All Categories") {
        if (product.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // 3. Calculated Status Filter
      const calculatedStatus = product.pieces > 0 ? "Active" : "Inactive";
      if (selectedStatus !== "All Status") {
        if (calculatedStatus !== selectedStatus) return false;
      }

      // 4. Weight Filter
      const totalWeight = Array.isArray(product.weight) ? product.weight.reduce((sum, w) => sum + w, 0) : 0;
      if (selectedWeightRange !== "All Weights") {
        if (selectedWeightRange === "Under 20g" && totalWeight >= 20) return false;
        if (selectedWeightRange === "20g - 50g" && (totalWeight < 20 || totalWeight > 50)) return false;
        if (selectedWeightRange === "Over 50g" && totalWeight <= 50) return false;
      }

      // 5. Stock Level Filter
      if (selectedStockLevel !== "All Stock" && selectedStockLevel !== "In Stock") {
        const stock = product.pieces || 0;
        if (selectedStockLevel === "Low Stock" && (stock === 0 || stock >= 5)) return false;
        if (selectedStockLevel === "Out of Stock" && stock > 0) return false;
      } else if (selectedStockLevel === "In Stock") {
        if ((product.pieces || 0) === 0) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedWeightRange, selectedStockLevel]);

  // Get categories from active products list for the dropdown filter options
  const categoriesList = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All Categories", ...Array.from(list)];
  }, [products]);

  return (
    <div className="page-container h-full w-full flex flex-col gap-6 select-none animate-fade-in">

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

      <ProductTable
        filteredProducts={filteredProducts}
        handleClearFilters={handleClearFilters}
        handleOpenEditModal={handleOpenEditModal}
        handleOpenDeleteModal={handleOpenDeleteModal}
      />

      {isAddModalOpen && (
        <AddProduct
          setIsAddModalOpen={setIsAddModalOpen}
          allCategories={allCategories}
          handleCreateProduct={handleCreateProduct}
          addNotification={addNotification}
        />
      )}


      {isEditModalOpen && <EditProduct currentProduct={currentProduct}  allCategories={allCategories} setIsEditModalOpen={setIsEditModalOpen} handleUpdateProduct={handleUpdateProduct} addNotification={addNotification} />}

      {isDeleteModalOpen && currentProduct && (
        <ConfirmModal
          title="Delete Product?"
          message="This action is irreversible and will remove the item immediately."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;