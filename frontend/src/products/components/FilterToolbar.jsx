
import { ChevronDown, Check, X, Plus } from 'lucide-react';

const FilterToolbar = ({
  dropdownRef,
  toggleDropdown,
  activeDropdown,
  selectedCategory,
  setSelectedCategory,
  categoriesList = [],
  selectedStatus,
  setSelectedStatus,
  selectedWeightRange,
  setSelectedWeightRange,
  selectedStockLevel,
  setSelectedStockLevel,
  areFiltersApplied,
  handleClearFilters,
  searchQuery,
  setSearchQuery,
  handleOpenAddModal
}) => {
  return (
    <div className="flex flex-col gap-4 bg-[#fffdfa] border border-[#e8decb] rounded-2xl p-5 shadow-xs" ref={dropdownRef}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("category")}
              className={`border rounded-xl px-4 py-2 text-[#2c1d11] text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${activeDropdown === "category" || selectedCategory !== "All Categories"
                ? "border-[#d4af37] ring-2 ring-[#d4af37]/20 text-[#8a641b] bg-[#f7f0e3]"
                : "border-[#e8decb] hover:border-[#d4af37]/50 hover:bg-[#f8f3ea]"
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
                      toggleDropdown("category");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors cursor-pointer"
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
              className={`border rounded-xl px-4 py-2 text-[#2c1d11] text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${activeDropdown === "status" || selectedStatus !== "All Status"
                ? "border-[#d4af37] ring-2 ring-[#d4af37]/20 text-[#8a641b] bg-[#f7f0e3]"
                : "border-[#e8decb] hover:border-[#d4af37]/50 hover:bg-[#f8f3ea]"
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
                      toggleDropdown("status");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    {stat}
                    {selectedStatus === stat && <Check size={16} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weight Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("weight")}
              className={`border rounded-xl px-4 py-2 text-[#2c1d11] text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${activeDropdown === "weight" || selectedWeightRange !== "All Weights"
                ? "border-[#d4af37] ring-2 ring-[#d4af37]/20 text-[#8a641b] bg-[#f7f0e3]"
                : "border-[#e8decb] hover:border-[#d4af37]/50 hover:bg-[#f8f3ea]"
                }`}
            >
              <span>{selectedWeightRange}</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "weight" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "weight" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-20">
                {["All Weights", "Under 20g", "20g - 50g", "Over 50g"].map((rng) => (
                  <button
                    key={rng}
                    onClick={() => {
                      setSelectedWeightRange(rng);
                      toggleDropdown("weight");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors cursor-pointer"
                  >
                    {rng}
                    {selectedWeightRange === rng && <Check size={16} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stock Level Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("stock")}
              className={`border rounded-xl px-4 py-2 text-[#2c1d11] text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${activeDropdown === "stock" || selectedStockLevel !== "All Stock"
                ? "border-[#d4af37] ring-2 ring-[#d4af37]/20 text-[#8a641b] bg-[#f7f0e3]"
                : "border-[#e8decb] hover:border-[#d4af37]/50 hover:bg-[#f8f3ea]"
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
                      toggleDropdown("stock");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium transition-colors cursor-pointer"
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
              className="text-[#8a641b] hover:text-[#59390f] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#f7f0e3] transition-all flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Clear Filters
            </button>
          )}

          {/* Add Product Button */}
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
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
          {selectedWeightRange !== "All Weights" && (
            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
              Weight: {selectedWeightRange}
              <X size={12} className="cursor-pointer text-blue-400 hover:text-blue-600" onClick={() => setSelectedWeightRange("All Weights")} />
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
  );
};

export default FilterToolbar;