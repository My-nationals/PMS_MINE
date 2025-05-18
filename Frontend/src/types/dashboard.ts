// types/dashboard.ts
export interface ParkingRequest {
    id: string;
    status: string;
    createdAt: string;
    // Add more fields if needed
}

export interface PendingSlot {
    code: string;
    description: string;
}

export interface UserDashboardData {
    recentRequests: ParkingRequest[];
    pendingRequest: ParkingRequest | null;
    pendingSlot: PendingSlot | null;
}
