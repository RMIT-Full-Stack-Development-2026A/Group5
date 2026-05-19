import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    // "Game ID - 0000001" in UI
    gameNumber: { type: Number, required: true, unique: true },

    // "Game Mode: Single / Two Players / Online Match"
    gameMode: { type: String, enum: ['single', 'two_player', 'online'], required: true },

    // "10 x 10" or "15 x 15"
    boardSize: { type: Number, enum: [10, 15], default: 10 },

    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // For single player: store AI bot name as string; for multiplayer: ObjectId ref
    player2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    player2Name: { type: String, default: null }, // "Opponent: name or AI mode"

    winner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // "Status: Won / Lost / Aborted"
    result: { type: String, enum: ['win', 'lose', 'draw', 'aborted'], required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },

    // Replay Feature
    moves: [{
        player: { type: String }, // 'player1' | 'player2'
        position: { type: String }, // algebraic notation e.g. "c2"
        timestamp: { type: Date },
    }],
}, 

{ timestamps: true });   

// Auto-increment gameNumber
gameSchema.pre('save', async function (next) {
    if (this.isNew) {
        const last = await this.constructor.findOne().sort({ gameNumber: -1 });
        this.gameNumber = last ? last.gameNumber + 1 : 1;
    }
    next();
});

export default mongoose.model('Game', gameSchema);