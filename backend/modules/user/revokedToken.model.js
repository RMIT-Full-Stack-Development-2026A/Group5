import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    jti:       { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-cleanup

export default mongoose.model('RevokedToken', schema);
