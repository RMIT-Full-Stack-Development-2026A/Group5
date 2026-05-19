import { useState } from 'react';
import { loginUser } from './loginFormService.js';

export const useLoginForm = () => {
    const [fields, setFields] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fields.identifier || !fields.password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        try {
            await loginUser(fields);
            window.location.href = '/';
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return { fields, error, isLoading, handleChange, handleSubmit };
};