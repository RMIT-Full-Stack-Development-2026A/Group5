import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[a-zA-Z0-9_-]{3,20}$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player',
    },
    avatarUrl: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    premium: {
        type: Boolean,
        default: false,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);