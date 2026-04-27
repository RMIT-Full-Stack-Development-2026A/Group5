import { useState } from 'react';
import GameBoard from '../../components/GameBoard/GameBoard';
import ModeSelector from '../../components/ModeSelector/ModeSelector';
import Navbar from '../../components/Navbar/Navbar';

function HomePage() {
    const [selectedMode, setSelectedMode] = useState('easy');
    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center p-4 row g-4">
                <GameBoard selectedMode={selectedMode} boardStyle="celestial" />
                <ModeSelector onSelectMode={setSelectedMode} />
            </div>
        </>
    );
}

export default HomePage;