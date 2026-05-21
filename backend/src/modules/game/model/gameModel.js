import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
    moveNumber: { type: Number, required: true },
    player: { type: String, required: true },
    marker: { type: String, required: true },
    index: { type: Number, required: true },
    position: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});


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


const gameSchema = new mongoose.Schema({
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
        required: true
    },

    })

// Auto-increment gameNumber
gameSchema.pre('save', async function (next) {
    if (this.isNew) {
        const last = await this.constructor.findOne().sort({ gameNumber: -1 });
        this.gameNumber = last ? last.gameNumber + 1 : 1;
    }
});


export default mongoose.model('Game', gameSchema);