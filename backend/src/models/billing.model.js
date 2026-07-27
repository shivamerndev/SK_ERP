import mongoose from "mongoose";
import Counter from "./counter.model.js";

const itemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: String,
    default: ""
  },
  panniDetail: {
    type: String,
    default: ""
  },
  less: {
    type: String,
    default: ""
  },
  netWt: {
    type: Number,
    default: 0
  },
  tunch: {
    type: String,
    default: ""
  },
  lab: {
    type: String,
    default: ""
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

const billingSchema = new mongoose.Schema(
  {
    billNo: {
      type: String,
      unique: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerPhone: {
      type: String,
      trim: true
    },
    customerAddress: {
      type: String,
      trim: true
    },
    customerId: {
      type: Number,
      ref: "Customer"
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    topHeader: {
      type: String,
      default: "|| SHREE GANESHAYAA NAMAH ||"
    },
    title: {
      type: String,
      default: "ROUGH ESTIMATE"
    },
    items: [itemSchema],
    totals: {
      weight: { type: Number, default: 0 },
      less: { type: Number, default: 0 },
      netWt: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
      fine: { type: Number, default: 0 }
    },
    lastBalance: {
      amount: { type: Number, default: 0 },
      fine: { type: Number, default: 0 }
    },
    jamaDetail: {
      details: { type: String, default: "" },
      weight: { type: Number, default: 0 },
      netWt: { type: Number, default: 0 },
      tunch: { type: String, default: "" },
      fine: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    finalBaki: {
      amount: { type: Number, default: 0 },
      fine: { type: Number, default: 0 }
    },
    postedToUdhaar: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

billingSchema.pre("save", async function () {
  if (this.isNew && !this.billNo) {
    let counter = await Counter.findById("billNo");
    if (!counter) {
      counter = await Counter.create({ _id: "billNo", seq: 80 });
    } else {
      counter = await Counter.findByIdAndUpdate(
        "billNo",
        { $inc: { seq: 1 } },
        { new: true }
      );
    }
    this.billNo = String(counter.seq);
  }
});

export default mongoose.model("Billing", billingSchema);