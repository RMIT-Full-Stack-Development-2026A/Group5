const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

const buildHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

export const http = {
    get: async (url) => {
        const res = await fetch (`${API_BASE}${url}`, { headers: buildHeaders() });
        const data = await res.json();
        if (!res.ok) throw {message: data.message, status: res.status};
        return data;
    },
    post: async (url, body) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify(body)
        });
    const data = await res.json();
    if (!res.ok) throw { message: data.message, status: res.status };
    return data;
    },
    patch: async (url, body) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'PATCH',
            headers: buildHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw { message: data.message, status: res.status };
        return data;
    }
};