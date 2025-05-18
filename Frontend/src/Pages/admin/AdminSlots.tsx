// import { useEffect, useState } from "react";
// import { ParkingSlotTable } from "@/components/common/data-table";
// import api from "@/lib/api";


// type Slot = {
//     id: string;
//     code: string;
//     occupied: boolean;
//     description: string | null;
//     userId: string | null;
// };


// function Slots() {
//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [loading, setLoading] = useState(true);
//   const fetchSlots = async () => {
//     try {
//         const response = await api.get("/slots");
//         setSlots(response.data.data.slots); // ✅ Co
//        console.log(slots)
//     } catch (error) {
//         console.error("Failed to fetch slots", error);
//     } finally {
//         setLoading(false);
//     }
// };

// useEffect(() => {
//     console.log("Slots updated", slots);
// }, [slots]);
  
  
  
//     return (
//         <div>
//             {loading ? (
//                 <p>Loading slots...</p>
//             ) : (
//                 <ParkingSlotTable
//                     role="admin"
//                     data={AdminSlot[]}
//                     refetch={fetchSlots}
//                 />
//             )}
//         </div>
//     );
// }

// export default Slots;

// type AdminSlot = {
//     id: string;
//     code: string;
//     occupied: boolean;
//     description: string | null;
//     userId: string | null;
// };
import { useEffect, useState } from "react";
import { ParkingSlotTable } from "../../components/common/data-table"; // adjust the path
import type { AdminSlot } from '../../components/common/data-table'; // <--- Use the SAME path/type used by ParkingSlotTable
 // <--- Use the SAME path/type used by ParkingSlotTable

import api from "@/lib/api";

const ParkingSlotsPage = () => {
    const [slots, setSlots] = useState<AdminSlot[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSlots = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token"); // Or sessionStorage or from context

            const res = await api.get("/slots", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const apiSlots = res.data.data.slots;
            console.log("api slots--->",apiSlots)
            const mappedSlots = apiSlots.map((slot: any) => ({
                id:slot.id,
                slotCode: slot.code,
                status: slot.occupied,
                description: slot.description,
                userId: slot.userId,
            }));

            setSlots(mappedSlots);
        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading slots...</p>
            ) : (
                <ParkingSlotTable
                    role="admin"
                    data={slots}
                    refetch={fetchSlots}
                />
            )}
        </div>
    );
};

export default ParkingSlotsPage;
