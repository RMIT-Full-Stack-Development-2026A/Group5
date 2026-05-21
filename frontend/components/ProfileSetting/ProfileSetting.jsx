import { useState } from 'react';
import { http } from '../../services/httpService.js';
import { PROFILE_ENDPOINTS } from '../../config/api/api.js';

export default function ProfileSetting() {
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [status, setStatus] = useState({ message: '', error: false });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPasswordData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ message: '', error: false });

        try {
            await http.patch(PROFILE_ENDPOINTS.changePassword, passwordData);
            setStatus({ message: 'Password updated successfully.', error: false });
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            setStatus({ message: error.message || 'Unable to update password.', error: true });
        }
    };

    return (
        <div className="col-lg-9 border border-dark rounded-3 p-4 card">
            <h2 className="card-title text-center">Profile Settings</h2>
            {status.message && (
                <div className={`alert ${status.error ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {status.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className="form-control"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="form-control"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        className="form-control"
                        value={passwordData.confirmNewPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
        </div>
    );
}