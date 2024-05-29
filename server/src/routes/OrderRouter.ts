import express from "express"
import { allOrders, deleteOrder, getOrder, MyOrders, newOrder, processOrder, update } from "../controllers/OrderController.js";
import { adminOnly } from "../middleware/auth.js";
import { verifyToken } from "../utils/verifyUser.js";

const routes = express.Router();

// /api/order/get?id=adminid
routes.get("/get", verifyToken, allOrders);

// order by user id from query
// /api/order/myorders?id=userid
routes.get("/myorders", verifyToken, MyOrders);

// get a order with is id and detail
// /api/order/orderid
routes.get("/:id",verifyToken, getOrder);

// create new order
//  /api/order/new
routes.post("/new", verifyToken, newOrder)

// delete order
// /api/order/delete/orderid
routes.delete("/delete/:id", deleteOrder);

// update the order
// /api/order/update/orderid
routes.patch("/update/:id", processOrder);

export default routes;

