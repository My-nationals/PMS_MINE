"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Vehicle {
    id: string;
    plate: string;
    model?: string;
}

export default function RequestForm() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [entryTime, setEntryTime] = useState("");
    const [exitTime, setExitTime] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch vehicles from your backend
        const fetchVehicles = async () => {
            try {
                const response = await api.get("/vehicles"); // change to your actual route
                setVehicles(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicles", err);
            }
        };
        fetchVehicles();
    }, []);

    const handleSubmit = async () => {
        if (!selectedVehicleId || !entryTime || !exitTime) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/request/${selectedVehicleId}`, {
                entryTime,
                exitTime,
            });

            alert("Request submitted successfully!");
            // Reset form
            setSelectedVehicleId("");
            setEntryTime("");
            setExitTime("");
        } catch (err) {
            console.error(err);
            alert("Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Select Plate Number:
                </label>
                <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">-- Select Plate --</option>
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.plate}{" "}
                            {vehicle.model ? `(${vehicle.model})` : ""}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Entry Time:
                </label>
                <input
                    type="datetime-local"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Exit Time:
                </label>
                <input
                    type="datetime-local"
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
            </Button>
        </form>
    );
}
