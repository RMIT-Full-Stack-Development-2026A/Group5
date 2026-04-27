import { useLoginForm } from './useLoginForm.js';

const LoginForm = ({ onToggle }) => {
    const { fields, error, isLoading, handleChange, handleSubmit } = useLoginForm();

    return (
        <div className="auth-card">
            <h2 className="auth-title">Log In</h2>

            {error && <div className="auth-error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="auth-field">
                    <input
                        name="identifier"
                        placeholder="Username or Email"
                        value={fields.identifier}
                        onChange={handleChange}
                        className="auth-input"
                    />
                </div>

                <div className="auth-field">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={fields.password}
                        onChange={handleChange}
                        className="auth-input"
                    />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? '...' : '→'}
                </button>
            </form>

            <p className="auth-toggle">
                Don't have an account?{' '}
                <span onClick={onToggle} className="auth-toggle-link">Sign Up</span>
            </p>
        </div>
    );
};

export default LoginForm;