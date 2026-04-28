import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_-]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxlength: 254
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    country: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    avatarUrl: {
        type: String,
        default: null
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
