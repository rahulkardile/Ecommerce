import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "address needed"]
        },
        city: {
            type: String,
            required: [true, "city needed"]
        },
        state: {
            type: String,
            required: [true, "state needed"]
        },
        country: {
            type: String,
            required: [true, "country needed"]
        },
        pinCode: {
            type: Number,
            required: [true, "pinCode needed"]
        },
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "User Detail Needed"]
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal is needed"]
    },
    shippingCharges: {
        type: Number,
        required: [true, "Shipping Charges is needed"]
    },
    discount: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        required: [true, "tax is needed"]
    },
    total: {
        type: Number,
        required: [true, "total is needed"]
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing"
    },
    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            }
        }
    ]
}, {
    timestamps: true
});

export const Order = mongoose.model("Order", OrderSchema);