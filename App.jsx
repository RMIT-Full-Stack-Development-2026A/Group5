import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './frontend/pages/HomePage/HomePage';
import Login from './frontend/pages/Login/Login';
import { getToken } from './frontend/services/httpService.js';

const ProtectedRoute = ({ children }) => {
    return getToken() ? children : <Navigate to="/auth" replace />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;