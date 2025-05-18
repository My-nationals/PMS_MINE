import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SlotRequestTable } from "@/components/common/SlotRequestTable";

export default function RequestPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["slot-requests"],
        queryFn: async () => {
            const res = await api.get("/requests");
            return res.data.requests;
        },
    });

    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (error)
        return <div className="text-red-500">Error loading requests</div>;

    return <SlotRequestTable data={data} />;
}
