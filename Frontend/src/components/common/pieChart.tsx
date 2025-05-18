"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import api from "@/lib/api";

const chartConfig = {
    count: {
        label: "Slot Count",
    },
    Available: {
        label: "Available",
        color: "hsl(var(--chart-1))",
    },
    Occupied: {
        label: "Occupied",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

export function PieChartComponent() {
    const [chartData, setChartData] = useState<
        { status: string; count: number; fill: string }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/dashboard");
                const { availableSlots, occupiedSlots } = res.data;

                const newData = [];

                if (availableSlots > 0) {
                    newData.push({
                        status: "Available",
                        count: availableSlots,
                        fill: "#000000",
                    });
                }

                if (occupiedSlots > 0) {
                    newData.push({
                        status: "Occupied",
                        count: occupiedSlots,
                        fill: "#5c545a",
                    });
                }

                setChartData(newData);
            } catch (err) {
                console.error("Failed to fetch slot data:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Slot Status</CardTitle>
                <CardDescription>Current availability snapshot</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey="count"
                                    hideLabel
                                />
                            }
                        />
                        <Pie data={chartData} dataKey="count">
                            <LabelList
                                dataKey="status"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 2.7% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Based on current slot usage
                </div>
            </CardFooter>
        </Card>
    );
}
