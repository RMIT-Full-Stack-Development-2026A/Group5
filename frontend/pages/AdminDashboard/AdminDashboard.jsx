import { useEffect, useState } from 'react';
import { http } from '../../services/httpService.js';

const fetchAdminUsers = () => http.get('/admin/users');
const setUserActiveStatus = (userId, isActive) => http.patch(`/admin/users/${userId}/status`, { isActive });
const listActiveRooms = () => http.get('/game/rooms');
const closeAdminRoom = (roomId) => http.patch(`/admin/rooms/${roomId}/close`, {});

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [error, setError] = useState('');

    const loadAdminData = async () => {
        setLoading(true);
        setError('');
        try {
            const [userData, roomData] = await Promise.all([fetchAdminUsers(), listActiveRooms()]);
            setUsers(userData);
            setRooms(roomData.rooms ?? roomData);
        } catch (err) {
            setError(err.message || 'Unable to load admin data.');
        } finally {
            setLoading(false);
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleToggleStatus = async (userId, isActive) => {
        try {
            const updated = await setUserActiveStatus(userId, !isActive);
            setUsers((current) => current.map((user) => (user._id === userId ? updated : user)));
        } catch (err) {
            setError(err.message || 'Unable to update user status.');
        }
    };

    const handleCloseRoom = async (roomId) => {
        try {
            const closed = await closeAdminRoom(roomId);
            setRooms((current) => current.filter((room) => room._id !== closed._id));
        } catch (err) {
            setError(err.message || 'Unable to close room.');
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
                            <h2 className="h4">Active Game Rooms</h2>
                        </div>
                        {loadingRooms ? (
                            <p>Loading rooms...</p>
                        ) : rooms.length === 0 ? (
                            <div className="alert alert-secondary">No active rooms found.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Room</th>
                                            <th>Host</th>
                                            <th>Opponent</th>
                                            <th>Game Type</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map((room) => (
                                            <tr key={room._id}>
                                                <td>{room.roomNumber}</td>
                                                <td>{room.player1Name}</td>
                                                <td>{room.player2Name || 'Waiting'}</td>
                                                <td>{room.gameType}</td>
                                                <td>{room.isActive ? 'Open' : 'Closed'}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCloseRoom(room._id)}
                                                    >
                                                        Close Room
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
            </div>
        </div>
    );
}
