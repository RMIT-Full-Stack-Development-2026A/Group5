import { RouterProvider } from 'react-router-dom';
import router from './frontend/config/router/RouteConfig'
import './frontend/public/main.css';
import { GameBoardProvider } from './frontend/config/context/GameBoardContext';

function App() {
    return (
        <GameBoardProvider>
            <RouterProvider router={router} />
        </GameBoardProvider>
    );
}

export default App;