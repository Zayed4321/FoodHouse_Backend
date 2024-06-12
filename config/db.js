import mongoose from "mongoose";

export const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log( "Database is connected to" , mongoose.connection.name);
    } catch (error) {
        console.log(error.message);
    }
}