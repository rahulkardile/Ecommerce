import { Router } from "express"
import { allCouponCode, createPayment, deleteCoupon, discount, newCoupon } from "../controllers/PaymentController.js";
import { adminOnly } from "../middleware/auth.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

// /api/payment/create
router.post("/create", createPayment);

// get Discount
router.get("/coupon/discount", discount);

// /api/payment/coupon/all
router.get("/coupon/all/:id", verifyToken, allCouponCode);

// /api/payment/coupon/new
router.post("/coupon/new", adminOnly, newCoupon);

// delete coupon
router.delete("/coupon/delete/:id", adminOnly, deleteCoupon);

export default router;
