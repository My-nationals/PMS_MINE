// import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import {
//     Card,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";

// export function AdminSectionCards() {
//     return (
//         <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
//             <Card className="@container/card">
//                 <CardHeader className="relative">
//                     <CardDescription>Total Slots</CardDescription>
//                     <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
//                         40
//                     </CardTitle>
//                     <div className="absolute right-4 top-4">
//                         <Badge
//                             variant="outline"
//                             className="flex gap-1 rounded-lg text-xs"
//                         >
//                             <TrendingUpIcon className="size-3" />
//                             Stable
//                         </Badge>
//                     </div>
//                 </CardHeader>
//                 <CardFooter className="flex-col items-start gap-1 text-sm">
//                     <div className="flex gap-2 font-medium">
//                         Capacity maintained{" "}
//                         <TrendingUpIcon className="size-4" />
//                     </div>
//                     <div className="text-muted-foreground">
//                         No change in slot allocation
//                     </div>
//                 </CardFooter>
//             </Card>

//             <Card className="@container/card">
//                 <CardHeader className="relative">
//                     <CardDescription>Total Requests</CardDescription>
//                     <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
//                         55
//                     </CardTitle>
//                     <div className="absolute right-4 top-4">
//                         <Badge
//                             variant="outline"
//                             className="flex gap-1 rounded-lg text-xs"
//                         >
//                             <TrendingUpIcon className="size-3" />
//                             +15%
//                         </Badge>
//                     </div>
//                 </CardHeader>
//                 <CardFooter className="flex-col items-start gap-1 text-sm">
//                     <div className="flex gap-2 font-medium">
//                         High user demand <TrendingUpIcon className="size-4" />
//                     </div>
//                     <div className="text-muted-foreground">
//                         Requests are growing this month
//                     </div>
//                 </CardFooter>
//             </Card>
//             <Card className="@container/card">
//                 <CardHeader className="relative">
//                     <CardDescription>Available Slots</CardDescription>
//                     <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
//                         15
//                     </CardTitle>
//                     <div className="absolute right-4 top-4">
//                         <Badge
//                             variant="outline"
//                             className="flex gap-1 rounded-lg text-xs"
//                         >
//                             <TrendingUpIcon className="size-3" />
//                             +10%
//                         </Badge>
//                     </div>
//                 </CardHeader>
//                 <CardFooter className="flex-col items-start gap-1 text-sm">
//                     <div className="flex gap-2 font-medium">
//                         More availability this week{" "}
//                         <TrendingUpIcon className="size-4" />
//                     </div>
//                     <div className="text-muted-foreground">
//                         Compared to last week's data
//                     </div>
//                 </CardFooter>
//             </Card>

//             <Card className="@container/card">
//                 <CardHeader className="relative">
//                     <CardDescription>Occupied Slots</CardDescription>
//                     <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
//                         25
//                     </CardTitle>
//                     <div className="absolute right-4 top-4">
//                         <Badge
//                             variant="outline"
//                             className="flex gap-1 rounded-lg text-xs"
//                         >
//                             <TrendingDownIcon className="size-3" />
//                             -5%
//                         </Badge>
//                     </div>
//                 </CardHeader>
//                 <CardFooter className="flex-col items-start gap-1 text-sm">
//                     <div className="flex gap-2 font-medium">
//                         Slightly less usage{" "}
//                         <TrendingDownIcon className="size-4" />
//                     </div>
//                     <div className="text-muted-foreground">
//                         Occupancy decreased slightly
//                     </div>
//                 </CardFooter>
//             </Card>
//         </div>
//     );
// }
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export function AdminSectionCards() {
    const { data, isLoading, isError } = useAdminDashboard();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError || !data) {
        return <p>Error loading dashboard data.</p>;
    }

    const {
        totalSlots = 0,
        totalRequests = 0,
        occupiedSlots = 0,
        availableSlots = 0,
    } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Total Slots</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {totalSlots}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                        >
                            <TrendingUpIcon className="size-3" />
                            Stable
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        Capacity maintained{" "}
                        <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        No change in slot allocation
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Total Requests</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {totalRequests}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                        >
                            <TrendingUpIcon className="size-3" />
                            +15%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        High user demand <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Requests are growing this month
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Available Slots</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {availableSlots}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                        >
                            <TrendingUpIcon className="size-3" />
                            +10%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        More availability this week{" "}
                        <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Compared to last week's data
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Occupied Slots</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {occupiedSlots}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Badge
                            variant="outline"
                            className="flex gap-1 rounded-lg text-xs"
                        >
                            <TrendingDownIcon className="size-3" />
                            -5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium">
                        Slightly less usage{" "}
                        <TrendingDownIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Occupancy decreased slightly
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
