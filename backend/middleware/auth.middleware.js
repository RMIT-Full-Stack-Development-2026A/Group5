import jwt from 'jsonwebtoken';
import RevokedToken from '../modules/user/revokedToken.model.js';

export const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (await RevokedToken.findOne({ jti: decoded.jti })) {
            return res.status(401).json({ message: 'Token revoked. Please log in again.' });
        }

        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
