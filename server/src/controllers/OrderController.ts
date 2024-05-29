import { NextFunction, Response, Request, request } from "express"
import { NewOrderRequestBody } from "../types/types.js"
import { Order } from "../models/OrderModel.js";
import { InvalidateCache, reduceStock } from "../middleware/features.js";
import ErrorHandler from "../utils/Error-class.js";
import { myCache } from "../app.js";
import { Product } from "../models/ProductModel.js";
import { log } from "console";

// create new order
export const newOrder = async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction) => {

    try {
        const {
            shippingInfo,
            subtotal,
            tax,
            shippingCharges,
            total,
            discount,
            orderItems } = req.body;

            const user = (req as any).data.id
            // let discount = req.body.discount;

            // if (!discount) return discount = 0

        if (
            !shippingInfo ||
            !user ||
            !subtotal ||
            !tax ||
            !shippingCharges ||
            !total ||
            !orderItems
        ) return next(new ErrorHandler("Something is missing in order!", 400));

        await Order.create({
            shippingInfo,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
            orderItems
        })

        await reduceStock(orderItems);
        await InvalidateCache({
            product: true,
            order: true,
            admin: true,
            userId: user,
        })

        return res.status(200).json({
            success: true,
            message: "Order placed successfully"
        })

    } catch (error) {
        next(error)
    }
}

// get order by user
export const MyOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: user } = (req as any).data;
        let myOrder = [];

        // if (myCache.has(`myOrder-${user}`)) {
        //     myOrder = JSON.parse(myCache.get(`myOrder-${user}`) as string)
        // } else {
            myOrder = await Order.find({ user: user });
            if (!myOrder) return next(new ErrorHandler("Order Not Found", 404));
            myCache.set(`myOrder-${user}`, JSON.stringify(myOrder))
        // }

        res.status(200).json({
            success: true,
            orders: myOrder
        })

    } catch (error) {
        next(error);
    }
} 

// get order by id
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const key = `order_${id}`;
        let order;

        if (myCache.has(key)) {
            order = JSON.parse(myCache.get(key) as string)
        } else {
            order = await Order.findById(id).populate("user")
            if (!order) return next(new ErrorHandler("Order Not Found", 404));

            myCache.set(key, JSON.stringify(order))
        }
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        next(error)
    }
}

// get all order
export const allOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { id, role } = (req as any).data;
        if(role !== "admin") return next(new ErrorHandler("Bad Request!",400))

        let order = [];
        if (myCache.has("allOrders")) {
            order = JSON.parse(myCache.get("allOrders") as string);
        } else {
            // in the order find function finds order and the populate function find in that order user with its id
            order = await Order.find().populate("user");
            myCache.set("allOrders", JSON.stringify(order))
        }

        res.status(200).json({
            success: true,
            orders: order
        })

    } catch (error) {
        next(error);
    }
}

// change order status 
export const processOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) return next(new ErrorHandler("order not found", 404));

        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered"
                break;
        }

        await order.save();

        await InvalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: String(order.user),
            orderId: String(order._id)
        });

        res.status(200).json({
            success: true,
            message: "updated status"
        })

    } catch (error) {
        next(error);
    }
}

// order update currently desabled
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params;
        const { shippingInfo } = req.body;

        const updateData = await Order.findByIdAndUpdate(id, {
            shippingInfo,
        }, { new: true })

        res.status(200).json({
            success: true,
            message: "updated successfully"
        })

    } catch (error) {
        next(error);
    }

}

// delete order
export const deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deleteOrder = await Order.findById(id);

        if (!deleteOrder) return next(new ErrorHandler("Can Not Delete the order!", 404));
        
        await InvalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: String(deleteOrder.user),
            orderId: String(deleteOrder._id)
        });
        
        await Order.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "order deleted successfully"
        })

    } catch (error) {
        next(error);
    }
}