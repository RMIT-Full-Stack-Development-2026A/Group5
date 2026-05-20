const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const EMAIL_REGEX = /^[^\s@();:]+@[^\s@();:]+\.[^\s@();:]{2,}$/;

export const validateRegistration = ({ username, email, password, confirmPassword, country }) => {
    const errors = [];

    if (!username || !USERNAME_REGEX.test(username)) {
        errors.push({
            field: 'username',
            message: 'Username can only contain letters, numbers, underscores, or hyphens.'
        });
    }

    if (!email || email.length >= 255 || !EMAIL_REGEX.test(email)) {
        errors.push({
            field: 'email',
            message: 'Enter a valid email (e.g. user@example.com)'
        });
    }

    if (!password || password.length < 8) {
        errors.push({
            field: 'password',
            message: 'Password must be at least 8 characters.'
        });
    } else {
        if (!/[0-9]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'Must include a number. e.g. Pass1!'
            });
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'Must include a special character. e.g. Pass1!'
            });
        }
        if (!/[A-Z]/.test(password)) {
            errors.push({
                field: 'password',
                message: 'Must include an uppercase letter. e.g. Pass1!'
            });
        }
    }

    if (password !== confirmPassword) {
        errors.push({
            field: 'confirmPassword',
            message: 'Passwords do not match.'
        });
    }

    if (!country) {
        errors.push({
            field: 'country',
            message: 'Please select a country.'
        });
    }

    return errors;
};
