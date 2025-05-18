import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const requestSlotHandler: any = async (req: AuthRequest, res: Response) => {
    const { slotId } = req.params;
    const userId = req.user.id;

    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.occupied)
        return res.status(400).json({ message: "Slot already occupied" });

    const existingRequest = await prisma.parkingRequest.findFirst({
        where: { userId, status: "PENDING" },
    });
    if (existingRequest)
        return res
            .status(400)
            .json({ message: "You already have a pending request" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.assignedSlotId)
        return res
            .status(400)
            .json({ message: "You already have an assigned slot" });

    const request = await prisma.parkingRequest.create({
        data: {
            userId,
            status: "PENDING",
            slotId, // ✅ Save slotId in the request
        },
    });

    return res.status(201).json({ message: "Request submitted", request });
};


const getAllRequestsHandler = async (req: AuthRequest, res: Response) => {
    const adminUser = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (adminUser?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }

    const requests = await prisma.parkingRequest.findMany({
        include: {
            user: true,
            slot: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return res.json({ requests });
};





const acceptRequestHandler: any = async (req: AuthRequest, res: Response) => {
  const adminUser = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (adminUser?.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

  const requestId = req.params.requestId; // changed from Number()

  const request = await prisma.parkingRequest.findUnique({ where: { id: requestId } });
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "PENDING") return res.status(400).json({ message: "Request already handled" });

  const availableSlot = await prisma.slot.findFirst({ where: { occupied: false } });
  if (!availableSlot) return res.status(400).json({ message: "No available slots" });

  await prisma.user.update({
    where: { id: request.userId },
    data: {
      assignedSlotId: availableSlot.id,
    },
  });

  await prisma.slot.update({
    where: { id: availableSlot.id },
    data: { occupied: true },
  });

  const updatedRequest = await prisma.parkingRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });

  return res.json({ message: "Request approved", request: updatedRequest });
};

const rejectRequestHandler: any = async (req: AuthRequest, res: Response) => {
    const adminUser = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (adminUser?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }

    const requestId = req.params.requestId;

    const request = await prisma.parkingRequest.findUnique({
        where: { id: requestId },
        include: {
            user: {
                select: {
                    id: true,
                    assignedSlotId: true, // ✅ Ensure we get the slot assigned to the user
                },
            },
        },
    });

    if (!request) {
        return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "PENDING") {
        return res.status(400).json({ message: "Request already handled" });
    }

    const assignedSlotId = request.user.assignedSlotId;

    // ✅ If user has a slot assigned, remove it and mark the slot unoccupied
    if (assignedSlotId) {
        await prisma.user.update({
            where: { id: request.user.id },
            data: { assignedSlotId: null },
        });

        await prisma.slot.update({
            where: { id: assignedSlotId },
            data: { occupied: false },
        });
    }

    // ✅ Update the request status to DENIED
    const rejected = await prisma.parkingRequest.update({
        where: { id: requestId },
        data: { status: "DENIED" },
    });

    return res.json({ message: "Request rejected", request: rejected });
};



const slotRequestsController = {
    requestSlotHandler,
    getAllRequestsHandler,
    acceptRequestHandler,
    rejectRequestHandler
}

export default slotRequestsController;

