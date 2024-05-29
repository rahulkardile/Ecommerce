import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "Please Enter the Coupon code"],
        unique: true
    },
    amount: {
        type: Number,
        required: [true, "Please enter the discount amount"]
    }
}, {
    timestamps: true
})

export const Coupon = mongoose.model("Coupon", CouponSchema);