
const easyAI = (board, lastMove, boardSize) => {
    const emptyCells = board.map((cell, index) =>
        (cell === null ? index : null))
        .filter((v) => v !== null);

    if (emptyCells.length === 0) return null;

    //Simple AI: Randomly pick an adjacent cell
    const adjacentCells = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
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
        // If no adjacent cells are available, pick any random empty cell
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];

    }
    return adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
}

const evaluateLine = (board, index, player, dRow, dCol, boardSize) => {
    let count = 1;
    let openEnds = 0;

    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // Check in the forward direction
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

    // Check in the backward direction
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

// Medium AI: Block opponent's winning move
const mediumAI = (board, lastMove, boardSize) => {
    const directions = [
        { dr: 0, dc: 1 },   // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal right
        { dr: 1, dc: -1 }   // diagonal left
    ];

    const opponent = 'X';
    let highestPriority = 0;

    let bestMove = null;

    // Check if opponent has a winning move and block it
    for (let i = 0; i < board.length; i++) {
        let priority = 0;
        let open3 = 0;
        if (board[i] === null) {
            for (const { dr, dc } of directions) {
                const { count, openEnds } = evaluateLine(board, i, opponent, dr, dc, boardSize);
                if (count >= 5) {
                    priority = 3;
                }
                if (count === 4 && openEnds === 2) {
                    priority = 2;
                }
                if (count === 3 && openEnds === 2) {
                    ++open3;
                }
            }
            if (open3 >= 2) {
                priority = 1;
            }

            if (priority > highestPriority) {
                bestMove = i;
                highestPriority = priority;
            }
        }
    }
    if (bestMove === null) {
        return easyAI(board, lastMove, boardSize);
    }
    return bestMove;
}

const findWinningMove = (board, boardSize, player) => {
    const directions = [
        { dr: 0, dc: 1 },   // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal right
        { dr: 1, dc: -1 }   // diagonal left
    ];

    for (let i = 0; i < board.length; ++i) {
        if (board[i] === null) {

            for (const { dr, dc } of directions) {
                const { count } = evaluateLine(board, i, player, dr, dc, boardSize)
                if (count >= 5) {
                    return i;
                }
            }
        }
    }
    return null; // If the guard finishes walking and finds no wins, return null
}
// Hard AI: Try to win, if not possible, block opponent's winning move (Fallback to medium), otherwise pick random (Fallback to easy)
const hardAI = (board, lastMove, boardSize) => {
    const ai = "O"
    const opponent = "X"

    const winMove = findWinningMove(board, boardSize, ai)
    if (winMove !== null) {
        return winMove;
    }
    else {
        return mediumAI(board, lastMove, boardSize)
    }
}

export { easyAI, mediumAI, hardAI };