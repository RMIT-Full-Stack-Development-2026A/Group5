import jwt from 'jsonwebtoken';
import RevokedToken from '../modules/auth/models/revokedTokenModel.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const revoked = await RevokedToken.findOne({ jti: decoded.jti });
        if (revoked) {
            return res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
        }

        req.user = {
            sub: decoded.sub,
            role: decoded.role,
            username: decoded.username,
            jti: decoded.jti,
            exp: decoded.exp,
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};