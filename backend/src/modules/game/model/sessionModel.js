import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    playerSlot: {
        type: String,
        enum: ['player1', 'player2'],
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    notation: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });


const sessionSchema = new mongoose.Schema({
    gameNumber: {
        type: Number,
        unique: true,
        index: true,
    },
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        default: null,
    },
    player2Name: {
        type: String,
        default: null,
    },
    gameType: {
        type: String,
        enum: ['local', 'online', 'ai'],
        required: true,
    },
    aiLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: null,
    },
    boardSize: {
        type: String,
        enum: ['10x10', '15x15'],
        required: true,
    },
    boardStyle: {
        type: String,
        default: 'classic',
    },
    status: {
        type: String,
        enum: ['in_progress', 'finished', 'aborted'],
        default: 'in_progress',
    },
    result: {
        type: String,
        enum: ['player1', 'player2', 'draw', 'aborted'],
        default: null,
    },
    winLine: {
        type: [Number],
        default: [],
    },
    moves: {
        type: [moveSchema],
        default: [],
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
        default: null,
    },
});


sessionSchema.pre('save', async function () {
    if (this.isNew && this.gameNumber == null) {
        const last = await this.constructor
            .findOne()
            .sort({ gameNumber: -1 })
            .select('gameNumber');

        this.gameNumber = last && last.gameNumber ? last.gameNumber + 1 : 1;
    }
});


export default mongoose.model('GameSession', sessionSchema);
