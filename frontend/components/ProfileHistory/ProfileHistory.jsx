import { useEffect, useState } from 'react';
import { http } from '../../services/httpService.js';
import { PROFILE_ENDPOINTS } from '../../config/api/api.js';

export default function ProfileHistory() {
    const [history, setHistory] = useState({ games: [], page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await http.get(`${PROFILE_ENDPOINTS.history}?page=1&limit=10`);
            setHistory(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to load game history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="col-lg-9">
            <div className="card border border-dark rounded-3">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Game History</h2>
                        <span className="text-muted">Total: {history.total}</span>
                    </div>
                    {loading && <p>Loading your match history...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && !history.games.length && (
                        <div className="alert alert-secondary">No match history available yet.</div>
                    )}
                    {history.games.map((game) => (
                        <div key={game._id} className="mb-3 border-bottom pb-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 className="mb-1">Match #{game.gameNumber || game.roomNumber || 'N/A'}</h5>
                                    <p className="mb-1 text-muted">{new Date(game.startTime).toLocaleString()}</p>
                                </div>
                                <span className="badge bg-secondary text-capitalize">{game.result || 'Pending'}</span>
                            </div>
                            <p className="mb-1">Mode: {game.gameType}</p>
                            <p className="mb-1">Board: {game.boardSize}</p>
                            <p className="mb-1">Opponent: {game.player2Name || 'Waiting for opponent'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}