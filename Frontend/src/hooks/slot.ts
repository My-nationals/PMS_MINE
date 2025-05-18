import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";

interface Slot {
    id?: string;
    code: string;
    occupied: boolean;
    description?: string;
}

export const useSlotMutations = () => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    // ✅ Create slot
    const createSlotMutation = useMutation({
        mutationFn: async (data: Slot) => {
            const res = await api.post("/slots", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "Error creating slot");
        },
    });

    // ✅ Delete slot
    const deleteSlotMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/slots/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "Error deleting slot");
        },
    });

    // ✅ Update slot
    const updateSlotMutation = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<Slot>;
        }) => {
            console.log("Updating slot", id, data);
            const res = await api.patch(`/slots/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "Error updating slot");
        },
    });

    // ✅ Fetch available slots (for users to request)
    const availableSlotsQuery = useQuery({
        queryKey: ["available-slots"],
        queryFn: async () => {
            const res = await api.get("/requests/available");
            return res.data.slots;
        },
    });

    return {
        createSlot: createSlotMutation.mutateAsync,
        deleteSlot: deleteSlotMutation.mutateAsync,
        updateSlot: updateSlotMutation.mutateAsync,
        loading: {
            create: createSlotMutation.isPending,
            update: updateSlotMutation.isPending,
            delete: deleteSlotMutation.isPending,
            available: availableSlotsQuery.isLoading,
        },
        availableSlots: availableSlotsQuery.data || [],
        availableError: availableSlotsQuery.error,
        error,
    };
};
