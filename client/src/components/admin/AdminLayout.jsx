import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* SIDEBAR */}

            <AdminSidebar />


            {/* MAIN CONTENT */}

            <main className="min-w-0 flex-1">

                <div className="p-4 sm:p-6 lg:p-8">

                    <Outlet />

                </div>

            </main>

        </div>
    );
};

export default AdminLayout;