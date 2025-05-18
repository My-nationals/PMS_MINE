import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ParkingSlotTable } from "@/components/common/data-table";

function Slots() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["user-available-slots"],
        queryFn: async () => {
            const res = await api.get("/slots/available");
            return res.data.slots;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading slots</div>;

    return <ParkingSlotTable role="user" data={data} refetch={refetch} />;
}

export default Slots;
