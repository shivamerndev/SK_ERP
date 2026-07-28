import React, { useState } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import useBilling from "../useBilling";

const ItemsWorksheet = () => {
  const {
    items,
    handleRowChange,
    handleAddRow,
    handleRemoveRow,
    products,
    totals
  } = useBilling();
  const [itemSearchFocused, setItemSearchFocused] = useState(null); // track row index

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Calculator className="w-5 h-5" />
          <h3 className="font-bold text-slate-800">Items Worksheet</h3>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-blue-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Row
        </button>
      </div>

      <table className="w-full border-collapse text-left text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <th className="py-2.5 px-2 w-[22%]">Item / Product Name</th>
            <th className="py-2.5 px-2 w-[10%] text-right">Weight</th>
            <th className="py-2.5 px-2 w-[15%]">Panni Detail</th>
            <th className="py-2.5 px-2 w-[9%] text-right">Less</th>
            <th className="py-2.5 px-2 w-[9%] text-right">Net Wt</th>
            <th className="py-2.5 px-2 w-[8%] text-right">Tunch</th>
            <th className="py-2.5 px-2 w-[12%]">Lab (Rate/Exp)</th>
            <th className="py-2.5 px-2 w-[10%] text-right">Amt (Lab)</th>
            <th className="py-2.5 px-2 w-[10%] text-right">Fine</th>
            <th className="py-2.5 px-2 w-[5%] text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
              {/* Item Autocomplete Input */}
              <td className="py-2 px-1 relative">
                <input
                  type="text"
                  placeholder="e.g. OP* KATORI"
                  value={row.item}
                  onFocus={() => setItemSearchFocused(index)}
                  onBlur={() => setTimeout(() => setItemSearchFocused(null), 250)}
                  onChange={(e) => handleRowChange(index, "item", e.target.value)}
                  className="w-full bg-white uppercase border border-slate-200 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700"
                />
                {itemSearchFocused === index && products.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto z-40">
                    {products
                      .filter((p) => p.name.toLowerCase().includes(row.item.toLowerCase()))
                      .map((p) => (
                        <button
                          key={p.id || p._id}
                          type="button"
                          onMouseDown={() => {
                            handleRowChange(index, "item", p.name.toUpperCase());
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-xs font-semibold text-slate-700 border-b border-slate-50"
                        >
                          {p.name.toUpperCase()} ({p.category})
                        </button>
                      ))}
                  </div>
                )}
              </td>

              {/* Weight */}
              <td className="py-2 px-1">
                <input
                  type="text"
                  placeholder="0"
                  value={row.weight}
                  onChange={(e) => handleRowChange(index, "weight", e.target.value)}
                  className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700 font-mono"
                />
              </td>

              {/* Panni Detail */}
              <td className="py-2 px-1">
                <input
                  type="text"
                  placeholder="e.g. 8*2.7+49*2.3"
                  value={row.panniDetail}
                  onChange={(e) => handleRowChange(index, "panniDetail", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm text-slate-600 font-mono"
                />
              </td>

              {/* Less */}
              <td className="py-2 px-1">
                <input
                  type="text"
                  placeholder="0"
                  value={row.less}
                  onChange={(e) => handleRowChange(index, "less", e.target.value)}
                  className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm text-slate-600 font-mono"
                />
              </td>

              {/* Net Wt (Calculated) */}
              <td className="py-2 px-1 text-right font-bold text-slate-800 font-mono">
                {row.netWt || "0"}
              </td>

              {/* Tunch */}
              <td className="py-2 px-1">
                <input
                  type="text"
                  placeholder="0.0"
                  value={row.tunch}
                  onChange={(e) => handleRowChange(index, "tunch", e.target.value)}
                  className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700 font-mono"
                />
              </td>

              {/* Lab Expression or Rate */}
              <td className="py-2 px-1">
                <input type="text" placeholder="850 or 17*12" value={row.lab} onChange={(e) => handleRowChange(index, "lab", e.target.value)} className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm text-slate-600 font-mono" />
              </td>

              {/* Amount (Labor) Calculated */}
              <td className="py-2 px-1 text-right font-bold text-slate-800 font-mono">
                {row.amount || "-"}
              </td>

              {/* Fine Calculated */}
              <td className="py-2 px-1 text-right font-bold text-slate-800 font-mono">
                {row.fine || "-"}
              </td>

              {/* Actions */}
              <td className="py-2 px-1 text-center">
                <button type="button" onClick={() => handleRemoveRow(index)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Grid Totals Row summary */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl">
        <span className="font-bold text-slate-700 text-sm">TOTAL SALE</span>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Weight:</span>
            <span className="font-bold text-slate-800 font-mono">{totals.weight}g</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Less:</span>
            <span className="font-bold text-slate-800 font-mono">{totals.less}g</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Net Wt:</span>
            <span className="font-bold text-slate-800 font-mono text-blue-600">{totals.netWt}g</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Labor Amt:</span>
            <span className="font-bold text-emerald-600 font-mono">₹{totals.amount}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Fine:</span>
            <span className="font-bold text-purple-600 font-mono">{totals.fine}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsWorksheet;
