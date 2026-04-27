import React from 'react';

export const ClassicGameBoard = ({
    board,
    winningLine,
    winDirection,
    handleCellClick,
}) => {
    return (
        <div className="board board-classic">
            <div className="board-grid">
                {board.map((cell, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    const isDark = (row + col) % 2 === 0;
                    const isWin = winningLine.includes(index);

                    let cellClass = `cell ${isDark ? 'bg-dark-cell' : 'bg-light-cell'}`;
                    if (isWin) cellClass += ` win ${winDirection}`;

                    return (
                        <div
                            key={index}
                            className={cellClass}
                            onClick={() => handleCellClick(index)}
                        >
                            {cell && <span className={`piece piece-${cell}`}>{cell}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
