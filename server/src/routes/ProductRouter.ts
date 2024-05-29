import express from "express";
import {
    AllCategory,
    NewProduct,
    all,
    deleteProduct,
    latestProduct,
    productDetail,
    searchQuery,
    updateProduct
}
    from "../controllers/ProductController.js";
import { singleUpload } from "../middleware/multer.js";
import { adminOnly } from "../middleware/auth.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();



// to create new product from begging
router.post("/new", verifyToken, singleUpload, NewProduct);

// the searching route
router.get("/get", searchQuery)

// to get lastest products
router.get("/latest", latestProduct);

// to get get all available categoryes
router.get("/category", AllCategory);

// to get all products
router.get("/all", verifyToken, all)

// get single product (get), delete single product (delete), update Single product  (put)
router
    .route("/:id")
    .get(productDetail)
    .delete(verifyToken, deleteProduct)
    .put(singleUpload, verifyToken, updateProduct)

export default router;