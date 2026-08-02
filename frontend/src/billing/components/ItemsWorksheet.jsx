import React, { useState } from "react";
import { Trash2, Calculator } from "lucide-react";
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

  const handleLabKeyDown = (e, index) => {
    if (e.key === "Enter") {
      if (index === items.length - 1) {
        e.preventDefault();
        e.stopPropagation();
        handleAddRow();
        setTimeout(() => {
          const formOrTable = e.target.closest("table") || e.target.form;
          if (formOrTable) {
            const rows = formOrTable.querySelectorAll("tbody tr");
            const lastRow = rows[rows.length - 1];
            if (lastRow) {
              const firstInput = lastRow.querySelector("input");
              if (firstInput) {
                firstInput.focus();
                try {
                  firstInput.select();
                } catch (err) {
                  // ignore
                }
              }
            }
          }
        }, 50);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Calculator className="w-5 h-5" />
          <h3 className="font-bold text-slate-800">Items Worksheet</h3>
        </div>
      </div>

      <table className="w-full border-separate border-spacing-y-3 text-center text-sm min-w-[750px]">
        <thead>
          <tr className="text-slate-400 text-xs uppercase font-bold tracking-wider">
            <th className="pb-1 px-3 w-[9%] text-right">Amount</th>
            <th className="pb-1 px-3 w-[23%] text-left">Item</th>
            <th className="pb-1 px-3 w-[10%] text-right">Weight</th>
            <th className="pb-1 px-3 w-[15%] text-left">Panni Detail</th>
            <th className="pb-1 px-3 w-[9%] text-right">Less</th>
            <th className="pb-1 px-3 w-[9%] text-right">Net Wt</th>
            <th className="pb-1 px-3 w-[8%] text-right">Tunch</th>
            <th className="pb-1 px-3 w-[12%] text-left">Lab</th>
            <th className="pb-1 px-3 w-[10%] text-right">Fine</th>
            <th className="pb-1 px-3 w-[5%] text-center"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr
              key={index}
              className="group bg-slate-50/70 hover:bg-slate-100/60 transition-all duration-200 shadow-xs hover:shadow-md"
            >
              {/* Amount (Labor) Calculated */}
              <td className="py-3 px-3 border-y border-l border-slate-200 group-hover:border-blue-300 rounded-l-xl text-center font-bold text-slate-800 transition-colors">
                <span className="inline-block bg-slate-200/60 group-hover:bg-blue-100/50 px-2 py-1 rounded-md text-xs font-bold text-slate-700">
                  {row.amount ? `₹${row.amount}` : "-"}
                </span>
              </td>

              {/* Item Autocomplete Input */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 relative transition-colors">
                <input
                  type="text"
                  placeholder="e.g. OP* KATORI"
                  value={row.item}
                  onFocus={() => setItemSearchFocused(index)}
                  onBlur={() => setTimeout(() => setItemSearchFocused(null), 250)}
                  onChange={(e) => handleRowChange(index, "item", e.target.value)}
                  className="w-full bg-white uppercase border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none transition-all"
                />
                {itemSearchFocused === index && products.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto z-50">
                    {products
                      .filter((p) => p.name.toLowerCase().includes(row.item.toLowerCase()))
                      .map((p) => (
                        <button
                          key={p.id || p._id}
                          type="button"
                          onMouseDown={() => {
                            handleRowChange(index, "item", p.name.toUpperCase());
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-xs font-semibold text-slate-700 border-b border-slate-100 last:border-0 transition-colors"
                        >
                          {p.name.toUpperCase()} <span className="text-slate-400 font-normal">({p.category})</span>
                        </button>
                      ))}
                  </div>
                )}
              </td>

              {/* Weight */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 transition-colors">
                <input
                  type="text"
                  placeholder="0"
                  value={row.weight}
                  onChange={(e) => handleRowChange(index, "weight", e.target.value)}
                  className="w-full text-right bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none transition-all"
                />
              </td>

              {/* Panni Detail */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 transition-colors">
                <input
                  type="text"
                  placeholder="e.g. 8*2.7+49*2.3"
                  value={row.panniDetail}
                  onChange={(e) => handleRowChange(index, "panniDetail", e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 outline-none transition-all"
                />
              </td>

              {/* Less */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 transition-colors">
                <input
                  type="text"
                  placeholder="0"
                  value={row.less}
                  onChange={(e) => handleRowChange(index, "less", e.target.value)}
                  className="w-full text-right bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 outline-none transition-all"
                />
              </td>

              {/* Net Wt (Calculated) */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 text-right font-bold text-slate-800 transition-colors">
                <span className="text-blue-600 font-extrabold">{row.netWt || "0"}</span>
              </td>

              {/* Tunch */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 transition-colors">
                <input
                  type="text"
                  placeholder="0.0"
                  value={row.tunch}
                  onChange={(e) => handleRowChange(index, "tunch", e.target.value)}
                  className="w-full text-right bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none transition-all"
                />
              </td>

              {/* Lab Expression or Rate */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 transition-colors">
                <input
                  type="text"
                  placeholder="850 or 17*12"
                  value={row.lab}
                  onKeyDown={(e) => handleLabKeyDown(e, index)}
                  onChange={(e) => handleRowChange(index, "lab", e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 outline-none transition-all"
                />
              </td>

              {/* Fine Calculated */}
              <td className="py-3 px-2 border-y border-slate-200 group-hover:border-blue-300 text-right font-bold text-slate-800 transition-colors">
                <span className="text-purple-600 font-extrabold">{row.fine || "-"}</span>
              </td>

              {/* Actions */}
              <td className="py-3 px-3 border-y border-r border-slate-200 group-hover:border-blue-300 rounded-r-xl text-center transition-colors">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove row"
                >
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
            <span className="font-bold text-slate-800 ">{totals.weight}g</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Less:</span>
            <span className="font-bold text-slate-800 ">{totals.less}g</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Net Wt:</span>
            <span className="font-bold text-slate-800  text-blue-600">{totals.netWt}g</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Labor Amt:</span>
            <span className="font-bold text-emerald-600 ">₹{totals.amount}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 font-semibold">Fine:</span>
            <span className="font-bold text-purple-600 ">{totals.fine}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsWorksheet;
