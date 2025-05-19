// components/VehicleTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Vehicle = {
    id: string;
    plate: string;
    type: string;
    color: string;
    model: string;
};

type Props = {
    data: Vehicle[];
};

export function VehicleTable({ data }: Props) {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Vehicle List</h2>
            <div className="rounded-md border shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="p-4">Model</TableHead>
                            <TableHead className="p-4">Color</TableHead>
                            <TableHead className="p-4">Plate Number</TableHead>
                            <TableHead className="p-4">Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((vehicle) => (
                                <TableRow
                                    key={vehicle.id}
                                    className="hover:bg-gray-50"
                                >
                                    <TableCell className="p-4">
                                        {vehicle.model}
                                    </TableCell>
                                    <TableCell className="p-4">
                                        {vehicle.color}
                                    </TableCell>
                                    <TableCell className="p-4">
                                        {vehicle.plate}
                                    </TableCell>
                                    <TableCell className="p-4">
                                        {vehicle.type}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No vehicles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
