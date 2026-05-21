import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Nav from "../../components/Navbar/Navbar";
import HomePage from '../../pages/HomePage/HomePage';
import ProfilePage from '../../pages/Profile/Profile';
import AdminDashboard from '../../pages/AdminDashboard/AdminDashboard.jsx';
import Login from '../../pages/Login/Login.jsx'
import Replay from '../../pages/Replay/Replay.jsx';
import { getToken } from "../../services/httpService.js";

const AUTH_USER_STORAGE_KEY = 'authUser';

const getStoredAuthUser = () => {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_STORAGE_KEY));
    } catch {
        return null;
    }
};

const ProtectedRoute = ({ children }) => {
    return getToken() ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
    const user = getStoredAuthUser();
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
                path: "replay/:id",
                element: <Replay />
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