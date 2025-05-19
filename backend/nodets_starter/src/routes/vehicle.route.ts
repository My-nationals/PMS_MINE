import express, { RequestHandler } from "express";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import requestController from "../controllers/request.controller";
import vehicleController from "../controllers/vehicleController";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateVehicleDto } from "../dtos/vehicle.dto";

const vehicleRouter = express.Router();

// Must be logged in for all routes below
vehicleRouter.use(checkLoggedIn);

// Accessible to all logged-in users

vehicleRouter.post(
    "/",
    validationMiddleware(CreateVehicleDto),
    vehicleController.createVehicle
);
// Admin-only routes

vehicleRouter.get("/", vehicleController.getMyVehicles);
vehicleRouter.put("/:vehicleId", vehicleController.updateVehicle);
vehicleRouter.delete("/:vehicleId", vehicleController.deleteVehicle);

export default vehicleRouter;
