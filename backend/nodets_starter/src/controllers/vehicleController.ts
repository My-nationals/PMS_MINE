import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

// CREATE Vehicle
const createVehicle:any = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const { plate, type, color, model } = req.body;

    try {
        const vehicle = await prisma.vehicle.create({
            data: {
                plate,
                type,
                color,
                model,
                userId,
            },
        });
        res.status(201).json(vehicle);
    } catch (error) {
        console.error("Create Vehicle Error:", error);
        res.status(500).json({ message: "Error creating vehicle", error });
    }
};

// READ all vehicles of current user
const getMyVehicles: any = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { userId },
        });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error("Get Vehicles Error:", error);
        res.status(500).json({ message: "Error fetching vehicles", error });
    }
};

// UPDATE Vehicle
const updateVehicle: any = async (req: AuthRequest, res: Response) => {
    const { vehicleId } = req.params;
    const { plate, type, color, model } = req.body;

    try {
        const vehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: { plate, type, color, model },
        });
        res.status(200).json(vehicle);
    } catch (error) {
        console.error("Update Vehicle Error:", error);
        res.status(500).json({ message: "Error updating vehicle", error });
    }
};

// DELETE Vehicle
const deleteVehicle: any = async (req: AuthRequest, res: Response) => {
    const { vehicleId } = req.params;

    try {
        await prisma.vehicle.delete({ where: { id: vehicleId } });
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Delete Vehicle Error:", error);
        res.status(500).json({ message: "Error deleting vehicle", error });
    }
};

const vehicleController = {
    createVehicle,
    getMyVehicles,
    updateVehicle,
    deleteVehicle,
};

export default vehicleController;
