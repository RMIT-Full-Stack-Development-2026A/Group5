import { useEffect, useState } from 'react';
import { http } from '../../services/httpService.js';
import { PROFILE_ENDPOINTS } from '../../config/api/api.js';

export default function ProfileInfo() {
    const [profile, setProfile] = useState({ username: '', email: '', country: '', avatarUrl: '' });
    const [status, setStatus] = useState({ message: '', error: false });

    const loadProfile = async () => {
        try {
            const data = await http.get(PROFILE_ENDPOINTS.me);
            setProfile({
                username: data.username || '',
                email: data.email || '',
                country: data.country || '',
                avatarUrl: data.avatarUrl || '',
            });
        } catch (error) {
            setStatus({ message: error.message || 'Unable to load profile.', error: true });
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updated = await http.patch(PROFILE_ENDPOINTS.update, {
                username: profile.username,
                email: profile.email,
                country: profile.country,
            });
            setProfile((current) => ({ ...current, ...updated }));
            setStatus({ message: 'Profile saved successfully.', error: false });
        } catch (error) {
            setStatus({ message: error.message || 'Failed to update profile.', error: true });
        }
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const updated = await http.post(PROFILE_ENDPOINTS.uploadAvatar, formData);
            setProfile((current) => ({ ...current, avatarUrl: updated.avatarUrl }));
            setStatus({ message: 'Avatar uploaded successfully.', error: false });
        } catch (error) {
            setStatus({ message: error.message || 'Avatar upload failed.', error: true });
        }
    };

    return (
        <div className="col-lg-9">
            <div className="card border border-dark rounded-3">
                <div className="card-body d-flex flex-column gap-3">
                    <h2 className="card-title text-center">Profile Information</h2>
                    {status.message && (
                        <div className={`alert ${status.error ? 'alert-danger' : 'alert-success'}`} role="alert">
                            {status.message}
                        </div>
                    )}
                    <div className="text-center">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt="Profile avatar"
                                className="rounded-circle"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="bg-secondary rounded-circle d-inline-block" style={{ width: '100px', height: '100px' }} />
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload Avatar</label>
                        <input type="file" accept="image/*" className="form-control" onChange={handleAvatarUpload} />
                    </div>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-control"
                                value={profile.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={profile.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                className="form-control"
                                value={profile.country}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
}