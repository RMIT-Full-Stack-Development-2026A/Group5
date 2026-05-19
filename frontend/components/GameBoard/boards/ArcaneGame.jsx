import React, { useEffect, useRef } from 'react';
import { drawArcaneWinLine, arcaneSeal, bloodRune, drawArcaneBackground } from '../utils/arcaneBoardUtils';

const ArcaneMarker = React.memo(({ cell }) => {
    const markup = cell === 'X' ? arcaneSeal(48) : bloodRune(48);

    return <span className={`piece piece-${cell}`} dangerouslySetInnerHTML={{ __html: markup }} />;
});

export const ArcaneGameBoard = ({
    board,
    winningLine,
    isFinished,
    winner,
    handleCellClick,
    boardSize,
}) => {
    const boardRef = useRef(null);
    const canvasRef = useRef(null);
    const svgRef = useRef(null);
    const cellRefs = useRef([]);

    const getPieceCenter = (cell) => {
        const marker = cell.querySelector('.piece svg');
        if (marker?.getBBox && marker?.getScreenCTM && marker?.createSVGPoint) {
            const bbox = marker.getBBox();
            const point = marker.createSVGPoint();
            point.x = bbox.x + bbox.width / 2;
            point.y = bbox.y + bbox.height / 2;
            const screenPoint = point.matrixTransform(marker.getScreenCTM());
            return { x: screenPoint.x, y: screenPoint.y };
        }

        const fallback = cell.querySelector('.piece') || cell;
        const rect = fallback.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
    };

    useEffect(() => {
        if (!boardRef.current || !canvasRef.current) return;
        const redraw = () => {
            const canvas = canvasRef.current;
            const container = boardRef.current;
            if (!canvas || !container) return;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            drawArcaneBackground(canvas);
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
            drawArcaneWinLine(
                svgRef.current,
                boardRef.current,
                winningLine,
                winner,
                (idx) => {
                    const cell = cellRefs.current[idx];
                    if (!cell) return { x: 0, y: 0 };
                    return getPieceCenter(cell);
                },
            );
            return;
        }
        // Clear SVG if no win line
        svgRef.current.innerHTML = '';
        svgRef.current.removeAttribute('width');
        svgRef.current.removeAttribute('height');
    }, [winningLine, isFinished, winner]);

    return (
        <div ref={boardRef} className="board board-arcane" style={{ '--board-size': boardSize }}>
            <canvas ref={canvasRef} className="board-bg-canvas" aria-hidden="true" />
            <div className="board-grid">
                {board.map((cell, index) => (
                    <div
                        key={index}
                        ref={(el) => (cellRefs.current[index] = el)}
                        className={`cell ${cell ? `piece-${cell}` : ''}`}
                        onClick={() => handleCellClick(index)}
                    >
                        {cell && <ArcaneMarker cell={cell} />}
                    </div>
                ))}
            </div>
            <svg ref={svgRef} className="board-win-svg" aria-hidden="true" />
        </div>
    )
}