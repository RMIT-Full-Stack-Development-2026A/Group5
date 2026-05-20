import { RouterProvider } from 'react-router-dom';
import router from './frontend/config/router/RouteConfig'
import './frontend/public/main.css';

function App() {
    return <RouterProvider router={router} />;
}

export default App;