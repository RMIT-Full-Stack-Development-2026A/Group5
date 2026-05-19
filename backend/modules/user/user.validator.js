export function validateRegistration({ username, email, password, comfirmPassword, country }) {
    const errors = [];

    if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push({ field: 'username', message: 'Username can only contain letters, numbers, underscores, or hyphens.' });
    }

    if (!email || email.length >= 255 || !/^[^\s@();:]+@[^\s@();:]+\.[^\s@();:]{2,}$/.test(email)) {
        errors.push({ field: 'email', message: 'Enter a valid email (E.g. user@example.com)' });
    }

    if (!password || password.length < 8)
        errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
    else {
        if (!/[0-9]/.test(password))   errors.push({ field: 'password', message: 'Must include a number. E.g. Pass1!' });
        if (!/[!@#$%^&*$]/.test(password)) errors.push({ field: 'password', message: 'Must include a special character. E.g. Pass1!' });
        if (!/[A-Z]/.test(password))   errors.push({ field: 'password', message: 'Must include an uppercase letter. E.g. Pass1!' });
    }

    if (password !== comfirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }

    if (!country) {
        errors.push({ field: 'country', message: 'Please select a country.' });
    }

    return errors;
}