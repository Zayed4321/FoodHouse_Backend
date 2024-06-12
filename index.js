import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { mongoConnect } from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import productRouter from "./routes/productRouter.js";
import bodyParser from "body-parser";

// Used to Enable ENV
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middlware is used 
app.use(express.json());
app.use(cors());

// Database connection 
mongoConnect();

// Main Routes inserted

// Authentication Router for Food Delivery
app.use('/api/v1/users', authRouter);

// Router to control the category of Food
app.use('/api/v1/category', categoryRouter);

// Router to Launch New Products of Food
app.use('/api/v1/product', productRouter);

app.get('/', (req, res) => {
    res.send('Hello Guys!')
});


// We may use colors.js to color the messages and consoles in the terminal

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`)
});