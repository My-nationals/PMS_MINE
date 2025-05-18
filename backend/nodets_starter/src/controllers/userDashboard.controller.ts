import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

const getUserDashboard: any = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    try {
        // Recent parking requests (limit 5)
        const recentRequests = await prisma.parkingRequest.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        // Pending request
        const pendingRequest = await prisma.parkingRequest.findFirst({
            where: {
                userId,
                status: "PENDING",
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // If the user has a pending request and an assigned slot
        let pendingSlot = null;
        if (pendingRequest) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    assignedSlot: true,
                },
            });

            if (user?.assignedSlot) {
                pendingSlot = {
                    code: user.assignedSlot.code,
                    description: user.assignedSlot.description,
                };
            }
        }

        return res.json({
            recentRequests,
            pendingRequest, // ✅ Include this
            pendingSlot,
        })
    } catch (error: any) {
        return res.status(500).json({
            error: "Failed to fetch user dashboard data",
            details: error.message,
        });
    }
};

const userDashboardControllers = {
    getUserDashboard,
};

export default userDashboardControllers;
