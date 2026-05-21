import { createContext, useContext, useState } from 'react';

const GameBoardContext = createContext(null);

export const GameBoardProvider = ({ children }) => {
    const [gameBoard, setGameBoard] = useState('classic');

    return (
        <GameBoardContext.Provider value={{ gameBoard, setGameBoard }}>
            {children}
        </GameBoardContext.Provider>
    );
};

export const useGameBoard = () => {
    const context = useContext(GameBoardContext);

    if (!context) {
        throw new Error('useGameBoard must be used within a GameBoardProvider');
    }

    return context;
};
