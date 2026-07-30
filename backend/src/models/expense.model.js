import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"]
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["UPI", "Cash", "Card", "Bank Transfer"],
      default: "UPI"
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
