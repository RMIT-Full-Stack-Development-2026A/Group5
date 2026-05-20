import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Nav from "../../components/Navbar/Navbar";
import HomePage from '../../pages/HomePage/HomePage';
import ProfilePage from '../../pages/Profile/Profile';
import Login from '../../pages/Login/Login.jsx'
import { getToken } from "../../services/httpService.js";

const ProtectedRoute = ({ children }) => {
    return getToken() ? children : <Navigate to="/auth" replace />;
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
            }
        ]
    },
    {
        path: "/auth",
        element: <Login />
    }
]);

export default router;