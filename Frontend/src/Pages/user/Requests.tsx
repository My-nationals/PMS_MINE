"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"; // your axios instance
import { RequestTable } from "@/components/common/requests";
import { getCookie } from "@/utils/cookie";

type Request = {
    id: string;
    status: string;
    entryTime: string;
    exitTime: string | null;
    vehicle: {
        plate: string;
        model: string;
    };
};

// function getCookie(name: string): string | null {
//     const match = document.cookie.match(
//         new RegExp("(^| )" + name + "=([^;]+)")
//     );
//     return match ? match[2] : null;
// }

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = getCookie("auth_token");
                const response = await api.get("/requests/my-requests", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(response.data.requests);
            } catch (error) {
                console.error("Failed to fetch requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Loading requests...</p>;
    }

    return <RequestTable data={requests} />;
}
