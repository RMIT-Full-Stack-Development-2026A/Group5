import mongoose from 'mongoose';
import COUNTRIES  from '../../../config/countries.js';
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
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player',
    },
    country: {
        type: String,
        enum: COUNTRIES,
        default: null,
    },
    avatarUrl: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
})

export default mongoose.model('Player', playerSchema);