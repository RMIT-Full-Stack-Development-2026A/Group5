import { removeToken } from '../../services/httpService.js';

const Navbar = () => {
    const handleLogout = () => {
        removeToken();
        window.location.href = '/auth';
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
            <h3 style={{ margin: 0, fontWeight: 900 }}>TIC-TAC-TOANG</h3>
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
        </nav>
    );
};

export default Navbar;