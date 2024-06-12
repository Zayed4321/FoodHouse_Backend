import mongoose from "mongoose";

const foodCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // unique: true
    },
    slug: {
        type: String,
        lowercase: true,
    },
});

const FoodCategory = mongoose.model("Category", foodCategorySchema)

export default FoodCategory;