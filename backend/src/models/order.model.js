import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId, // owner can be 2
      ref: "User",
      required: true,
      index: true,
    },
    customer: {
      type: Number,
      ref: "Customer",
      required: true,
      index: true,
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    date: {
      type: Date,
      default: Date.now
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partially_paid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank_transfer", "other"],
      default: "cash",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
