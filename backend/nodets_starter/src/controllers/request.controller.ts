import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Create parking request (per vehicle)
const createParkingRequestHandler: any = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user.id;
    const vehicleId = req.params.vehicleId;

    if (!vehicleId) {
        return res.status(400).json({ error: "Vehicle ID is required" });
    }

    const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
    });

    if (!vehicle || vehicle.userId !== userId) {
        return res.status(403).json({ message: "You don't own this vehicle" });
    }

    const existingRequest = await prisma.parkingRequest.findFirst({
        where: {
            userId,
            vehicleId,
            status: "PENDING",
        },
    });

    if (existingRequest) {
        return res.status(400).json({
            message: "You already have a pending request for this vehicle",
        });
    }

    const request = await prisma.parkingRequest.create({
        data: {
            userId,
            vehicleId,
            status: "PENDING",
            entryTime: new Date(), // ✅ Set entry time to now
            exitTime: null, // ✅ Set exit time as null (to be updated on exit)
        },
    });

    return res.status(201).json({
        message: "Parking request submitted",
        request,
    });
};

// 2. Admin accepts request & system assigns random slot
const acceptRequestHandler:any = async (req: AuthRequest, res: Response) => {
    const admin = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (admin?.role !== "ADMIN")
        return res.status(403).json({ message: "Forbidden" });

    const requestId = req.params.requestId;
    const request = await prisma.parkingRequest.findUnique({
        where: { id: requestId },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "PENDING")
        return res.status(400).json({ message: "Request already handled" });

    // ✅ Find random available slot
    const availableSlot = await prisma.slot.findFirst({
        where: { occupied: false },
    });
    if (!availableSlot)
        return res.status(400).json({ message: "No available slots" });

    // ✅ Assign slot to user
    await prisma.user.update({
        where: { id: request.userId },
        data: { assignedSlotId: availableSlot.id },
    });

    await prisma.slot.update({
        where: { id: availableSlot.id },
        data: { occupied: true },
    });

    const updatedRequest = await prisma.parkingRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
    });

    return res.json({
        message: "Request approved and slot assigned",
        request: updatedRequest,
    });
};

// 3. Admin rejects request
const rejectRequestHandler:any = async (req: AuthRequest, res: Response) => {
    const admin = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (admin?.role !== "ADMIN")
        return res.status(403).json({ message: "Forbidden" });

    const requestId = req.params.requestId;

    const request = await prisma.parkingRequest.findUnique({
        where: { id: requestId },
        include: {
            user: {
                select: { assignedSlotId: true },
            },
        },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "PENDING")
        return res.status(400).json({ message: "Request already handled" });

    // Optionally: clear user’s assigned slot if necessary
    if (request.user.assignedSlotId) {
        await prisma.slot.update({
            where: { id: request.user.assignedSlotId },
            data: { occupied: false },
        });
        await prisma.user.update({
            where: { id: request.userId },
            data: { assignedSlotId: null },
        });
    }

    const rejected = await prisma.parkingRequest.update({
        where: { id: requestId },
        data: { status: "DENIED" },
    });

    return res.json({ message: "Request rejected", request: rejected });
};

// 4. Get all requests
const getAllRequestsHandler:any = async (req: AuthRequest, res: Response) => {
    const adminUser = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (adminUser?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }

    const requests = await prisma.parkingRequest.findMany({
        include: {
            user: true,
            vehicle: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return res.json({ requests });
};

const getMyRequestsHandler:any = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    const requests = await prisma.parkingRequest.findMany({
        where: { userId },
        include: {
            slot: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return res.json({ requests });
};

const parkingRequestController = {
    createParkingRequestHandler,
    acceptRequestHandler,
    rejectRequestHandler,
    getAllRequestsHandler,
    getMyRequestsHandler,
    
    
};

export default parkingRequestController;
