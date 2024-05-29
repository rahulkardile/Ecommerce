import { NextFunction, Request, Response } from "express";
import { User } from "../models/UserModels.js";
import ErrorHandler from "../utils/Error-class.js";

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
    
        const { id } = req.query;
        if(!id) return next(new ErrorHandler("Login Needed", 401))

        const user = await User.findById(id);
        if(!user) return next(new ErrorHandler("Wrong Id", 401));

        if(user.role !== "admin") return next(new ErrorHandler("Bad Request!!", 400))

        next();

    } catch (error) {
        next(error)
    }
}

