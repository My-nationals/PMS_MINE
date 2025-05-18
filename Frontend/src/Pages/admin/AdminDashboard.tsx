import { AdminSectionCards } from "@/components/common/admin-section-cards";
import { BarChartComponent } from "@/components/common/barchart";
import { PieChartComponent } from "@/components/common/pieChart";

const AdminDashboard = () => {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <AdminSectionCards />
            <div className="grid grid-cols-2 gap-5 max-2xl:grid-cols-1">
                <BarChartComponent />
                <PieChartComponent />
            </div>
        </div>
    );
};

export default AdminDashboard;
