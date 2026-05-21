import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/context/AuthContext.jsx';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = () => {
        signOut();
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