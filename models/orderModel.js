import mongoose, { mongo } from "mongoose";

const foodOrderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.ObjectId,
            ref: "Products",
        },
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "users",
    },
    status: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Processing", "Shipping", "Delivered", "Cancelled"],
    },

}, { timestamps: true },);

const FoodOrder = mongoose.model("Order", foodOrderSchema)

export default FoodOrder;