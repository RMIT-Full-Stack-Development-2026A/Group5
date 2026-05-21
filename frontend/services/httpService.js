const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

const buildHeaders = (isFormData = false) => {
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

const parseResponse = async (res) => {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw { message: data?.message || 'Unexpected error', status: res.status };
    return data;
};

export const http = {
    get: async (url) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'GET',
            headers: buildHeaders(),
        });
        return parseResponse(res);
    },
    post: async (url, body) => {
        const isFormData = body instanceof FormData;
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: buildHeaders(isFormData),
            body: isFormData ? body : JSON.stringify(body),
        });
        return parseResponse(res);
    },
    patch: async (url, body) => {
        const isFormData = body instanceof FormData;
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'PATCH',
            headers: buildHeaders(isFormData),
            body: isFormData ? body : JSON.stringify(body),
        });
        return parseResponse(res);
    },
    delete: async (url) => {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'DELETE',
            headers: buildHeaders(),
        });
        return parseResponse(res);
    },
};