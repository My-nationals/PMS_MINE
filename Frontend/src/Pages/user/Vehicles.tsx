// app/(admin)/vehicles/page.tsx or wherever you call it
"use client";

import { useEffect, useState } from "react";
import { VehicleTable } from "@/components/common/vehicle";
import api from "@/lib/api"; // adjust if different

type Vehicle = {
    id: string;
    plate: string;
    type: string;
    color: string;
    model: string;
};

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get("/vehicles");
                setVehicles(response.data); // assuming it's a plain array
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Loading vehicles...</p>;
    }

    return <VehicleTable data={vehicles} />;
}
