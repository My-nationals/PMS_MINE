// routes/slot.routes.ts
import express, { RequestHandler } from "express";
import  requestController  from "../controllers/request.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
// import slotRequestsController from "../controllers/request.controller";
const requestRouter = express.Router();

requestRouter.use(checkLoggedIn);
requestRouter.post(
    "/request/:slotId",
    requestController.requestSlotHandler
);

requestRouter.use(checkAdmin);

// Admin Slot Routes

requestRouter.patch("/request/:requestId/accept", requestController.acceptRequestHandler);
requestRouter.get(
    "/",
    requestController.getAllRequestsHandler as unknown as RequestHandler
);
requestRouter.patch("/request/:requestId/reject", requestController.rejectRequestHandler);



export default requestRouter;
