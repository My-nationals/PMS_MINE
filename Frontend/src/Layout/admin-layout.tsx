
import {AdminSidebar} from "@/components/common/admin-sidebar";
import { SiteHeader } from "@/components/common/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

// import data from "./data.json";

export default function Admin_layout({children}:{children:ReactNode}) {
    return (
        <SidebarProvider>
            <AdminSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                      {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
