"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSlotRequestActions } from "@/hooks/use-slot-request";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

type SlotRequest = {
    id: string;
    status: "PENDING" | "APPROVED" | "DENIED";
    user: { names: string };
    slot: { code: string } | null;
    vehicle?: { plate: string } | null;
};

type Props = {
    data: SlotRequest[];
};

export function SlotRequestTable({ data }: Props) {
    const { approveRequest, rejectRequest } = useSlotRequestActions();

    const [updatedStatuses, setUpdatedStatuses] = useState<
        Record<string, "APPROVED" | "DENIED" | "PENDING">
    >({});
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
    const [confirmation, setConfirmation] = useState<{
        id: string;
        action: "approve" | "reject";
    } | null>(null);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setLoadingIds((prev) => ({ ...prev, [id]: true }));
        try {
            if (action === "approve") {
                await approveRequest(id);
                setUpdatedStatuses((prev) => ({ ...prev, [id]: "APPROVED" }));
            } else {
                await rejectRequest(id);
                setUpdatedStatuses((prev) => ({ ...prev, [id]: "DENIED" }));
            }
        } finally {
            setLoadingIds((prev) => ({ ...prev, [id]: false }));
            setConfirmation(null);
        }
    };

    const getEffectiveStatus = (request: SlotRequest) => {
        return updatedStatuses[request.id] || request.status;
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center">
                Slot Requests
            </h2>
            <div className="rounded-md border shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="p-4 font-semibold text-gray-700">
                                Name
                            </TableHead>
                            <TableHead className="p-4 font-semibold text-gray-700">
                                Slot Code
                            </TableHead>
                            <TableHead className="p-4 font-semibold text-gray-700">
                                Vehicle Plate
                            </TableHead>
                            <TableHead className="p-4 font-semibold text-gray-700">
                                Status
                            </TableHead>
                            <TableHead className="p-4 font-semibold text-right text-gray-700">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((request) => {
                                const status = getEffectiveStatus(request);
                                const isLoading = loadingIds[request.id];

                                return (
                                    <TableRow
                                        key={request.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell className="p-4">
                                            {request.user.names}
                                        </TableCell>
                                        <TableCell className="p-4">
                                            {request.slot?.code || (
                                                <span className="text-gray-400 italic">
                                                    No slot
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="p-4">
                                            {request.vehicle?.plate || (
                                                <span className="text-gray-400 italic">
                                                    No vehicle
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="p-4">
                                            {status === "APPROVED" ? (
                                                <span className="text-green-600 font-semibold">
                                                    Approved
                                                </span>
                                            ) : status === "DENIED" ? (
                                                <span className="text-red-600 font-semibold">
                                                    Rejected
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600 font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="p-4 text-right space-x-2">
                                            {status === "PENDING" ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirmation({
                                                                id: request.id,
                                                                action: "approve",
                                                            })
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading &&
                                                        confirmation?.action ===
                                                            "approve" &&
                                                        confirmation?.id ===
                                                            request.id
                                                            ? "Approving..."
                                                            : "Approve"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setConfirmation({
                                                                id: request.id,
                                                                action: "reject",
                                                            })
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading &&
                                                        confirmation?.action ===
                                                            "reject" &&
                                                        confirmation?.id ===
                                                            request.id
                                                            ? "Rejecting..."
                                                            : "Reject"}
                                                    </Button>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">
                                                    Action complete
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Confirmation Dialog */}
            {confirmation && (
                <Dialog open={true} onOpenChange={() => setConfirmation(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {confirmation.action === "approve"
                                    ? "Approve Request"
                                    : "Reject Request"}
                            </DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-600">
                            Are you sure you want to{" "}
                            <span className="font-semibold">
                                {confirmation.action}
                            </span>{" "}
                            this request?
                        </p>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setConfirmation(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    confirmation.action === "reject"
                                        ? "destructive"
                                        : "default"
                                }
                                onClick={() =>
                                    handleAction(
                                        confirmation.id,
                                        confirmation.action
                                    )
                                }
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
