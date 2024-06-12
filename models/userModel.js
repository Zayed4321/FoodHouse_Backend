import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    reconfirmPassword: {
        type: String,
    },
    phone: {
        type: Number,
    },
    answer: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
},
    { timestamps: true });

const USER = mongoose.model("users", userSchema);

export default USER;