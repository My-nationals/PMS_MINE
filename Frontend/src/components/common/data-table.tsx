
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

export type AdminSlot = {
    occupied: any;
    id: string;
    slotCode: string;
    status: "available" | "occupied";
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
          data: UserSlot[];
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
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
       const [slots, setSlots] = React.useState(data);
       React.useEffect(() => {
           if (role === "admin") {
               const mappedSlots = (data as AdminSlot[]).map((slot) => ({
                   id: slot.id ?? crypto.randomUUID(), // fallback if missing
                   slotCode: slot.slotCode,
                   status: slot.occupied ? "occupied" : "available",
               }));
               setSlots(mappedSlots);
           } else {
               setSlots(data);
           }
       }, [data, role]);

    const filteredData = slots.filter((slot) => {
        const query = search.toLowerCase();
        return (
            slot.slotCode.toLowerCase().includes(query) ||
            (role === "admin" &&
                (slot as AdminSlot).status.toLowerCase().includes(query))
        );
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
    
        const token = localStorage.getItem("auth_token");
        if (!token) {
            toast.error("User not logged in.");
            return;
        }
    
        try {
            await api.put(
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
                    placeholder={`Search by ${
                        role === "admin" ? "code or status" : "code"
                    }...`}
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
                                <TableRow
                                    key={slot.id}
                                    className="hover:bg-gray-50"
                                >
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
                                                        (slot as AdminSlot)
                                                            .status ===
                                                        "available"
                                                            ? "text-green-600 border-green-500"
                                                            : "text-red-600 border-red-500"
                                                    }`}
                                                >
                                                    {(slot as AdminSlot).status}
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
                                                                slot as AdminSlot
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
                                    colSpan={role === "admin" ? 3 : 1}
                                    className="text-center text-gray-500"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm">Rows per page:</label>
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {[5, 20, 30, 50].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
