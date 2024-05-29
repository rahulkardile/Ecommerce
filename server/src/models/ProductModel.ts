import mongoose from "mongoose";

const ProductSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: [true, "Please provide photos"]
    },
    description: {
        type: String,
        required: [true, "Please provide description"]
    },
    price: {
        type: Number,
        require: [true, "Please provide price of a product"]
    },
    stock: {
        type: Number,
        required: [true, "please Provide stock details"]
    },
    category: {
        type: String,
        required: [true, "Category name needed!"],
        trim: true
    },
    Owner: {
        type: mongoose.Types.ObjectId,
        require: [true, "Owener info is needed"]
    }
}, {
    timestamps: true
})

export const Product = mongoose.model("Product", ProductSchema);