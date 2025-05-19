import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useSlotMutations } from "@/hooks/slot";
import { toast } from "sonner";
import api from "@/lib/api";
import { getCookie } from "@/utils/cookie";

export type AdminSlot = {
    id: string;
    slotCode: string;
    status: "available" | "occupied";
    occupied: boolean;
};

type UserSlot = {
    id: string;
    slotCode: string;
};

type Props =
    | {
          role: "admin";
          data: AdminSlot[];
          refetch?: () => void;
      }
    | {
          role: "user";
          data: { id: string; code: string; occupied: boolean }[];
          refetch?: () => void;
      };

export function ParkingSlotTable({ role, data, refetch }: Props) {
    const [search, setSearch] = React.useState("");
    const { updateSlot, deleteSlot } = useSlotMutations();
    const [editingSlotId, setEditingSlotId] = React.useState<string | null>(
        null
    );
    const [editFormData, setEditFormData] = React.useState<AdminSlot | null>(
        null
    );
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage] = React.useState(5);
    const [slots, setSlots] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (role === "admin") {
            const mappedSlots = (data as AdminSlot[]).map((slot) => ({
                id: slot.id,
                slotCode: slot.slotCode,
                status: slot.occupied ? "occupied" : "available",
                occupied: slot.occupied,
            }));
            setSlots(mappedSlots);
        } else {
            const mappedSlots = (data as any[]).map((slot) => ({
                id: slot.id,
                slotCode: slot.code,
            }));
            setSlots(mappedSlots);
        }
    }, [data, role]);

    const filteredData = slots.filter((slot) => {
        const query = search.toLowerCase();
        return slot.slotCode.toLowerCase().includes(query);
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditClick = (slot: AdminSlot) => {
        setEditingSlotId(slot.id);
        setEditFormData({ ...slot });
    };

    const handleSaveEdit = async () => {
        if (!editFormData) return;

        const token = getCookie("auth_token");
        if (!token) {
            toast.error("User not logged in.");
            return;
        }

        try {
            await api.patch(
                `/slots/${editFormData.id}`,
                {
                    code: editFormData.slotCode,
                    occupied: editFormData.status === "occupied",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Slot updated successfully");
            setEditingSlotId(null);
            setEditFormData(null);
            refetch?.();
        } catch (err) {
            console.error("Update slot error:", err);
            toast.error("Failed to update slot");
        }
    };

    const handleDelete = async (slotId: string, slotCode: string) => {
        if (!confirm(`Are you sure you want to delete slot ${slotCode}?`))
            return;

        try {
            await deleteSlot(slotId);
            toast.success(`Slot ${slotCode} deleted`);
            refetch?.();
        } catch {
            toast.error("Failed to delete slot");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center">
                Parking Slots ({role === "admin" ? "Admin View" : "User View"})
            </h2>

            <div className="flex justify-center">
                <Input
                    placeholder={`Search by slot code...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md"
                />
            </div>

            <div className="rounded-md border shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="p-4">Slot Code</TableHead>
                            {role === "admin" && <TableHead>Status</TableHead>}
                            {role === "admin" && (
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((slot) => (
                                <TableRow key={slot.id}>
                                    <TableCell>
                                        {editingSlotId === slot.id ? (
                                            <Input
                                                value={
                                                    editFormData?.slotCode || ""
                                                }
                                                onChange={(e) =>
                                                    setEditFormData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  slotCode:
                                                                      e.target
                                                                          .value,
                                                              }
                                                            : prev
                                                    )
                                                }
                                            />
                                        ) : (
                                            slot.slotCode
                                        )}
                                    </TableCell>

                                    {role === "admin" && (
                                        <TableCell>
                                            {editingSlotId === slot.id ? (
                                                <Select
                                                    value={editFormData?.status}
                                                    onValueChange={(value) =>
                                                        setEditFormData(
                                                            (prev) =>
                                                                prev
                                                                    ? {
                                                                          ...prev,
                                                                          status: value as
                                                                              | "available"
                                                                              | "occupied",
                                                                      }
                                                                    : prev
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="available">
                                                            Available
                                                        </SelectItem>
                                                        <SelectItem value="occupied">
                                                            Occupied
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className={`px-2 py-1 rounded-full text-sm ${
                                                        slot.status ===
                                                        "available"
                                                            ? "text-green-600 border-green-500"
                                                            : "text-red-600 border-red-500"
                                                    }`}
                                                >
                                                    {slot.status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                    )}

                                    {role === "admin" && (
                                        <TableCell className="text-right space-x-2">
                                            {editingSlotId === slot.id ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleSaveEdit}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingSlotId(
                                                                null
                                                            );
                                                            setEditFormData(
                                                                null
                                                            );
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                slot
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                slot.id,
                                                                slot.slotCode
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center py-4"
                                >
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
