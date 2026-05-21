import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { removeToken } from '../../services/httpService.js';

const AUTH_USER_STORAGE_KEY = 'authUser';

const getStoredAuthUser = () => {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_STORAGE_KEY));
    } catch {
        return null;
    }
};

const Navbar = () => {
    const navigate = useNavigate();
    const [user] = useState(getStoredAuthUser());

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        navigate('/auth');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            backgroundColor: 'var(--primary-color, #FFE4E4)',
            borderBottom: '2px solid #000'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h3 style={{ margin: 0, fontWeight: 900 }}>TIC-TAC-TOANG</h3>
                <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#000' }}>Home</Link>
                <Link to="/profile" style={{ fontWeight: 700, textDecoration: 'none', color: '#000' }}>Profile</Link>
                {user?.role === 'admin' && (
                    <Link to="/admin" style={{ fontWeight: 700, textDecoration: 'none', color: '#000' }}>Admin</Link>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {user && <span style={{ fontWeight: 700 }}>{user.username}</span>}
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: '2px solid #000',
                        background: '#fff',
                        cursor: 'pointer',
                        fontWeight: 700
                    }}
                >
                    Log Out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;