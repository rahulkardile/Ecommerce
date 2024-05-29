import { NextFunction, Request, Response } from "express";

// user types
export interface NewUserRequestBody {
    name: string;
    email: string;
    google: string;
    photo: string;
    role: string;
    gender: string;
    dob: Date;
    _id: string;
}

export interface NewManualUser {
    name: string;
    email: string;
    gender: string;
    dob: Date;
    password: string;
}

export interface NewManualUserLogin {
    email: string;
    password: string;
}

// products types
export interface NewProductRequestBody {
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

// search query types
export type searchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
}

// cache types
export type InvalidateCacheType = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string;
}

// order types

export type OrderItemTypes = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
}

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pin: number;

}

export interface NewOrderRequestBody {
    shippingInfo: ShippingInfoType;
    user: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number,
    orderItems: OrderItemTypes[];
}

export interface orderInfo {

}


export interface baseInterface {
    name?: {
        $regex: string,
        $options: "i"
    },
    price?: {
        $lte: number
    },
    category?: string

}

export interface destructureDoc {
    _id: string,
    name: string,
    email: string,
    google: string,
    password: string,
    photo: string,
    role: string,
    dob: string,
    gender: string,
    createdAt: string,
    updatedAt: string,
    __v: string,
}