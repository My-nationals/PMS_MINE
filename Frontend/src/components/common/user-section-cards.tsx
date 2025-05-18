import { useUserDashboard } from "@/hooks/useUserDashboard";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import api from "@/lib/api";

export function UserSectionCards() {
    const { data, isLoading, isError } = useUserDashboard();
    console.log({ isLoading, isError, data });

    // ✅ Temporary manual test fetch
    useEffect(() => {
        const testFetch = async () => {
            try {
                const res = await api.get("/dashboard/user");
                console.log("✅ Manual fetch data:", res.data);
            } catch (error) {
                console.error(
                    "❌ Manual fetch error:",
                    
                );
            }
        };
        testFetch();
    }, []);

    console.log("💡 React Query Data:", data);

    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }

    if (isError) {
        return <p>Failed to load dashboard data</p>;
    }

    if (!data) {
        return <p>No data available</p>;
    }

    const { recentRequests, pendingRequest, pendingSlot } = data;

    return (
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
            {/* Assigned Slot Card */}
            <Card>
                <CardHeader className="relative">
                    <CardDescription>Your Slot</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {pendingSlot ? pendingSlot.code : "No Slot"}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 text-xs">
                            <TrendingUpIcon className="size-3" />
                            {pendingSlot ? "Confirmed" : "Pending"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        {pendingSlot
                            ? "Assigned successfully"
                            : "Waiting approval"}
                        <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {pendingSlot
                            ? "You have an active slot reservation"
                            : "You have no active slot reservation"}
                    </div>
                </CardFooter>
            </Card>

            {/* Most Recent Request Card */}
            <Card>
                <CardHeader className="relative">
                    <CardDescription>Recent Request</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {recentRequests?.[0]?.status ?? "No Requests"}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 text-xs">
                            {recentRequests?.[0]?.status === "APPROVED" ? (
                                <>
                                    <TrendingUpIcon className="size-3" />{" "}
                                    Success
                                </>
                            ) : (
                                <>
                                    <TrendingDownIcon className="size-3" />{" "}
                                    Pending
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        {recentRequests?.[0]?.status === "APPROVED"
                            ? "Your request was successful"
                            : "No approved requests"}
                        <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {recentRequests?.[0]
                            ? "You can now access your assigned slot"
                            : "No request data available"}
                    </div>
                </CardFooter>
            </Card>

            {/* Pending Request Card */}
            <Card>
                <CardHeader className="relative">
                    <CardDescription>Pending Request</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {pendingRequest?.status ?? "None"}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge variant="outline" className="flex gap-1 text-xs">
                            {pendingRequest ? (
                                <>
                                    <TrendingDownIcon className="size-3" />
                                    Pending
                                </>
                            ) : (
                                "No Pending"
                            )}
                        </Badge>
                    </div>
                </CardHeader>

                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        {pendingRequest
                            ? "You have a request awaiting approval"
                            : "No pending requests"}
                        <TrendingDownIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {pendingRequest
                            ? "Please wait while your request is reviewed"
                            : "You can create a new parking request"}
                    </div>

                    {/* ✅ Display Slot Code below if exists */}
                    {pendingRequest?.slotCode ? (
                        <div className="text-sm text-muted-foreground mt-2">
                            Slot Code Requested:{" "}
                            <span className="font-medium">
                                {pendingRequest.slotCode}
                            </span>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground mt-2">
                            No SlotCode
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
