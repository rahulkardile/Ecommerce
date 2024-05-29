import { NextFunction, Request, Response } from "express";
import { Coupon } from "../models/Coupon.js";
import ErrorHandler from "../utils/Error-class.js";
import { stripe } from "../app.js";
import { User } from "../models/UserModels.js";


export const createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { amount } = req.body;

        if (!amount) return next(new ErrorHandler("Amount is needed!", 400));
        const Paymentintent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: 'inr'
        })

        return res.status(200).json({
            success: true,
            clientSecret: Paymentintent.client_secret
        })
    } catch (error) {
        next(error)
    }
}

export const newCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const mainUser = await User.findById((req as any).data.id).select("role");

        if (mainUser!.role == "admin") {
             const { coupon, amount } = req.body;

        if (!coupon) return next(new ErrorHandler("Coupon Code is needed!", 400))
        if (!amount) return next(new ErrorHandler("Amount is needed!", 400))

        const newCoupon = await Coupon.create({
            coupon,
            amount
        });

        return res.status(201).json({
            success: true,
            message: `Coupon code is '${coupon}' is created`
        })
        }else{
            next(new ErrorHandler("Admin is not awailable", 400))
        }
       
    } catch (error) {
        next(error);
    }

}

export const allCouponCode = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const mainUser = await User.findById((req as any).data.id).select("role");

        if (mainUser!.role === "admin") {
            const allCoupon = await Coupon.find().select("coupon").select("amount")

            res.status(201).json({
                success: true,
                data: allCoupon,
            })

        } else {
            next(new ErrorHandler("Sorry Your are Not Admin", 400))
        }
    } catch (error) {
        next(error);
    }
}

export const discount = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {

        const { code } = req.query;
        const discount = await Coupon.findOne({ coupon: code }).select("amount");

        if (!discount) return next(new ErrorHandler("Bad Request", 400));

        res.status(201).json({
            success: true,
            amount: discount.amount
        })

    } catch (error) {
        next(error);
    }
}

export const deleteCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const mainUser = await User.findById((req as any).data.id).select("role");

        if (mainUser!.role == "admin") {
            const couponId = req.params.id;
            const coupon = await Coupon.findByIdAndDelete(couponId);

            if (!coupon) return next(new ErrorHandler("Bad Request", 400))

            return res.status(201).json({
                success: true,
                message: `Coupon code ${coupon.coupon} has been Deleted Successfully`
            });
        } else {
            next(new ErrorHandler("Admin is not awailable", 400))
        }

    } catch (error) {
        next(error);
    }
}

