import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import slotRouter from "./slot.routes"
import requestRouter from "./request.route"
import userDashboardRouter from "./userDashboard.route";
import adminDashboardRouter from "./admin_dashboard.route";
import vehicleRouter from "./vehicle.route";

const router = Router()

router.use("/auth", authRouter
    /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)

router.use(
    "/dashboard",
    userDashboardRouter

    /*
        #swagger.tags = ['user-dashboard']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/user", userRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use(
    "/slots",
    slotRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use(
    "/requests",
    requestRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);


router.use(
    "/admin",
    adminDashboardRouter
    /*
        #swagger.tags = ['admin-dashboard']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
    "/vehicles",
    vehicleRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);




export default router