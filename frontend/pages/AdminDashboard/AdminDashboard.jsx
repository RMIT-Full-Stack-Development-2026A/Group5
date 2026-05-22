import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../../services/httpService.js';

const fetchAdminUsers = () => http.get('/admin/users');
const setUserActiveStatus = (userId, isActive) => http.patch(`/admin/users/${userId}/status`, { isActive });
const fetchAdminGames = (filters = {}) => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null && v !== '')).toString();
    const url = qs ? `/admin/games?${qs}` : '/admin/games';
    return http.get(url);
};

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [loadingGames, setLoadingGames] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGames, setTotalGames] = useState(0);
    const [error, setError] = useState('');

    const loadAdminData = async () => {
        setLoading(true);
        setLoadingGames(true);
        setError('');
        try {
            const [userData, gamesData] = await Promise.all([fetchAdminUsers(), fetchAdminGames({ page, limit })]);
            setUsers(userData || []);
            setGames((gamesData && gamesData.sessions) || []);
            setTotalGames(gamesData?.total || 0);
            setTotalPages(gamesData?.totalPages || 1);
        } catch (err) {
            console.error('Admin load error:', err);
            const message = err && (err.message || JSON.stringify(err)) || 'Unable to load admin data.';
            const status = err && err.status ? ` (status ${err.status})` : '';
            setError(`${message}${status}`);
        } finally {
            setLoading(false);
            setLoadingGames(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    useEffect(() => {
        // reload games when page or limit changes
        const loadGamesOnly = async () => {
            setLoadingGames(true);
            setError('');
            try {
                const gamesData = await fetchAdminGames({ page, limit });
                setGames((gamesData && gamesData.sessions) || []);
                setTotalGames(gamesData?.total || 0);
                setTotalPages(gamesData?.totalPages || 1);
            } catch (err) {
                console.error('Failed loading games:', err);
                setError(err.message || 'Failed loading games');
            } finally {
                setLoadingGames(false);
            }
        };
        loadGamesOnly();
    }, [page, limit]);

    const changePage = (p) => {
        if (p < 1) p = 1;
        if (p > totalPages) p = totalPages;
        setPage(p);
    };

    const changeLimit = (l) => {
        setLimit(l);
        setPage(1);
    };

    const handleToggleStatus = async (userId, isActive) => {
        try {
            const updated = await setUserActiveStatus(userId, !isActive);
            setUsers((current) => current.map((user) => (user._id === userId ? updated : user)));
        } catch (err) {
            setError(err.message || 'Unable to update user status.');
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row gy-4">
                <div className="col-12">
                    <div className="card p-4">
                        <h2 className="h4 mb-3">Users</h2>
                        {loading ? (
                            <p>Loading users...</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.isActive ? 'Active' : 'Disabled'}</td>
                                                <td>
                                                    <button
                                                        className={`btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                    >
                                                        {user.isActive ? 'Disable' : 'Enable'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12">
                    <div className="card p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h4">All Games</h2>
                        </div>
                        {loadingGames ? (
                            <p>Loading games...</p>
                        ) : games.length === 0 ? (
                            <div className="alert alert-secondary">No games found.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Match #</th>
                                            <th>Host</th>
                                            <th>Opponent</th>
                                            <th>Game Type</th>
                                            <th>Winner</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {games.map((g) => (
                                            <tr key={g._id}>
                                                <td>{g.gameNumber}</td>
                                                <td>{g.player1.username}</td>
                                                <td>{g.player2Name}</td>
                                                <td>{g.gameType}</td>
                                                <td>{g.winner}</td>
                                                <td>
                                                    <Link to={`/replay/${g._id}`} className="btn btn-sm btn-outline-primary">Replay</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination controls */}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="small text-muted">Showing {Math.min((page - 1) * limit + 1, totalGames)} - {Math.min(page * limit, totalGames)} of {totalGames}</div>
                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => changePage(page - 1)}>Prev</button>
                                <button className="btn btn-sm btn-outline-secondary me-2" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>Next</button>
                                <select className="form-select form-select-sm d-inline-block" style={{ width: 100 }} value={limit} onChange={(e) => changeLimit(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

