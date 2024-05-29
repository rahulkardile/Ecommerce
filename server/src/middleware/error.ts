import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types.js";


export const TryCatch = (func: ControllerType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(func(req, res, next)).catch(next);
    }
}
