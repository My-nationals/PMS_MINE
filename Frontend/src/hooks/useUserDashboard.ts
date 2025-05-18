// hooks/useUserDashboard.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getCookie } from "@/utils/cookie";

// Type definitions
export type RecentRequest = {
    id: string;
    createdAt: string;
    status: string;
};

export type PendingRequest = {
    id: string;
    createdAt: string;
    status: string;
};

export type PendingSlot = {
    code: string;
    description: string;
};

export type UserDashboardResponse = {
    recentRequests: RecentRequest[];
    pendingRequest: PendingRequest | null;
    pendingSlot: PendingSlot | null;
};

export const useUserDashboard = () => {
    const token =
        typeof window !== "undefined" ? getCookie("auth_token") : null;

    return useQuery({
        queryKey: ["userDashboard"],
        queryFn: async () => {
            const res = await api.get("/dashboard/user");
            console.log("📦 Data from API in hook:", res.data);
            return res.data;
        },
        enabled: !!token, // only run when token is available
    });
};
  

// Query hook
// export const useUserDashboard = () =>
//     useQuery<UserDashboardResponse, AxiosError>({
//         queryKey: ["user-dashboard"],
//         queryFn: async () => {
//             const res = await api.get("/dashboard/user");
//             return res.data;
//         },
//     });
