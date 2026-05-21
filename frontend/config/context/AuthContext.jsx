import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '../../services/httpService.js';
import { fetchCurrentUser, getStoredAuthUser, clearAuthUser } from '../../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredAuthUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!getToken()) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const currentUser = await fetchCurrentUser();
                setUser(currentUser);
            } catch (error) {
                removeToken();
                clearAuthUser();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const signOut = () => {
        removeToken();
        clearAuthUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
