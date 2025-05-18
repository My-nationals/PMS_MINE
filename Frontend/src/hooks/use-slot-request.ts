import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export function useSlotRequestActions() {
    const queryClient = useQueryClient();

    const approve = useMutation({
        mutationFn: async (requestId: string) => {
            const res = await api.patch(
                `/requests/request/${requestId}/accept`
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Request approved");
            queryClient.invalidateQueries({ queryKey: ["slot-requests"] });
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message || "Failed to approve request"
            );
        },
    });

    const reject = useMutation({
        mutationFn: async (requestId: string) => {
            const res = await api.patch(
                `/requests/request/${requestId}/reject`
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Request rejected");
            queryClient.invalidateQueries({ queryKey: ["slot-requests"] });
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message || "Failed to reject request"
            );
        },
    });

    return {
        approveRequest: approve.mutateAsync,
        rejectRequest: reject.mutateAsync,
        isApproving: approve.isPending,
        isRejecting: reject.isPending,
    };
}
