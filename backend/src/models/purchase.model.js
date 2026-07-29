import mongoose from "mongoose";
import Counter from "./counter.model.js";

const purchaseItemSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  less: {
    type: Number,
    default: 0
  },
  netWeight: {
    type: Number,
    default: 0
  },
  tunch: {
    type: String,
    default: ""
  },
  effectivePurity: {
    type: Number,
    default: 0
  },
  labRate: {
    type: Number,
    default: 0
  },
  labRateType: {
    type: String,
    enum: ["PER_GRAM", "PER_KG", "FLAT"],
    default: "PER_GRAM"
  },
  amount: {
    type: Number,
    default: 0
  },
  fine: {
    type: Number,
    default: 0
  }
});

const purchaseJamaSchema = new mongoose.Schema({
  description: {
    type: String,
    default: ""
  },
  weight: {
    type: Number,
    default: 0
  },
  less: {
    type: Number,
    default: 0
  },
  netWeight: {
    type: Number,
    default: 0
  },
  tunch: {
    type: Number,
    default: 0
  },
  fine: {
    type: Number,
    default: 0
  }
});

const cashJamaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CASH", "BANK_TRANSFER", "UPI"],
    default: "CASH"
  },
  description: {
    type: String,
    default: ""
  },
  amount: {
    type: Number,
    default: 0
  }
});

const purchaseSchema = new mongoose.Schema(
  {
    billCode: {
      type: String,
      unique: true
    },
    supplierName: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: ""
    },
    silverRate: {
      type: Number,
      required: true
    },
    oldBalanceFine: {
      type: Number,
      default: 0
    },
    oldBalanceAmount: {
      type: Number,
      default: 0
    },
    items: [purchaseItemSchema],
    jamaDetails: [purchaseJamaSchema],
    cashJamaList: [cashJamaSchema],
    totals: {
      weight: { type: Number, default: 0 },
      less: { type: Number, default: 0 },
      netWt: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }, // total labor
      fine: { type: Number, default: 0 } // total fine
    },
    netCashPayable: {
      type: Number,
      default: 0
    },
    cost: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      default: "Cash"
    },
    finalOutstanding: {
      amount: { type: Number, default: 0 },
      fine: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

purchaseSchema.pre("save", async function () {
  if (this.isNew && !this.billCode) {
    let counter = await Counter.findById("purchaseBillCode");
    if (!counter) {
      counter = await Counter.create({ _id: "purchaseBillCode", seq: 101 });
    } else {
      counter = await Counter.findByIdAndUpdate(
        "purchaseBillCode",
        { $inc: { seq: 1 } },
        { new: true }
      );
    }
    this.billCode = `PUR-2026-${counter.seq}`;
  }
});

export default mongoose.model("Purchase", purchaseSchema);
