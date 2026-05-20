import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gameSessionService } from '../../services/gameSessionService';


const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};


const formatGameType = (s) => {
    if (s.gameType === 'ai')     return `Single (${s.aiLevel})`;
    if (s.gameType === 'local')  return 'Two Players';
    if (s.gameType === 'online') return 'Online Match';
    return s.gameType;
};


const formatResult = (s, viewerId) => {
    if (s.status === 'in_progress') return 'In progress';
    if (s.status === 'aborted')     return 'Aborted';
    if (s.result === 'draw')        return 'Draw';
    const youArePlayer1 = String(s.player1?._id || s.player1) === String(viewerId);
    const youWon = (s.result === 'player1' && youArePlayer1) || (s.result === 'player2' && !youArePlayer1);
    return youWon ? 'Won' : 'Lost';
};


const aiDisplayName = (level) => {
    if (level === 'easy')   return 'Easy AI';
    if (level === 'medium') return 'Medium AI';
    if (level === 'hard')   return 'Hard AI';
    return 'AI';
};


const getOpponentName = (s, viewerId) => {
    if (s.gameType === 'ai') return aiDisplayName(s.aiLevel);
    const youArePlayer1 = String(s.player1?._id || s.player1) === String(viewerId);
    if (youArePlayer1) {
        return s.player2?.username || s.player2Name || 'Unknown';
    }
    return s.player1?.username || 'Unknown';
};


const INITIAL_FILTERS = {
    search:    '',
    result:    '',
    gameType:  '',
    startDate: '',
    endDate:   '',
    sortOrder: 'desc',
};


export default function ProfileHistory() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewerId, setViewerId] = useState(null);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setViewerId(payload.id);
            }
        } catch (_e) { /* token decoding is best-effort */ }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const handle = setTimeout(async () => {
            setLoading(true);
            try {
                const { sessions } = await gameSessionService.getHistory(filters);
                if (!cancelled) {
                    setSessions(sessions || []);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load history');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 250);
        return () => { cancelled = true; clearTimeout(handle); };
    }, [filters]);

    const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
    const resetFilters = () => setFilters(INITIAL_FILTERS);

    return (
        <div className="col-lg-9 d-flex flex-column gap-3">
            {/* Filter bar */}
            <div className="card p-3">
                <div className="row g-2 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label small mb-1">Search (match # or opponent name)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 5 or Easy"
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small mb-1">Result</label>
                        <select className="form-select" value={filters.result} onChange={(e) => updateFilter('result', e.target.value)}>
                            <option value="">All</option>
                            <option value="win">Won</option>
                            <option value="lose">Lost</option>
                            <option value="draw">Draw</option>
                            <option value="aborted">Aborted</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small mb-1">Game type</label>
                        <select className="form-select" value={filters.gameType} onChange={(e) => updateFilter('gameType', e.target.value)}>
                            <option value="">All</option>
                            <option value="single">Single Player</option>
                            <option value="two">Two Players</option>
                            <option value="online">Online Match</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small mb-1">Sort by date</label>
                        <select className="form-select" value={filters.sortOrder} onChange={(e) => updateFilter('sortOrder', e.target.value)}>
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </div>
                    <div className="col-md-2 text-end">
                        <button className="btn btn-outline-secondary btn-sm" onClick={resetFilters}>Reset</button>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small mb-1">From</label>
                        <input type="date" className="form-control" value={filters.startDate} onChange={(e) => updateFilter('startDate', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small mb-1">To</label>
                        <input type="date" className="form-control" value={filters.endDate} onChange={(e) => updateFilter('endDate', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading && <div>Loading match history…</div>}
            {error && <div className="text-danger">{error}</div>}
            {!loading && !error && sessions.length === 0 && (
                <div className="text-muted">No matches found.</div>
            )}

            {sessions.map((s) => (
                <div key={s._id} className="card border border-dark rounded-3">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h3 className="fw-bold">Match ID - {String(s.gameNumber || '').padStart(6, '0')}</h3>
                            <p className="text-muted">{formatDate(s.startTime)}</p>
                        </div>
                        <div className="ps-4">
                            <p className="mb-1">Game Mode: {formatGameType(s)}</p>
                            <p className="mb-1">{s.boardSize}</p>
                            <p className="mb-1">Opponent: {getOpponentName(s, viewerId)}</p>
                            <p className="mb-0">Status: {formatResult(s, viewerId)}</p>
                        </div>
                    </div>
                    <div className="card-footer">
                        <Link to={`/replay/${s._id}`} className="btn">View Details</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
