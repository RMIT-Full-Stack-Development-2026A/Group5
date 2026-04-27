import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import RegisterForm from '../../components/RegisterForm/RegisterForm.jsx';
import { getToken } from '../../services/httpService.js';
import '../../../frontend/components/LoginForm/loginForm.css';

const Login = () => {
    const [showRegister, setShowRegister] = useState(false);

    if (getToken()) return <Navigate to="/" replace />;

    return (
        <div className="auth-page">
            {showRegister
                ? <RegisterForm onToggle={() => setShowRegister(false)} />
                : <LoginForm onToggle={() => setShowRegister(true)} />
            }
        </div>
    );
};

export default Login;