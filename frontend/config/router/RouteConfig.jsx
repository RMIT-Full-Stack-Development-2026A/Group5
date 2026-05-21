import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Nav from "../../components/Navbar/Navbar";
import HomePage from '../../pages/HomePage/HomePage';
import ProfilePage from '../../pages/Profile/Profile';
import AdminDashboard from '../../pages/AdminDashboard/AdminDashboard.jsx';
import Login from '../../pages/Login/Login.jsx'
import { getToken } from "../../services/httpService.js";
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    return getToken() ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <>
                    <Nav />
                    <Outlet />
                </>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "profile",
                element: <ProfilePage />
            },
            {
                path: "admin",
                element: (
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                )
            }
        ]
    },
    {
        path: "/auth",
        element: <Login />
    }
]);

export default router;