import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAdminDashboard = async (_req: Request, res: Response) => {
    try {
        const [totalSlots, totalRequests, occupiedSlots, availableSlots] =
            await Promise.all([
                prisma.slot.count(),
                prisma.parkingRequest.count(),
                prisma.slot.count({ where: { occupied: true } }),
                prisma.slot.count({ where: { occupied: false } }),
            ]);

        return res.json({
            totalSlots,
            totalRequests,
            occupiedSlots,
            availableSlots,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: "Failed to fetch admin dashboard data",
            details: error.message,
        });
    }
};

const adminDashboardControllers = {
    getAdminDashboard,
};

export default adminDashboardControllers;
