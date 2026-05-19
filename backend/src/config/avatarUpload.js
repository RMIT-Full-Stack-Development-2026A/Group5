import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __direname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__direname, '../../uploads/avatars');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Store memory then resize with sharp
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Resize to standard 200x200 and save
export const processAvatar = async (buffer, userID) => {
    const filename = `avatar_${userID}_${Date.now()}.webp`;
    const outputPath = path.join(UPLOAD_DIR, filename);

    await sharp(buffer)
        .resize(200, 200, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(outputPath);

    // URL path to store in DB
    return `/uploads/avatars/${filename}`; 
};