import prisma from "../../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { Request, Response } from "express";

// Create a slot
async function createSlot(req: Request, res: Response) {
    try {
        const {
            code,
            occupied,
            description,
        }: { code: string; occupied: boolean; description?: string } = req.body;

        if (!code) {
            return ServerResponse.error(res, "Code is required");
        }

        const slot = await prisma.slot.create({
            data: {
                code,
                occupied,
                description,
            },
        });

        return ServerResponse.created(res, "Slot created successfully", {
            slot,
        });
    } catch (error) {
        return ServerResponse.error(res, "Error occurred while creating slot", {
            error,
        });
    }
}

// Get all slots
async function all(req: Request, res: Response) {
    try {
        const slots = await prisma.slot.findMany({});
        return ServerResponse.success(res, "Slots fetched successfully", {
            slots,
        });
    } catch (error) {
        return ServerResponse.error(
            res,
            "Error occurred while fetching slots",
            { error }
        );
    }
}

// Get slot by ID
async function getById(req: Request, res: Response) {
    try {
        const slot = await prisma.slot.findUnique({
            where: { id: req.params.id },
        });

        if (!slot) {
            return ServerResponse.error(res, "Slot not found");
        }

        return ServerResponse.success(res, "Slot fetched successfully", {
            slot,
        });
    } catch (error) {
        return ServerResponse.error(res, "Error occurred while fetching slot", {
            error,
        });
    }
}

// controller
export const getAvailableSlots = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        // Get IDs of slots that already have a pending request
        const requestedSlotIds = await prisma.parkingRequest.findMany({
            where: { status: "PENDING" },
            select: { slotId: true },
        });

        const excludedSlotIds = requestedSlotIds
            .map((r) => r.slotId)
            .filter((id): id is string => id !== null); // ensure no nulls

        const slots = await prisma.slot.findMany({
            where: {
                occupied: false,
                id: {
                    notIn: excludedSlotIds,
                },
            },
        });

        res.json({ slots });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ message: "Failed to fetch available slots" });
    }
};
  

// Delete slot by ID
async function deleteById(req: Request, res: Response) {
    try {
        const slot = await prisma.slot.delete({
            where: { id: req.params.id },
        });

        return ServerResponse.success(res, "Slot deleted successfully", {
            slot,
        });
    } catch (error) {
        return ServerResponse.error(res, "Error occurred while deleting slot", {
            error,
        });
    }
}

// Assign slot to user
async function assignSlot(req: Request, res: Response) {
    try {
        const { userId } = req.body;
        const slotId = req.params.id;

        if (!userId) {
            return ServerResponse.error(res, "User ID is required");
        }

        const updatedSlot = await prisma.slot.update({
            where: { id: slotId },
            data: {
                user: {
                    connect: { id: userId },
                },
                occupied: true,
            },
            include: { user: true },
        });

        return ServerResponse.success(
            res,
            "Slot assigned to user successfully",
            {
                slot: updatedSlot,
            }
        );
    } catch (error) {
        return ServerResponse.error(
            res,
            "Error occurred while assigning slot",
            { error }
        );
    }
}



// Deassign slot from user by slot ID
async function deassignSlot(req: Request, res: Response) {
    try {
      const slotId = req.params.id;
  
      // Check if slot exists and is currently assigned
      const slot = await prisma.slot.findUnique({
        where: { id: slotId },
        include: { user: true },
      });
  
      if (!slot) {
        return ServerResponse.error(res, "Slot not found");
      }
  
      if (!slot.user) {
        return ServerResponse.error(res, "Slot is not currently assigned to any user");
      }
  
      const updatedSlot = await prisma.slot.update({
        where: { id: slotId },
        data: {
          user: {
            disconnect: true,
          },
          occupied: false,
        },
      });
  
      return ServerResponse.success(res, "Slot deassigned successfully", {
        slot: updatedSlot,
      });
    } catch (error) {
      return ServerResponse.error(res, "Error occurred while deassigning slot", {
        error,
      });
    }
  }

  // Update slot by ID
  async function updateById(req: Request, res: Response) {
      try {
          const slotId = req.params.id;
          const {
              code,
              occupied,
              description,
          }: { code?: string; occupied?: boolean; description?: string } =
              req.body;

          // Check if the slot exists
          const existingSlot = await prisma.slot.findUnique({
              where: { id: slotId },
          });

          if (!existingSlot) {
              return ServerResponse.error(res, "Slot not found");
          }

          // ✅ If new code is provided, ensure it's not already taken by another slot
          if (code) {
              const duplicate = await prisma.slot.findFirst({
                  where: {
                      code,
                      NOT: { id: slotId },
                  },
              });

              if (duplicate) {
                  return ServerResponse.error(
                      res,
                      "Slot code already exists",
                      400
                  );
              }
          }

          const updatedSlot = await prisma.slot.update({
              where: { id: slotId },
              data: {
                  ...(code !== undefined && { code }),
                  ...(occupied !== undefined && { occupied }),
                  ...(description !== undefined && { description }),
              },
          });

          return ServerResponse.success(res, "Slot updated successfully", {
              slot: updatedSlot,
          });
      } catch (error) {
          return ServerResponse.error(
              res,
              "Error occurred while updating slot",
              {
                  error,
              }
          );
      }
  }


  
// Search slots by code
async function searchSlot(req: Request, res: Response) {
    try {
        const { query } = req.params;

        const slots = await prisma.slot.findMany({
            where: {
                code: {
                    contains: query,
                    mode: "insensitive",
                },
            },
        });

        return ServerResponse.success(res, "Slots fetched successfully", {
            slots,
        });
    } catch (error) {
        return ServerResponse.error(
            res,
            "Error occurred while searching slots",
            { error }
        );
    }
}

// Grouped controller export
const slotController = {
    createSlot,
    all,
    getById,
    getAvailableSlots,
    deleteById,
    searchSlot,
    assignSlot,
    deassignSlot,
    updateById,
};

export { slotController };
