import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Temporary debug: log decoded token and auth header to diagnose missing `id` issues.
        console.log('[verifyToken] Authorization header:', authHeader?.slice(0, 80));
        console.log('[verifyToken] decoded token payload:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};