// hooks/useAdminDashboard.ts
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api"; // your axios instance

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["adminDashboard"],
        queryFn: async () => {
            const res = await API.get("/admin/dashboard");
            return res.data;
        },
    });
};
