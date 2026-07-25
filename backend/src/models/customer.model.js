import mongoose from "mongoose";
import Counter from "./counter.model.js";


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
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalLend: {
      type: Number,
      default: 0,
    },
    loyality: {
      type: String,
      enum: ["vip", "regular", "new"],
      default: "vip",
    },
    joinedAt: {
      type: mongoose.Schema.Types.Mixed,
      default: "Older",
    }
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