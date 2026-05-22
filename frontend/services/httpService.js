const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

const buildHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

export const http = {
    _handleResponse: async (res) => {
        // try to parse json, but tolerate empty responses
        let data = null;
        try { data = await res.json(); } catch { data = null; }

        // If unauthorized, clear token and redirect to login
        if (res.status === 401) {
            removeToken();
            // Only redirect to auth if we're not already on the auth page
            if (typeof window !== 'undefined' && window.location && !window.location.pathname.startsWith('/auth')) {
                // hard redirect to auth route so React state resets
                window.location.href = '/auth';
            }
            throw { message: (data && data.message) || 'Unauthorized', status: 401 };
        }

        if (!res.ok) throw { message: (data && data.message) || 'Request failed', status: res.status };
        return data;
    },

    get: async (url) => {
        const res = await fetch (`${API_BASE}${url}`, { headers: buildHeaders() });
        return await http._handleResponse(res);
    },

    post: async (url, body) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify(body)
        });
        return await http._handleResponse(res);
    },

    patch: async (url, body) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'PATCH',
            headers: buildHeaders(),
            body: JSON.stringify(body)
        });
        return await http._handleResponse(res);
    }
};