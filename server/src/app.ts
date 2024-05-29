import express, { NextFunction, Request, Response } from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors"
import cookieParser from "cookie-parser";

// routes imports
import userRouter from "./routes/UserRouter.js";
import ProductRouter from "./routes/ProductRouter.js"
import OrderRouter from "./routes/OrderRouter.js"
import PaymentRouter from './routes/PaymentRoute.js'
import Dashboard from "./routes/Statistics.js";

// Error Handlers
import ErrorHandler from "./utils/Error-class.js";

// Config's
dotenv.config();
const MONGO_URL: any = process.env.MONGO_URL;
const PORT = 3300;
const STRIPE_KEY = String(process.env.STRIPE_KEY);

// setUp
const app = express();

app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(morgan("dev"))

// payment Getway
export const stripe = new Stripe(STRIPE_KEY);

// cache
export const myCache = new NodeCache();


//mongoDB Connection 
try {
    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("Database is connected");
        })
        .catch(() => {
            console.log("Database is not connected");
        })
} catch (error) {
    console.log("Database is Disconnected");
}

app.get('/get-cookies', (req, res) => {
    const cookies = req.cookies;
    res.send(cookies);
  });

// routes
app.use("/api/user", userRouter)
app.use("/api/Product", ProductRouter);
app.use("/api/order", OrderRouter)
app.use("/api/payment", PaymentRouter)
app.use("/api/dashboard", Dashboard)

// middleware handling
app.use("/api/uploads", express.static("uploads"))
app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {

    err.message ||= "Internal Server Error"
    err.statusCode ||= 500;
    
    if(err.code === 1100){
        err.message = "Account Aready Exist!"
    }
    
    if(err.name === "CastError") {
        err.message = "Invalid Id"
    }


    return res
        .status(err.statusCode)
        .json({
            statusCode: err.statusCode,
            success: false,
            message: err.message,
            
        })
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT} . . .`);
}) 