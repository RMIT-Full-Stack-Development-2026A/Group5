import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
    moveNumber: { type: Number, required: true },
    player: { type: String, required: true },
    marker: { type: String, required: true },
    index: { type: Number, required: true },
    position: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const gameSchema = new mongoose.Schema({
    gameNumber: { type: Number, unique: true, index: true },
    roomNumber: { type: String, unique: true, default: () => `ROOM-${Date.now()}` },
    player1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    player2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: false },
    player1Name: { type: String, required: true },
    player2Name: { type: String, required: true },
    player1Avatar: { type: String, default: null },
    player2Avatar: { type: String, default: null },
    player1Marker: { type: String, required: true },
    player2Marker: { type: String, required: true },
    gameType: {
        type: String,
        enum: ['local', 'online', 'ai'],
        required: true,
    },
    boardSize: {
        type: String,
        enum: ['10x10', '15x15'],
        required: true,
    },
    boardStyle: {
        type: String,
        enum: ['classic', 'celestial', 'arcane'],
        default: 'classic',
    },
    result: {
        type: String,
        enum: ['player1', 'player2', 'draw', 'aborted', 'pending'],
        default: 'pending',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    moves: [moveSchema],
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
}, { timestamps: true });

gameSchema.pre('save', async function (next) {
    if (this.isNew) {
        const last = await this.constructor.findOne().sort({ gameNumber: -1 });
        this.gameNumber = last ? last.gameNumber + 1 : 1;
    }
    next();
});

export default mongoose.model('Game', gameSchema);
