import { useState } from 'react';
import { registerUser } from './RegisterFormService.js';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const useRegisterForm = () => {
    const [fields, setFields] = useState({
        username: '', email: '', password: '', confirmPassword: '', country: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!USERNAME_REGEX.test(fields.username))
            newErrors.username = 'Username must be 3-20 characters: letters, numbers, _ or -';
        if (!EMAIL_REGEX.test(fields.email))
            newErrors.email = 'Invalid email format';
        if (!PASSWORD_REGEX.test(fields.password))
            newErrors.password = 'Password needs 8+ chars, 1 uppercase, 1 number, 1 special character (!@#$%^&*)';
        if (fields.password !== fields.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
        if (!fields.country)
            newErrors.country = 'Please select a country';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        try {
            await registerUser(fields);
            window.location.href = '/';
        } catch (err) {
            setServerError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return { fields, errors, serverError, isLoading, handleChange, handleSubmit };
};