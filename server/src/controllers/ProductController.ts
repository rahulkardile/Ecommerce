import { NextFunction, Request, Response } from "express";
import {
  NewProductRequestBody,
  baseInterface,
  searchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/ProductModel.js";
import ErrorHandler from "../utils/Error-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { InvalidateCache } from "../middleware/features.js";

export const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let allproduct;

    const role = await (req as any).data.role;

    if (role !== "admin")
      return next(new ErrorHandler("User is Not Admin", 400));

    if (myCache.has("allProductCache")) {
      allproduct = JSON.parse(myCache.get("allProductCache") as string);
    } else {
      allproduct = await Product.find();
      myCache.set("allProductCache", JSON.stringify(allproduct));
    }
    res.status(200).json({
      success: true,
      Product: allproduct,
    });
  } catch (error) {
    next(error);
  }
};

export const latestProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products;
    if (myCache.has("latest-product"))
      products = JSON.parse(myCache.get("latest-product") as string);
    else {
      const products = await Product.find().sort({ createdAt: -1 }).limit(10);
      myCache.set("latest-product", JSON.stringify(products));
    }

    res.status(200).json({
      success: true,
      Product: products,
    });
  } catch (error) {
    next(error);
  }
};

export const AllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let category;

    if (myCache.has("category"))
      category = JSON.parse(myCache.get("category") as string);
    else {
      category = await Product.distinct("category");
      myCache.set("category", JSON.stringify(category));
    }

    res.status(200).json({
      success: true,
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

export const productDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let product;

    if (myCache.has(`product-${id}`)) {
      product = JSON.parse(myCache.get(`product-${id}`) as string);
    } else {
      if (!id) return next(new ErrorHandler("Id Is Needed!", 400));
      product = await Product.findById(id);
      if (!product) return next(new ErrorHandler("Product Not Found", 404));

      myCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
      success: true,
      Product: product,
    });
  } catch (error) {
    next(error);
  }
};

export const NewProduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).data.id;
    const { name, price, stock, category, description } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("photo is needed!", 400));

    if (!name || !price || !stock || !category || !description) {
      rm(photo.path, () => {
        null;
      });
      return next(new ErrorHandler("Something is missing", 401));
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo?.path,
      Owner: user,
    });

    await InvalidateCache({ product: true, admin: true });

    res.status(200).json({
      success: true,
      message: `Product Created ${name}`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: owenerId, role } = (req as any).data;

    const { id } = req.params;
    const { name, price, stock, category, description } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    if (owenerId === product.Owner || role === "admin") {
      if (photo) {
        rm(product.photo!, () => {
          console.log("old photo is deleted");
        });

        product.photo = photo.path;
      }

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (stock) product.stock = stock;
      if (category) product.category = category;

      await product.save();

      await InvalidateCache({
        product: true,
        productId: String(id),
        admin: true,
      });

      return res.status(200).json("product has been updated");
    } else return next(new ErrorHandler("Bad Request!", 400));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: owenerId, role } = (req as any).data;

    const { id } = req.params;
    if (!id) return next(new ErrorHandler("Id Is Needed!", 400));

    const deleteProduct = await Product.findById(id);

    if (!deleteProduct) return next(new ErrorHandler("Product not found", 404));

    if (deleteProduct.Owner === owenerId || role === "admin") {
      rm(deleteProduct.photo, () => {
        console.log("Product photo is deleted");
      });

      await Product.findOneAndDelete(deleteProduct._id);
      await InvalidateCache({ product: true, productId: id, admin: true });

      res.status(200).json("Product has been deleted");
    } else {
      res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const searchQuery = async (
  req: Request<{}, {}, {}, searchRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, price, category, sort } = req.query;
    const page = Number(req.query.page);
    const limit = Number(process.env.LIMIT_SEARCH) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: baseInterface = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    if (category) baseQuery.category = category;

    const products = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [get, totalpage] = await Promise.all([
      products,
      Product.find(baseQuery),
    ]);

    const allProNum = Math.ceil(totalpage.length / limit);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      products: get,
      totalpages: allProNum,
    });
  } catch (error) {
    next(error);
  }
};

// const generateProduct = async (count: number) =>{
//     const products = [];

//     for(let i = 0; i < count; i++ ){
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "uploads\\1705999494709_f8886adf-0327-44d6-a732-25911bb7998d_Motorola-Edge-40-Neo.jpg",
//             price: faker.commerce.price({min: 400, max: 100000}),
//             stock: faker.commerce.price({min: 10, max: 800}),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v: 0
//         }
//         products.push(product);
//         console.log(product);
//     }
//     await Product.create(products);
//     console.log("Successfully created");
// }

// const deleteProduct1 = async (count: number) => {
//     const products = await Product.find();
//     for (let i = 0; i < products.length; i++) {
//         const product = products[i];
//         await product.deleteOne();
//     }

//     console.log("deleted");
// }

// deleteProduct1(30);
