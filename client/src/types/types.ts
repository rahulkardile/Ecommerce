import { NewOrderReq } from "./ReduxType";

export interface User {
  name: string;
  email: string;
  google?: string;
  photo?: string;
  gender?: string;
  dob?: string;
  role?: string;
}

export type err = {
  status: number;
  data: {
    message: string;
    statusCode: number;
  };
};

export type messageRes = {
  success: boolean;
  message: string;
  user: User;
};

export type OrderRes = {
  success: boolean;
  data: NewOrderReq
};

export interface Product {
  _id: string;
  name: string;
  description: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type LatestProductsRes = {
  success: boolean;
  Product: Product[];
};

export type UpdateProductsRes = {
  productId: string;
  formData: FormData;
};

export type GetProductsRes = {
  success: boolean;
  Product: Product;
};

export type DeleteProducts = {
  ProductId: string;
};

export type categoryRes = {
  success: boolean;
  category: string[];
};

export type SearchProductRes = {
  success: boolean;
  products: Product[];
  totalPage: number;
};

export type SearchProductQuery = {
  search?: string;
  price?: number;
  category?: string;
  sort?: string;
  page?: number
};

export  type NewProductReq = {
  formData: FormData;
}
