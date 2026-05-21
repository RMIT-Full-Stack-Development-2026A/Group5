import { RouterProvider } from 'react-router-dom';
import router from './frontend/config/router/RouteConfig'
import { AuthProvider } from './frontend/config/context/AuthContext.jsx';
import './frontend/public/main.css';

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;