import { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import handleForm from "../../utils/formHandler.utils.js";

const parseMathExpression = (expr) => {
  if (!expr) return 0;
  try {
    const clean = String(expr).replace(/\s+/g, "");
    if (!/^[0-9.+\-*/()]+$/.test(clean)) {
      return parseFloat(clean) || 0;
    }
    const result = new Function(`return (${clean})`)();
    return typeof result === "number" && !isNaN(result) ? result : 0;
  } catch (e) {
    return 0;
  }
};

const PRESET_IMAGES = [
  { name: "Necklace 1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60" },
  { name: "Necklace 2", url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&auto=format&fit=crop&q=60" },
  { name: "Watch Gold", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60" },
  { name: "Ring Diamond", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=60" },
  { name: "Earrings Pearl", url: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=150&auto=format&fit=crop&q=60" },
  { name: "Bracelet Charm", url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=150&auto=format&fit=crop&q=60" }
];

const AddProduct = ({ setIsAddModalOpen, allCategories, handleCreateProduct, addNotification }) => {


  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(allCategories[0] || "payal");
  const [customCategory, setCustomCategory] = useState("");
  const [formPieces, setFormPieces] = useState("");
  const [formWeight, setFormWeight] = useState("");
  const [formTunch, setFormTunch] = useState("");
  const [formLab, setFormLab] = useState("");
  const [formPanniDetail, setFormPanniDetail] = useState("");
  const [formImageUrl, setFormImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formErrors, setFormErrors] = useState({});

  const handleAddSubmit = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Product name is required";

    const parsedPieces = data.pieces ? parseInt(data.pieces) : 0;
    if (isNaN(parsedPieces) || parsedPieces < 0) errors.pieces = "Pieces must be a non-negative number";

    const weightArr = data.weight ? data.weight.split(",").map(w => parseFloat(w.trim())).filter(w => !isNaN(w)) : [];
    if (weightArr.length === 0) errors.weight = "At least one valid weight (number) is required";

    const parsedTunch = parseFloat(data.tunch);
    if (isNaN(parsedTunch) || parsedTunch < 0) errors.tunch = "Tunch must be a positive number";

    const parsedLab = parseFloat(data.lab);
    if (isNaN(parsedLab) || parsedLab < 0) errors.lab = "Lab must be a positive number";

    const parsedPanni = data.panniDetail ? parseMathExpression(data.panniDetail) : 0;
    if (isNaN(parsedPanni) || parsedPanni < 0) errors.panniDetail = "Panni detail must be a positive number";

    if (data.category === "new" && !data.customCategory?.trim()) {
      errors.category = "Category name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const finalCategory = data.category === "new" ? data.customCategory.trim() : data.category;

    const payload = {
      name: data.name.trim(),
      category: finalCategory.toLowerCase(),
      pieces: parsedPieces,
      weight: weightArr,
      tunch: parsedTunch,
      lab: parsedLab,
      panniDetail: parsedPanni,
      image: data.image || PRESET_IMAGES[0].url
    };

    handleCreateProduct(payload)
      .then(() => {
        setIsAddModalOpen(false);
        if (addNotification) {
          addNotification(`Added product "${payload.name}"`, "success");
        }
      })
      .catch(() => { });
  };

  return (
    <div className="fixed inset-0 h-screen w-full left-0 top-0 bg-[#0a0502]/60 backdrop-blur-md flex items-center justify-center z-50 transition-all">
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8decb] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-[#e8decb] flex items-center justify-between bg-[#f8f3ea]">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#d4af37]" size={18} />
            <h3 className="font-extrabold text-[#2c1d11] text-lg">Add New Product</h3>
          </div>
          <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleForm(handleAddSubmit)}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
              <input
                type="text"
                name="name"
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
                  name="category"
                  value={formCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormCategory(val);
                    if (val === "new") {
                      setCustomCategory("");
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all capitalize font-medium cursor-pointer"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c} className="uppercase">
                      {c}
                    </option>
                  ))}
                  <option value="new" className="text-blue-600 font-bold text-center">
                    + New Category
                  </option>
                </select>
              </div>

              {/* Pieces */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pieces</label>
                <input
                  type="number"
                  name="pieces"
                  value={formPieces}
                  onChange={(e) => setFormPieces(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                />
                {formErrors.pieces && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.pieces}</span>}
              </div>
            </div>

            {formCategory === "new" && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Category Name</label>
                <input
                  type="text"
                  name="customCategory"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. payal, ring, got..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase"
                />
                {formErrors.category && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.category}</span>}
              </div>
            )}

            {/* Weights input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weights (g) <span className="text-slate-400 font-medium capitalize">(comma separated for multiple pieces)</span></label>
              <input
                type="text"
                name="weight"
                value={formWeight}
                onChange={(e) => setFormWeight(e.target.value)}
                placeholder="e.g. 10.5, 12.3, 9.8"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all "
              />
              {formErrors.weight && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.weight}</span>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Tunch */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tunch (%)</label>
                <input
                  type="number"
                  step="any"
                  name="tunch"
                  value={formTunch}
                  onChange={(e) => setFormTunch(e.target.value)}
                  placeholder="e.g. 90"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all "
                />
                {formErrors.tunch && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.tunch}</span>}
              </div>

              {/* Lab */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lab (₹)</label>
                <input
                  type="number"
                  step="any"
                  name="lab"
                  value={formLab}
                  onChange={(e) => setFormLab(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all "
                />
                {formErrors.lab && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.lab}</span>}
              </div>

              {/* PanniDetail */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panni (g)</label>
                <input
                  type="text"
                  name="panniDetail"
                  value={formPanniDetail}
                  onChange={(e) => setFormPanniDetail(e.target.value)}
                  placeholder="e.g. 5 or 1*2.5 + 1*3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all "
                />
                {formErrors.panniDetail && <span className="text-rose-500 text-xs font-semibold mt-1 block">{formErrors.panniDetail}</span>}
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

            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4.5 py-2 border border-[#e8decb] rounded-xl text-sm font-semibold text-[#2c1d11] hover:bg-[#f7f0e3] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#f3d078] hover:via-[#d4af37] hover:to-[#b8860b] text-[#140b04] font-bold px-5 py-2 rounded-xl text-sm transition-all cursor-pointer shadow-[0_4px_16px_rgba(212,175,55,0.3)] border border-[#ffe8ad]/60"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;