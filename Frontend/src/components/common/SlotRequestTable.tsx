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

type SlotRequest = {
    id: string;
    status: "PENDING" | "APPROVED" | "DENIED";
    user: { names: string };
    slot: { code: string };
};

type Props = {
    data: SlotRequest[];
};

export function SlotRequestTable({ data }: Props) {
    const { approveRequest, rejectRequest, isApproving, isRejecting } =
        useSlotRequestActions();
    const [updatedStatuses, setUpdatedStatuses] = useState<
        Record<string, "APPROVED" | "DENIED" | "PENDING">
    >({});

    const handleApprove = async (id: string) => {
        await approveRequest(id);
        setUpdatedStatuses((prev) => ({ ...prev, [id]: "APPROVED" }));
    };

    const handleReject = async (id: string) => {
        await rejectRequest(id);
        setUpdatedStatuses((prev) => ({ ...prev, [id]: "DENIED" }));
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

                                return (
                                    <TableRow
                                        key={request.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell className="p-4">
                                            {request.user.names}
                                        </TableCell>
                                        <TableCell className="p-4">
                                            {request.slot.code}
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
                                                            handleApprove(
                                                                request.id
                                                            )
                                                        }
                                                        disabled={
                                                            isApproving ||
                                                            isRejecting
                                                        }
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleReject(
                                                                request.id
                                                            )
                                                        }
                                                        disabled={
                                                            isApproving ||
                                                            isRejecting
                                                        }
                                                    >
                                                        Reject
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
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
