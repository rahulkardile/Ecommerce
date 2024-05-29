import express from "express";
import { Google, all, deleteUser, getUser, isLogin, logoutUser, newUser, userManualLogin } from "../controllers/userController.js";
import { adminOnly } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/new", newUser);

router.post("/login", userManualLogin);

router.post("/google", Google);

router.get("/is-login", verifyToken, isLogin)

router.get("/all", verifyToken, all)

router.get("/logout", verifyToken, logoutUser)

router.route("/:id").get(getUser).delete( verifyToken, deleteUser);




export default router;