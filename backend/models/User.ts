import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  avatar: { type: String },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  strikes: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);