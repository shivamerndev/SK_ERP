import { createSlice } from "@reduxjs/toolkit";

const EMPTY_ROW = {
  item: "",
  weight: "",
  panniDetail: "",
  less: "",
  netWt: 0,
  tunch: "",
  lab: "",
  amount: 0,
  fine: 0
};

// Safe parser for Panni Detail (e.g. 8*2.7+49*2.3 or 4*2.4)
const parsePanniDetail = (val) => {
  const clean = String(val || "").replace(/\s+/g, "");
  if (!clean) return null;

  try {
    const terms = clean.split("+");
    let total = 0;
    for (let term of terms) {
      if (term.includes("*")) {
        const factorParts = term.split("*");
        if (factorParts.length !== 2) return null;
        const f1 = parseFloat(factorParts[0]);
        const f2 = parseFloat(factorParts[1]);
        if (isNaN(f1) || isNaN(f2)) return null;
        total += f1 * f2;
      } else {
        const val = parseFloat(term);
        if (isNaN(val)) return null;
        total += val;
      }
    }
    return Math.round(total);
  } catch (e) {
    return null;
  }
};

// Labor Amount Calculator: parse expression or scale rate
const calculateRowLabor = (netWt, lab) => {
  const clean = String(lab || "").replace(/\s+/g, "");
  if (!clean) return 0;

  if (clean.includes("*")) {
    const parts = clean.split("*");
    if (parts.length === 2) {
      const a = parseFloat(parts[0]);
      const b = parseFloat(parts[1]);
      if (!isNaN(a) && !isNaN(b)) {
        return Math.round(a * b);
      }
    }
  }

  const r = parseFloat(clean);
  if (isNaN(r)) return 0;
  return Math.round((netWt * r) / 1000);
};

const getInitialDate = () => {
  try {
    return new Date().toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    customers: [],
    products: [],
    history: [],

    // Form State - Invoice Metadata
    billNo: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    selectedCustomerId: "",

    date: getInitialDate(),
    time: "",
    topHeader: "|| SHREE GANESHAYAA NAMAH ||",
    billTitle: "ROUGH ESTIMATE",

    // Form State - Bill Items Grid
    items: [{ ...EMPTY_ROW }],

    // Form State - Adjustments & Jama
    lastBalanceAmount: "",
    lastBalanceFine: "",

    jamaDetails: "",
    jamaWeight: "",
    jamaNetWt: "",
    jamaTunch: "",
    jamaAmount: "",
    silverRate: "",

    // Options
    postToLedger: true,
    previewBill: null,

    // Autocomplete UI status
    custSearchFocused: false,
    itemSearchFocused: null, // row index
  },
  reducers: {
    updateField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    addItemRow: (state) => {
      state.items.push({ ...EMPTY_ROW });
    },
    removeItemRow: (state, action) => {
      const index = action.payload;
      if (state.items.length === 1) {
        state.items = [{ ...EMPTY_ROW }];
      } else {
        state.items.splice(index, 1);
      }
    },
    updateItemRow: (state, action) => {
      const { index, field, value } = action.payload;
      if (!state.items[index]) return;
      state.items[index][field] = value;

      // Trigger auto-less from Panni Detail
      if (field === "panniDetail") {
        const autoLess = parsePanniDetail(value);
        if (autoLess !== null) {
          state.items[index].less = String(autoLess);
        }
      }

      // Calculations
      const w = parseFloat(state.items[index].weight) || 0;
      const l = parseFloat(state.items[index].less) || 0;
      const net = Math.max(0, w - l);
      state.items[index].netWt = net;

      const t = parseFloat(state.items[index].tunch) || 0;
      state.items[index].fine = Math.round((net * t) / 100);

      const labVal = state.items[index].lab || "";
      state.items[index].amount = calculateRowLabor(net, labVal);
    },
    clearForm: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.customerAddress = "";
      state.selectedCustomerId = "";
      state.items = [{ ...EMPTY_ROW }];
      state.lastBalanceAmount = "";
      state.lastBalanceFine = "";
      state.jamaDetails = "";
      state.jamaWeight = "";
      state.jamaNetWt = "";
      state.jamaTunch = "";
      state.jamaAmount = "";
      state.silverRate = "";

      // Auto-generate next Bill No
      const maxNo = state.history.reduce((acc, curr) => {
        const val = parseInt(curr.billNo);
        return !isNaN(val) ? Math.max(acc, val) : acc;
      }, 0);
      state.billNo = String(maxNo ? maxNo + 1 : 80);
    }
  }
});

export const {
  updateField,
  setCustomers,
  setProducts,
  setHistory,
  addItemRow,
  removeItemRow,
  updateItemRow,
  clearForm
} = billingSlice.actions;

export default billingSlice.reducer;