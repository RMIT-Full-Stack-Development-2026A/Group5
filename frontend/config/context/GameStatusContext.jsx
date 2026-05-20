import { createContext, useContext, useState } from 'react';

const GameStatusContext = createContext(null);

export const GameStatusProvider = ({ children }) => {
    const [gameStatus, setGameStatus] = useState('waiting');

    return (
        <GameStatusContext.Provider value={{ gameStatus, setGameStatus }}>
            {children}
        </GameStatusContext.Provider>
    );
};

export const useGameStatus = () => {
    const context = useContext(GameStatusContext);

    if (!context) {
        throw new Error('useGameStatus must be used within a GameStatusProvider');
    }

    return context;
};