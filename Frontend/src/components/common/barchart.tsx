"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import api from "@/lib/api";

const chartConfig = {
    value: {
        label: "Count",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function BarChartComponent() {
    const [chartData, setChartData] = useState<
        { name: string; value: number }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get("/admin/dashboard");

                const {
                    totalSlots,
                    totalRequests,
                    occupiedSlots,
                    availableSlots,
                } = data;

                const transformedData = [
                    { name: "Total Slots", value: totalSlots },
                    { name: "Requests", value: totalRequests },
                    { name: "Occupied", value: occupiedSlots },
                    { name: "Available", value: availableSlots },
                ];

                setChartData(transformedData);
            } catch (error) {
                console.error("Error fetching bar chart data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart - Admin Overview</CardTitle>
                <CardDescription>
                    Slot usage and requests breakdown
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis />
                            <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="value"
                                fill="hsl(var(--chart-1))"
                                radius={8}
                                barSize={40}
                            >
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 4.1% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Dashboard metrics based on current data
                </div>
            </CardFooter>
        </Card>
    );
}
