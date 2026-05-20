import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    // "Game ID - 0000001" in UI
    gameID: {
        type: Number,
        required: true,
        unique: true,
    },
    player1: {
        type: String,
        required: true,
    },
    player2: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        enum: ['player1', 'player2', 'draw', 'aborted'],
        required: true,
    },
    moves: [
        {
            index: {
                type: Number,
                required: true,
            },
            player: {
                type: String,
                enum: ['player1', 'player2'],
                required: true,
            },
            position: {
                type: Number,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    gameType: {
        type: String,
        enum: ['local', 'online', 'ai'],
        required: true,
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
    next();
});

export default mongoose.model('Game', gameSchema);