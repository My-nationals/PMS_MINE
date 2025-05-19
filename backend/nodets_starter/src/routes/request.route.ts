// routes/slot.routes.ts
import express, { RequestHandler } from "express";
import parkingRequestController from "../controllers/request.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
// import slotRequestsController from "../controllers/request.controller";
const requestRouter = express.Router();

requestRouter.use(checkLoggedIn);
requestRouter.post(
    "/request/:vehicleId",
    parkingRequestController.createParkingRequestHandler
);
requestRouter.get(
    "/my-requests",
    parkingRequestController.getMyRequestsHandler as unknown as RequestHandler
);


requestRouter.use(checkAdmin);
requestRouter.patch(
    "/request/:requestId/accept",
    parkingRequestController.acceptRequestHandler
);
requestRouter.get(
    "/",
    parkingRequestController.getAllRequestsHandler as unknown as RequestHandler
);
requestRouter.patch(
    "/request/:requestId/reject",
    parkingRequestController.rejectRequestHandler
);




export default requestRouter;
