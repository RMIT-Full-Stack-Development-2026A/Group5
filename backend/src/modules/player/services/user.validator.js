const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const validateRegistration = ({ username, email, password, confirmPassword, country }) => {
    const errors = [];

    if (!username || !USERNAME_REGEX.test(username)) {
        errors.push({ field: 'username', message: 'Username must be 3-20 characters and contain only letters, numbers, _ or -.' });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
        errors.push({ field: 'email', message: 'Invalid email format. Example: user@example.com' });
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.' });
    }

    if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }

    if (!country) {
        errors.push({ field: 'country', message: 'Please select a country.' });
    }

    return errors;
};