"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

type Vehicle = {
    id: string;
    plate: string;
    model: string;
};

export default function RequestDialog({ vehicle }: { vehicle: Vehicle }) {
    const [loading, setLoading] = useState(false);
    const [entryTime, setEntryTime] = useState("");
    const [exitTime, setExitTime] = useState("");

    const handleCreateRequest = async () => {
        setLoading(true);
        try {
            await axios.post(`/api/request/${vehicle.id}`, {
                entryTime,
                exitTime,
            });
            alert("Request created successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Request</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Parking Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <p>
                            <strong>Plate:</strong> {vehicle.plate}
                        </p>
                        <p>
                            <strong>Model:</strong> {vehicle.model}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>
                            Entry Time:
                            <input
                                type="datetime-local"
                                value={entryTime}
                                onChange={(e) => setEntryTime(e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            />
                        </label>
                        <label>
                            Exit Time:
                            <input
                                type="datetime-local"
                                value={exitTime}
                                onChange={(e) => setExitTime(e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                            />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateRequest} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
