import mongoose from "mongoose";
import Counter from "./counter.model.js";


const transactionSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    date: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["LENT", "PAID"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    method: {
      type: String,
      enum: ["UPI", "Cash", "Card", "Bank Transfer"]
    },
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing"
    }
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    shopName: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalLend: {
      type: Number,
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: 500
    },
    loyality: {
      type: String,
      enum: ["vip", "regular", "new"],
      default: "vip",
    },
    joinedAt: {
      type: mongoose.Schema.Types.Mixed,
      default: "Older",
    },
    transactions: [transactionSchema]
  },
  { timestamps: true }
);

customerSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "customerId" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );
    this._id = counter.seq;
  }
});

export default mongoose.model("Customer", customerSchema);