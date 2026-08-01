import { Plus, Trash2, X as CloseIcon, Package } from "lucide-react";


const AddPurchase = ({
  purchaseForm,
  setPurchaseForm,
  setIsRecordOpen,
  productsList,
  calculatedFormValues,
  handleRecordPurchaseSubmit
}) => {
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0502]/60 backdrop-blur-xs p-4 overflow-y-auto">
    <div className="bg-[#fffdfa] border border-[#e8decb] w-full max-w-7xl rounded-2xl shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]">

      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8decb] bg-[#f8f3ea]">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#d4af37]" />
          <h3 className="text-base font-bold text-[#2c1d11]">Record Wholesale Purchase Estimate Bill</h3>
        </div>
        <button
          onClick={() => setIsRecordOpen(false)}
          className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
        >
          <CloseIcon className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Modal Body / Scrollable Form */}
      <form onSubmit={handleRecordPurchaseSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-black">

        {/* General Bill Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-500 uppercase">Supplier Vendor *</label>
            <input
              type="text"
              required
              value={purchaseForm.supplierName}
              onChange={(e) => setPurchaseForm(prev => ({ ...prev, supplierName: e.target.value }))}
              placeholder="Supplier/Wholesaler name"
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs font-semibold focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-500 uppercase">Bill Date *</label>
            <input
              type="date"
              required
              value={purchaseForm.date}
              onChange={(e) => setPurchaseForm(prev => ({ ...prev, date: e.target.value }))}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs font-semibold focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-500 uppercase">Bhaw (Silver Rate Rs/Kg) *</label>
            <input
              type="number"
              required
              value={purchaseForm.silverRate || ""}
              onChange={(e) => setPurchaseForm(prev => ({ ...prev, silverRate: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs font-semibold focus:outline-none "
            />
            <span className="text-[10px] text-slate-400 mt-0.5">Equivalent to ₹{(purchaseForm.silverRate / 1000).toFixed(2)}/g</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Old Fine (g)</label>
              <input
                type="number"
                step={0.01}
                value={purchaseForm.oldBalanceFine || ""}
                onChange={(e) => setPurchaseForm(prev => ({ ...prev, oldBalanceFine: parseFloat(e.target.value) || 0 }))}
                className="px-2 py-2 border border-slate-200 rounded-lg bg-white text-xs "
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-500 uppercase">Old Cash (Rs)</label>
              <input
                type="number"
                value={purchaseForm.oldBalanceAmount || ""}
                onChange={(e) => setPurchaseForm(prev => ({ ...prev, oldBalanceAmount: parseFloat(e.target.value) || 0 }))}
                className="px-2 py-2 border border-slate-200 rounded-lg bg-white text-xs "
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-sm font-bold text-slate-800">1. Purchase Items Sheet</h4>
            <button
              type="button"
              onClick={() => {
                setPurchaseForm(prev => ({
                  ...prev,
                  items: [
                    ...prev.items,
                    {
                      sku: "",
                      productName: "",
                      quantity: 1,
                      weight: "",
                      less: "",
                      tunch: "92.5",
                      labRate: "",
                      labRateType: "PER_KG"
                    }
                  ]
                }));
              }}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-2 text-center">Amount</th>
                  <th className="py-2.5 px-3 text-center">Item</th>
                  <th className="py-2.5 px-2 text-center w-[10%]">Qty (pcs)</th>
                  <th className="py-2.5 px-2 text-center w-[12%]">Gross Wt (g)</th>
                  <th className="py-2.5 px-2 text-center w-[10%]">Less (g)</th>
                  <th className="py-2.5 px-2 text-center w-[12%]">Net Wt (g)</th>
                  <th className="py-2.5 px-2 text-center w-[12%]">Tunch (%)</th>
                  <th className="py-2.5 px-2 text-center w-[15%]">Lab / Making</th>
                  <th className="py-2.5 px-2 text-right">Fine (g)</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculatedFormValues.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">

                    {/* Amount */}
                    <td className="py-2.5 px-2 text-center font-semibold  text-slate-850">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>


                    {/* Selector */}
                    <td className="py-2.5 px-3 text-left">
                      {item.sku && (item.sku === "NEW_ITEM" || item.sku.startsWith("NEW_") || !productsList.some(p => p._id === item.sku)) ? (
                        <div className="flex flex-col gap-1 w-full min-w-[150px]">
                          <input
                            type="text"
                            required
                            placeholder="New product name"
                            value={item.productName || ""}
                            onChange={(e) => {
                              const name = e.target.value;
                              const cleanName = name.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
                              const newItems = [...purchaseForm.items];
                              newItems[idx] = {
                                ...newItems[idx],
                                productName: name,
                                sku: cleanName ? `NEW_${cleanName}` : "NEW_ITEM"
                              };
                              setPurchaseForm(prev => ({ ...prev, items: newItems }));
                            }}
                            className="w-full px-2 py-1 border border-indigo-200 bg-indigo-50/20 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-left"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...purchaseForm.items];
                              newItems[idx] = {
                                ...newItems[idx],
                                sku: "",
                                productName: ""
                              };
                              setPurchaseForm(prev => ({ ...prev, items: newItems }));
                            }}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 text-left font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
                          >
                            ← Existing Product
                          </button>
                        </div>
                      ) : (
                        <select required value={item.sku} onChange={(e) => {
                          const val = e.target.value;
                          if (val === "NEW_ITEM") {
                            const newItems = [...purchaseForm.items];
                            newItems[idx] = {
                              ...newItems[idx],
                              sku: "NEW_ITEM",
                              productName: "",
                              tunch: "92.5",
                              labRate: 0,
                              labRateType: "PER_KG"
                            };
                            setPurchaseForm(prev => ({ ...prev, items: newItems }));
                          } else {
                            const prod = productsList.find(p => p._id === val);
                            if (prod) {
                              const newItems = [...purchaseForm.items];
                              newItems[idx] = {
                                ...newItems[idx],
                                sku: prod._id,
                                productName: prod.name,
                                tunch: String(prod.tunch || 92.5),
                                labRate: prod.lab || 0,
                                labRateType: "PER_KG"
                              };
                              setPurchaseForm(prev => ({ ...prev, items: newItems }));
                            }
                          }
                        }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="">Product</option>
                          {productsList.map(prod => (
                            <option key={prod._id} value={prod._id}>
                              {prod.name} ({prod.pieces} pcs)
                            </option>
                          ))}
                          <option value="NEW_ITEM" className="text-indigo-600 font-bold bg-indigo-50">
                            + Buy New / Custom Item
                          </option>
                        </select>
                      )}
                    </td>
                    {/* Qty */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity || ""}
                        onChange={(e) => {
                          const newItems = [...purchaseForm.items];
                          newItems[idx] = { ...newItems[idx], quantity: parseInt(e.target.value) || 0 };
                          setPurchaseForm(prev => ({ ...prev, items: newItems }));
                        }}
                        className="w-16 px-1.5 py-1 border border-slate-200 rounded-lg text-center"
                      />
                    </td>
                    {/* Gross weight */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        step={0.01}
                        value={item.weight || ""}
                        onChange={(e) => {
                          const newItems = [...purchaseForm.items];
                          newItems[idx] = { ...newItems[idx], weight: parseFloat(e.target.value) || 0 };
                          setPurchaseForm(prev => ({ ...prev, items: newItems }));
                        }}
                        className="w-20 px-1.5 py-1 border border-slate-200 rounded-lg text-center "
                      />
                    </td>
                    {/* Less */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="text"
                        value={item.less || ""}
                        onChange={(e) => {
                          const newItems = [...purchaseForm.items];
                          newItems[idx] = { ...newItems[idx], less: e.target.value };
                          setPurchaseForm(prev => ({ ...prev, items: newItems }));
                        }}
                        placeholder="0.0"
                        className="w-16 px-1.5 py-1 border border-slate-200 rounded-lg text-center "
                      />
                    </td>
                    {/* Net Weight */}
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700 ">
                      {item.netWeight.toFixed(2)}
                    </td>
                    {/* Tunch */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="text"
                        value={item.tunch}
                        onChange={(e) => {
                          const newItems = [...purchaseForm.items];
                          newItems[idx] = { ...newItems[idx], tunch: e.target.value };
                          setPurchaseForm(prev => ({ ...prev, items: newItems }));
                        }}
                        placeholder="e.g. 49.32+6.50"
                        className="w-24 px-1.5 py-1 border border-slate-200 rounded-lg text-center "
                      />
                    </td>
                    {/* Lab Rate */}
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <input
                          type="number"
                          value={item.labRate || ""}
                          onChange={(e) => {
                            const newItems = [...purchaseForm.items];
                            newItems[idx] = { ...newItems[idx], labRate: parseFloat(e.target.value) || 0 };
                            setPurchaseForm(prev => ({ ...prev, items: newItems }));
                          }}
                          className="w-16 px-1.5 py-1 border border-slate-200 rounded-lg text-center "
                        />
                        <select
                          value={item.labRateType}
                          onChange={(e) => {
                            const newItems = [...purchaseForm.items];
                            newItems[idx] = { ...newItems[idx], labRateType: e.target.value };
                            setPurchaseForm(prev => ({ ...prev, items: newItems }));
                          }}
                          className="px-1 py-1 border border-slate-200 rounded-lg text-[10px]"
                        >
                          <option value="PER_GRAM">/g</option>
                          <option value="PER_KG">/kg</option>
                          <option value="FLAT">flat</option>
                        </select>
                      </div>
                    </td>
                    {/* Fine */}
                    <td className="py-2.5 px-2 text-right font-semibold  text-slate-800">
                      {Math.round(item.fine)}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (purchaseForm.items.length === 1) return;
                          const newItems = purchaseForm.items.filter((_, i) => i !== idx);
                          setPurchaseForm(prev => ({ ...prev, items: newItems }));
                        }}
                        className="p-1 hover:bg-rose-50 text-slate-350 hover:text-rose-500 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Subtotal row */}
                <tr className="bg-slate-50/50 font-bold border-t border-b border-slate-250">
                  <td className="py-2.5 px-2 text-center  text-indigo-700">₹{calculatedFormValues.totals.amount.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3">Subtotal Items</td>

                  <td></td>
                  <td className="py-2.5 px-2 text-center ">{calculatedFormValues.totals.weight.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center ">{calculatedFormValues.totals.less.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center ">{calculatedFormValues.totals.netWt.toFixed(2)}</td>

                  <td></td>
                  <td></td>
                  <td className="py-2.5 px-2 text-right  text-indigo-700">{Math.round(calculatedFormValues.totals.fine)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Jama Credit Details & Cash Jama Payments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          {/* 2. Jama Exchange Section */}
          <div className="space-y-3 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">2. Jama Detail (Credit Returns)</h4>
              <button
                type="button"
                onClick={() => {
                  setPurchaseForm(prev => ({
                    ...prev,
                    jamaDetails: [
                      ...prev.jamaDetails,
                      {
                        description: "KACHHI",
                        weight: "",
                        less: "",
                        tunch: 46,
                        fine: 0
                      }
                    ]
                  }));
                }}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold transition-all"
              >
                + Add Jama Item
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto">
              <table className="w-full text-[11px] text-center border-collapse ">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-1">Description</th>
                    <th className="py-1 text-center">Wt</th>
                    <th className="py-1 text-center">Less</th>
                    <th className="py-1 text-center">Tunch</th>
                    <th className="py-1 text-right">Fine (g)</th>
                    <th className="py-1 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculatedFormValues.jamaDetails.map((jama, idx) => (
                    <tr key={idx}>
                      <td className="py-1">
                        <input
                          type="text"
                          value={jama.description}
                          onChange={(e) => {
                            const newJ = [...purchaseForm.jamaDetails];
                            newJ[idx] = { ...newJ[idx], description: e.target.value };
                            setPurchaseForm(prev => ({ ...prev, jamaDetails: newJ }));
                          }}
                          className="w-20 px-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <input
                          type="number"
                          step={0.01}
                          value={jama.weight || ""}
                          onChange={(e) => {
                            const newJ = [...purchaseForm.jamaDetails];
                            newJ[idx] = { ...newJ[idx], weight: parseFloat(e.target.value) || 0 };
                            setPurchaseForm(prev => ({ ...prev, jamaDetails: newJ }));
                          }}
                          className="w-14 px-1 border border-slate-200 rounded text-center"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <input
                          type="number"
                          step={0.01}
                          value={jama.less || ""}
                          onChange={(e) => {
                            const newJ = [...purchaseForm.jamaDetails];
                            newJ[idx] = { ...newJ[idx], less: parseFloat(e.target.value) || 0 };
                            setPurchaseForm(prev => ({ ...prev, jamaDetails: newJ }));
                          }}
                          className="w-12 px-1 border border-slate-200 rounded text-center"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <input
                          type="number"
                          value={jama.tunch || ""}
                          onChange={(e) => {
                            const newJ = [...purchaseForm.jamaDetails];
                            newJ[idx] = { ...newJ[idx], tunch: parseFloat(e.target.value) || 0 };
                            setPurchaseForm(prev => ({ ...prev, jamaDetails: newJ }));
                          }}
                          className="w-12 px-1 border border-slate-200 rounded text-center"
                        />
                      </td>
                      <td className="py-1 text-right font-bold text-slate-800">
                        {Math.round(jama.fine)}
                      </td>
                      <td className="py-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newJ = purchaseForm.jamaDetails.filter((_, i) => i !== idx);
                            setPurchaseForm(prev => ({ ...prev, jamaDetails: newJ }));
                          }}
                          className="text-rose-600 hover:text-rose-800"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {purchaseForm.jamaDetails.length === 0 && (
                <div className="py-4 text-center text-slate-400 text-[11px] italic">No exchange credit returns added.</div>
              )}
            </div>
          </div>

          {/* 3. Cash Jama Payments Section */}
          <div className="space-y-3 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">3. Cash Jama (Payments)</h4>
              <button
                type="button"
                onClick={() => {
                  setPurchaseForm(prev => ({
                    ...prev,
                    cashJamaList: [
                      ...prev.cashJamaList,
                      {
                        type: "CASH",
                        description: "",
                        amount: 0
                      }
                    ]
                  }));
                }}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold transition-all"
              >
                + Add Payment
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto">
              <table className="w-full text-[11px] text-center border-collapse ">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-1">Channel</th>
                    <th className="py-1">Description / Bank info</th>
                    <th className="py-1 text-right">Amount (Rs)</th>
                    <th className="py-1 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculatedFormValues.cashJamaList.map((cash, idx) => (
                    <tr key={idx}>
                      <td className="py-1">
                        <select
                          value={cash.type}
                          onChange={(e) => {
                            const newC = [...purchaseForm.cashJamaList];
                            newC[idx] = { ...newC[idx], type: e.target.value };
                            setPurchaseForm(prev => ({ ...prev, cashJamaList: newC }));
                          }}
                          className="px-1 border border-slate-200 rounded text-[10px]"
                        >
                          <option value="CASH">CASH</option>
                          <option value="BANK_TRANSFER">BANK TRANSFER</option>
                          <option value="UPI">UPI</option>
                        </select>
                      </td>
                      <td className="py-1">
                        <input
                          type="text"
                          value={cash.description}
                          onChange={(e) => {
                            const newC = [...purchaseForm.cashJamaList];
                            newC[idx] = { ...newC[idx], description: e.target.value };
                            setPurchaseForm(prev => ({ ...prev, cashJamaList: newC }));
                          }}
                          placeholder="Ref code / info"
                          className="w-28 px-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <input
                          type="number"
                          value={cash.amount || ""}
                          onChange={(e) => {
                            const newC = [...purchaseForm.cashJamaList];
                            newC[idx] = { ...newC[idx], amount: parseFloat(e.target.value) || 0 };
                            setPurchaseForm(prev => ({ ...prev, cashJamaList: newC }));
                          }}
                          className="w-20 px-1 border border-slate-200 rounded text-right"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newC = purchaseForm.cashJamaList.filter((_, i) => i !== idx);
                            setPurchaseForm(prev => ({ ...prev, cashJamaList: newC }));
                          }}
                          className="text-rose-600 hover:text-rose-800"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {purchaseForm.cashJamaList.length === 0 && (
                <div className="py-4 text-center text-slate-400 text-[11px] italic">No cash / transfer payments logged yet.</div>
              )}
            </div>
          </div>

        </div>

        {/* Real-time Math Breakdown Sheet */}
        <div className="bg-indigo-50/30 p-5 border border-indigo-100 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs ">
          <div className="space-y-2">
            <h5 className="font-bold text-indigo-950 uppercase border-b border-indigo-100 pb-1">Silver Weight Balance</h5>
            <div className="flex justify-between">
              <span>Purchase Items Fine:</span>
              <span>{calculatedFormValues.totals.fine} g</span>
            </div>
            <div className="flex justify-between">
              <span>Old Balance Fine:</span>
              <span>{(parseFloat(purchaseForm.oldBalanceFine) || 0).toFixed(2)} g</span>
            </div>
            <div className="flex justify-between font-bold text-slate-700">
              <span>Grand Fine Weight:</span>
              <span>{calculatedFormValues.grandTotalFine.toFixed(2)} g</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Kachhi Returns (Credit):</span>
              <span>-{calculatedFormValues.jamaTotals.fine.toFixed(2)} g</span>
            </div>
            <div className="flex justify-between font-extrabold text-indigo-700 border-t border-indigo-100/50 pt-1">
              <span>Outstanding Fine:</span>
              <span>{calculatedFormValues.outstandingFine.toFixed(2)} g</span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-indigo-950 uppercase border-b border-indigo-100 pb-1">Labor & Silver Cost</h5>
            <div className="flex justify-between">
              <span>Items Labor Amount:</span>
              <span>₹{calculatedFormValues.totals.amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Old Cash Balance:</span>
              <span>₹{(parseFloat(purchaseForm.oldBalanceAmount) || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-700">
              <span>Total Labor Cash:</span>
              <span>₹{calculatedFormValues.grandTotalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-indigo-650">
              <span>Silver Cost (Bhaw conversion):</span>
              <span>₹{calculatedFormValues.bhawSilverCost.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-indigo-100/50 pt-1">
              <span>GST (3% tax):</span>
              <span>₹{calculatedFormValues.gst.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="space-y-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-indigo-950 uppercase border-b border-indigo-100 pb-1">Grand Settlement</h5>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 pt-1">
                <span>Total Net Payable:</span>
                <strong className="text-slate-900 text-sm">₹{calculatedFormValues.grandTotalNet.toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-between text-emerald-700 text-[11px] font-semibold">
                <span>Cash Payments (Jama):</span>
                <strong>-₹{calculatedFormValues.totalCashJama.toLocaleString("en-IN")}</strong>
              </div>
            </div>
            <div className="border-t border-indigo-200/50 pt-2 space-y-1">
              <div className="flex justify-between font-black text-rose-600 text-xs">
                <span>Final Cash Outstanding:</span>
                <span>₹{calculatedFormValues.finalOutstandingAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-black text-emerald-600 text-xs">
                <span>Final Fine Outstanding:</span>
                <span>{calculatedFormValues.finalOutstandingFine.toFixed(2)} g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e8decb] pt-4 mt-6">
          <button
            type="button"
            onClick={() => setIsRecordOpen(false)}
            className="px-4 py-2 border border-[#e8decb] hover:bg-[#f7f0e3] text-[#2c1d11] font-semibold text-sm rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] font-bold text-sm rounded-xl transition-all cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60"
          >
            Post Restock Bill
          </button>
        </div>

      </form>
    </div>
  </div>
  )
}

export default AddPurchase