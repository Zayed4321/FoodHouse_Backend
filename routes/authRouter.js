import express from "express";
import { allUserData, forgotPassController, getAllOrderController, getOrderController, loginUser, orderStatusController, updateController, userRegister } from "../controller/authController.js";
import { adminCheck, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// http://localhost:5000/api/v1/users/addUser
router.post("/addUser", userRegister);

// http://localhost:5000/api/v1/users/allUsers
router.get("/allUsers", requireSignIn, adminCheck, allUserData);

// http://localhost:5000/api/v1/users/userLogin
router.post("/userLogin", loginUser);

// http://localhost:5000/api/v1/users/forgot-pass
router.post("/forgot-pass", forgotPassController);

// The purpose of this route is to protect private routes

// http://localhost:5000/api/v1/users/user-auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

// The prupose of this route will be to take to the admin to private admin route

// http://localhost:5000/api/v1/users/admin-auth
router.get("/admin-auth", requireSignIn, adminCheck, (req, res) => {
    res.status(200).send({ ok: true });
});

// http://localhost:5000/api/v1/users/profile-update
router.put("/profile-update", requireSignIn, updateController);

// http://localhost:5000/api/v1/users/orders
router.get("/orders", requireSignIn, getOrderController);

// http://localhost:5000/api/v1/users/all-orders
router.get("/all-orders", requireSignIn, adminCheck, getAllOrderController);

// http://localhost:5000/api/v1/users/order-status/:orderId
router.put("/order-status/:orderId", requireSignIn, adminCheck, orderStatusController);


export default router;