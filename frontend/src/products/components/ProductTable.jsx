import { Package, Edit, Trash2, FileText, RefreshCw } from 'lucide-react';
import useProduct from "../useProduct"
import { useEffect } from 'react';

const ProductTable = ({
  filteredProducts,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenAdjustStockModal,
  handleOpenTagModal,
  handleClearFilters: parentClearFilters
}) => {

  const { handleClearFilters: defaultClearFilters, handleAllProducts, products: allProducts } = useProduct()

  useEffect(() => {
    if (filteredProducts === undefined) {
      handleAllProducts();
    }
  }, []);

  const displayProducts = filteredProducts !== undefined ? filteredProducts : allProducts;
  const handleResetFilters = parentClearFilters || defaultClearFilters;


  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider w-[26%]">
                Product Name
              </th>
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[10%]">
                Pieces
              </th>
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[20%]">
                Weight (g)
              </th>
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[11%]">
                Tunch (%)
              </th>
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[11%]">
                Lab (₹)
              </th>
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-right w-[11%]">
                Panni (g)
              </th>
              <th className="p-4 px-6 text-slate-500 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-center w-[11%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Package size={48} className="text-slate-200 animate-bounce" />
                    <span className="font-semibold text-slate-600 text-base">No products found</span>
                    <span className="text-xs text-slate-400 max-w-sm leading-normal">
                      No items match your active filters. Try adjusting your search query or reset filters.
                    </span>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100/80 px-4 py-2 rounded-xl font-bold transition-all border border-blue-100 cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              displayProducts.map((product) => {
                const totalWeight = Array.isArray(product.weight) ? product.weight.reduce((a, b) => a + b, 0) : 0;
                const calculatedStatus = product.pieces > 0 ? "Active" : "Inactive";
                return (
                  <tr key={product._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        {/* Fallback avatar */}
                        <div
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 items-center justify-center font-extrabold text-sm border border-blue-200/50 shadow-sm shadow-blue-100"
                          style={{ display: product.image ? "none" : "flex" }}
                        >
                          {product.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                            {product.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-slate-400 text-xs capitalize">{product.category}</span>
                            <span className="text-slate-300">•</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.25 rounded-md ${calculatedStatus === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                                : "bg-slate-50 text-slate-500 border border-slate-100"
                                }`}
                            >
                              {calculatedStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-6 text-right font-semibold text-slate-600">
                      {product.pieces}
                    </td>
                    <td className="p-4 px-6 text-right font-bold text-slate-700 ">
                      <div>{totalWeight.toFixed(2)}g</div>
                      {Array.isArray(product.weight) && product.weight.length > 1 && (
                        <div className="text-[10px] text-slate-400 font-medium">({product.weight.join(", ")})</div>
                      )}
                    </td>
                    <td className="p-4 px-6 text-right font-semibold text-slate-600 ">
                      {product.tunch}%
                    </td>
                    <td className="p-4 px-6 text-right font-semibold text-slate-600 ">
                      ₹{product.lab}
                    </td>
                    <td className="p-4 px-6 text-right font-semibold text-slate-600 ">
                      {product.panniDetail}g
                    </td>
                    <td className="p-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Print Tag Button */}
                        {handleOpenTagModal && (
                          <button
                            onClick={() => handleOpenTagModal(product)}
                            className="bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg transition-all border border-indigo-100/30 hover:border-indigo-200 cursor-pointer"
                            title="Print Jewelry Tag"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                        {/* Adjust Stock Button */}
                        {handleOpenAdjustStockModal && (
                          <button
                            onClick={() => handleOpenAdjustStockModal(product)}
                            className="bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100 p-2 rounded-lg transition-all border border-emerald-100/30 hover:border-emerald-200 cursor-pointer"
                            title="Adjust Stock"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;