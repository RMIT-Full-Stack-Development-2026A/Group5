import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '../../uploads/avatars');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Store in memory, then resize with sharp before saving
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Resize to 200x200 and save as webp
export const processAvatar = async (buffer, userId) => {
    const filename = `avatar_${userId}_${Date.now()}.webp`;
    const outputPath = path.join(UPLOAD_DIR, filename);

    await sharp(buffer)
        .resize(200, 200, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(outputPath);

    return `/uploads/avatars/${filename}`;
};
