import mongoose from "mongoose";

const userSchema = new mongoose.Schema(  // focused on payal
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        pieces: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            default: "payal",
        },
        image: {
            type: String,
            default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60",
        },
        weight: [{
            type: Number,
            required: true,
            default: 0,
        }],
        panniDetail: {
            type: Number,
            default: 0,
        },
        tunch: {
            type: Number,
            required: true,
            default: 0
        },
        waste: {
            type: Number,
            default: 0,
        },
        lab: {
            type: Number,
            required: true,
            default: 0,
        },
    }, { timestamps: true }
);

export default mongoose.model("Product", userSchema); 