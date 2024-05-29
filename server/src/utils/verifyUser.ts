import jwt from "jsonwebtoken";
import ErrorHandler from "./Error-class.js";
import { NextFunction, Request, Response } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = (req as any).cookies.access_token;

    if(!token) return next(new ErrorHandler('Login is needed cookie is missing!', 401));

    jwt.verify(token, String(process.env.JWT_SECRET), (err: any, data: any) => {
        if (err) {
            next(new ErrorHandler("Bad Cookie", 400))
        } else {
            (req as any).data = data
            next();
        }
    })
}
