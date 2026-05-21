const easyAI = (board, lastMove, boardSize) => {
    const emptyCells = board.map((cell, index) => (cell === null ? index : null)).filter((v) => v !== null);
    if (emptyCells.length === 0) return null;

    const adjacentCells = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    const row = Math.floor(lastMove / boardSize);
    const col = lastMove % boardSize;
    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr * boardSize + nc] === null) {
            adjacentCells.push(nr * boardSize + nc);
        }
    }
    if (adjacentCells.length === 0) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
};

const evaluateLine = (board, index, player, dRow, dCol, boardSize) => {
    let count = 1;
    let openEnds = 0;

    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    let r1 = row + dRow;
    let c1 = col + dCol;
    while (r1 >= 0 && r1 < boardSize && c1 >= 0 && c1 < boardSize && board[r1 * boardSize + c1] === player) {
        count++;
        r1 += dRow;
        c1 += dCol;
    }
    if (r1 >= 0 && r1 < boardSize && c1 >= 0 && c1 < boardSize && board[r1 * boardSize + c1] === null) {
        openEnds++;
    }

    let r2 = row - dRow;
    let c2 = col - dCol;
    while (r2 >= 0 && r2 < boardSize && c2 >= 0 && c2 < boardSize && board[r2 * boardSize + c2] === player) {
        count++;
        r2 -= dRow;
        c2 -= dCol;
    }
    if (r2 >= 0 && r2 < boardSize && c2 >= 0 && c2 < boardSize && board[r2 * boardSize + c2] === null) {
        openEnds++;
    }

    return { count, openEnds };
};

const mediumAI = (board, lastMove, boardSize) => {
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 },
    ];

    const opponent = 'X';
    let highestPriority = 0;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] !== null) continue;
        let priority = 0;
        let open3 = 0;

        for (const { dr, dc } of directions) {
            const { count, openEnds } = evaluateLine(board, i, opponent, dr, dc, boardSize);
            if (count >= 5) priority = 3;
            if (count === 4 && openEnds === 2) priority = Math.max(priority, 2);
            if (count === 3 && openEnds === 2) open3 += 1;
        }

        if (open3 >= 2) {
            priority = Math.max(priority, 1);
        }

        if (priority > highestPriority) {
            bestMove = i;
            highestPriority = priority;
        }
    }

    return bestMove === null ? easyAI(board, lastMove, boardSize) : bestMove;
};

const findWinningMove = (board, boardSize, player) => {
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 },
    ];

    for (let i = 0; i < board.length; i++) {
        if (board[i] !== null) continue;
        for (const { dr, dc } of directions) {
            const { count } = evaluateLine(board, i, player, dr, dc, boardSize);
            if (count >= 5) return i;
        }
    }
    return null;
};

const hardAI = (board, lastMove, boardSize) => {
    const winMove = findWinningMove(board, boardSize, 'O');
    if (winMove !== null) return winMove;
    return mediumAI(board, lastMove, boardSize);
};

export { easyAI, mediumAI, hardAI };