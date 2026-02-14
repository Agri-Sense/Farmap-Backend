import express from "express";
import { getProfileData, updateProfile, deleteUserAccount, createOrder, getOrder, changeStatus, deleteOrder } from "../controllers/user/index.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import checkRoles from "../middlewares/checkRoles.middleware.js";

const userRouter = express.Router();

userRouter.use(isLoggedIn);
userRouter.use(checkRoles.isUser);

userRouter
    .get("/profile", getProfileData)
    .put("/profile", updateProfile)
    .delete("/delete", deleteUserAccount)
    .post("/create-order", createOrder)
    .get("/get-order", getOrder)
    .post("/change-status", changeStatus)
    .delete("/delete-order", deleteOrder)

export default userRouter;
