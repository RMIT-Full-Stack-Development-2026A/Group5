import { useRegisterForm } from './useRegisterForm.js';
import { COUNTRIES } from '../../config/constants/countries.js';

const RegisterForm = ({ onToggle }) => {
    const { fields, errors, serverError, isLoading, handleChange, handleSubmit } = useRegisterForm();

    return (
        <div className="auth-card">
            <h2 className="auth-title">Sign Up</h2>

            {serverError && <div className="auth-error-banner">{serverError}</div>}

            <form onSubmit={handleSubmit}>
                <div className="auth-field">
                    <input
                        name="username"
                        placeholder="Username"
                        value={fields.username}
                        onChange={handleChange}
                        className={`auth-input ${errors.username ? 'input-error' : ''}`}
                    />
                    {errors.username && <span className="field-error">{errors.username}</span>}
                </div>

                <div className="auth-field">
                    <input
                        name="email"
                        placeholder="Email"
                        value={fields.email}
                        onChange={handleChange}
                        className={`auth-input ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="auth-field">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={fields.password}
                        onChange={handleChange}
                        className={`auth-input ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                <div className="auth-field">
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter Password"
                        value={fields.confirmPassword}
                        onChange={handleChange}
                        className={`auth-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </div>

                <div className="auth-field">
                    <select
                        name="country"
                        value={fields.country}
                        onChange={handleChange}
                        className={`auth-input ${errors.country ? 'input-error' : ''}`}
                    >
                        <option value="">Select Country</option>
                        {COUNTRIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {errors.country && <span className="field-error">{errors.country}</span>}
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? '...' : '→'}
                </button>
            </form>

            <p className="auth-toggle">
                Already have an account?{' '}
                <span onClick={onToggle} className="auth-toggle-link">Log In</span>
            </p>
        </div>
    );
};

export default RegisterForm;