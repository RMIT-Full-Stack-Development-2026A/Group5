import { useEffect, useState } from 'react';
import { profileService } from '../../services/profileService';
import { COUNTRIES } from '../../config/constants/countries';


const EMPTY_INFO = { username: '', email: '', country: '' };
const EMPTY_PWD  = { currentPassword: '', newPassword: '', confirmPassword: '' };


export default function ProfileInfo() {
    const [info, setInfo]       = useState(EMPTY_INFO);
    const [pwd, setPwd]         = useState(EMPTY_PWD);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [msg, setMsg]         = useState(null);
    const [pwdError, setPwdError] = useState(null);
    const [pwdMsg, setPwdMsg]     = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { profile } = await profileService.getMe();
                if (!cancelled) {
                    setInfo({
                        username: profile.username || '',
                        email:    profile.email || '',
                        country:  profile.country || '',
                    });
                }
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load profile');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMsg(null);
        try {
            const { profile } = await profileService.updateProfile({
                username: info.username,
                email:    info.email,
                country:  info.country || null,
            });
            setInfo({
                username: profile.username || '',
                email:    profile.email || '',
                country:  profile.country || '',
            });
            setMsg('Profile updated');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handlePwdSubmit = async (e) => {
        e.preventDefault();
        setPwdError(null);
        setPwdMsg(null);
        try {
            const res = await profileService.changePassword(pwd);
            setPwdMsg(res.message || 'Password updated');
            setPwd(EMPTY_PWD);
        } catch (err) {
            setPwdError(err.message || 'Failed to change password');
        }
    };

    if (loading) return <div className="col-lg-9">Loading profile…</div>;

    return (
        <div className="col-lg-9 d-flex flex-column gap-4">

            
            <div className="card border border-dark rounded-3">
                <div className="card-body d-flex flex-column gap-3">
                    <h2 className="card-title text-center">Profile Information</h2>

                    <div className="text-center">
                        <div className="bg-secondary rounded-circle d-inline-block" style={{ width: 100, height: 100 }} />
                    </div>

                    {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
                    {msg   && <div className="alert alert-success py-2 mb-0">{msg}</div>}

                    <form onSubmit={handleInfoSubmit} className="d-flex flex-column gap-3">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={info.username}
                                onChange={(e) => setInfo({ ...info, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={info.email}
                                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <select
                                className="form-select"
                                value={info.country}
                                onChange={(e) => setInfo({ ...info, country: e.target.value })}
                            >
                                <option value="">— Select country —</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-dark">Save Changes</button>
                    </form>
                </div>
            </div>

            {/* Change password */}
            <div className="card border border-dark rounded-3">
                <div className="card-body d-flex flex-column gap-3">
                    <h3 className="card-title">Change Password</h3>

                    {pwdError && <div className="alert alert-danger py-2 mb-0">{pwdError}</div>}
                    {pwdMsg   && <div className="alert alert-success py-2 mb-0">{pwdMsg}</div>}

                    <form onSubmit={handlePwdSubmit} className="d-flex flex-column gap-3">
                        <div className="form-group">
                            <label className="form-label">Current password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={pwd.currentPassword}
                                onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={pwd.newPassword}
                                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                                required
                            />
                            <small className="text-muted">
                                At least 8 chars, 1 uppercase, 1 number, 1 special character.
                            </small>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm new password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={pwd.confirmPassword}
                                onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-dark">Update Password</button>
                    </form>
                </div>
            </div>

        </div>
    );
}
