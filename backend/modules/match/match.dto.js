// Matchs to UI cards
// "Match ID - 000001 | 10.10.2026 | Game Mode | Board | Opponent | Status"

export const toMatchDTO = (match) => ({
    id: match._id,
    matchNumber: String(match.matchNumber).padStart(6, '0'), // "000001"
    gameMode: match.gameMode,
    boardSize: '${match.boardSize} x ${match.boardSize}',
    opponentName: match.player2Name
        ?? match.player2ID?.usernam
        ?? 'Unknown',
    opponentAvatar: match.player2ID?.avatarURL ?? null,
    result: match.result, // "win", "lose", "aborted"
    startTime: match.startTime,
    endTime: match.endTime,
});