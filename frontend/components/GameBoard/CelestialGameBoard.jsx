import React, { useEffect, useRef } from 'react';
import {
    drawBackground,
    drawConstellationWinLine,
    moonMarker,
    starMarker,
} from './celestialBoardUtils';

export const CelestialGameBoard = ({
    board,
    winningLine,
    isFinished,
    handleCellClick,
}) => {
    const boardRef = useRef(null);
    const canvasRef = useRef(null);
    const svgRef = useRef(null);
    const cellRefs = useRef([]);

    useEffect(() => {
        if (!boardRef.current || !canvasRef.current) return;

        const redraw = () => {
            const canvas = canvasRef.current;
            const container = boardRef.current;
            if (!canvas || !container) return;

            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            drawBackground(canvas);
        };

        redraw();

        const container = boardRef.current;
        const observer = new ResizeObserver(redraw);
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || !boardRef.current) return;

        if (winningLine.length > 0 && isFinished) {
            drawConstellationWinLine(
                svgRef.current,
                boardRef.current,
                winningLine,
                (idx) => {
                    const cell = cellRefs.current[idx];
                    if (!cell) return { x: 0, y: 0 };
                    const rect = cell.getBoundingClientRect();
                    return {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    };
                },
            );
            return;
        }

        svgRef.current.innerHTML = '';
        svgRef.current.removeAttribute('width');
        svgRef.current.removeAttribute('height');
    }, [winningLine, isFinished]);

    return (
        <div className="board board-celestial" ref={boardRef}>
            <canvas ref={canvasRef} className="board-bg-canvas" aria-hidden="true" />

            <div className="board-grid">
                {board.map((cell, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    const isDark = (row + col) % 2 === 0;
                    const isWin = winningLine.includes(index);

                    let cellClass = `cell ${isDark ? 'bg-dark-cell' : 'bg-light-cell'}`;
                    if (isWin) cellClass += ' win';

                    return (
                        <div
                            key={index}
                            ref={(el) => {
                                cellRefs.current[index] = el;
                            }}
                            className={cellClass}
                            onClick={() => handleCellClick(index)}
                        >
                            {cell && (
                                <span
                                    className={`piece piece-${cell}`}
                                    dangerouslySetInnerHTML={{ __html: cell === 'X' ? starMarker(48) : moonMarker(46) }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <svg ref={svgRef} className="board-win-svg" aria-hidden="true" />
        </div>
    );
};
