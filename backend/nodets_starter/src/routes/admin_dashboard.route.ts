import express from "express";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import adminDashboardControllers from "../controllers/adminDashboard";

const adminDashboardRouter = express.Router();

adminDashboardRouter.use(checkLoggedIn);
adminDashboardRouter.use(checkAdmin);
adminDashboardRouter.get(
    "/dashboard",
    adminDashboardControllers.getAdminDashboard
);

export default adminDashboardRouter;
