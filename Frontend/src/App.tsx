import { Routes, Route } from "react-router-dom";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import AdminSlots from "./Pages/admin/AdminSlots";
import Requests from "./Pages/admin/Request";
import AdminLayout from "./Layout/admin-layout";
import UserLayout from "./Layout/user-layout";
import UserDashboard from "./Pages/user/Dashboard";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Vehicles from "./Pages/user/Vehicles"

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/slots"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <AdminSlots />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/requests"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Requests />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <UserDashboard />
                        </UserLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/vehicles"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Vehicles />
                        </UserLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user/requests"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Requests />
                        </UserLayout>
                    </ProtectedRoute>
                }
            />
            {/* <Route
                path="/user/slots"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <UserSlots />
                        </UserLayout>
                    </ProtectedRoute>
                }
            /> */}

            {/* Redirect root to login */}
            <Route path="/" element={<Login />} />
        </Routes>
    );
}

export default App;
