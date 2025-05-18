// routes/slot.routes.ts
import express, { RequestHandler } from "express";
import { slotController } from "../controllers/slot.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateSlotDto, UpdateSlotDto } from "../dtos/slot.dto";
import slotRequestsController from "../controllers/request.controller";
const slotRouter = express.Router();

slotRouter.use(checkLoggedIn)
slotRouter.get("/available", slotController.getAvailableSlots as unknown as RequestHandler); // ✅ this route

slotRouter.use(checkAdmin)

// Admin Slot Routes
slotRouter.post(
    "/",
    validationMiddleware(CreateSlotDto),
    slotController.createSlot
); // Create slot
slotRouter.get("/search/:query",validationMiddleware(UpdateSlotDto), slotController.searchSlot);
slotRouter.patch("/slots/:id/assign", slotController.assignSlot);
slotRouter.patch("/deassign/:id", checkAdmin, slotController.deassignSlot);
slotRouter.patch("/:id", slotController.updateById);
slotRouter.delete("/:id", slotController.deleteById); // Delete slot
slotRouter.get("/", slotController.all); // Get all slots


export default slotRouter;
