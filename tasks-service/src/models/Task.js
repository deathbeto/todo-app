import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model('Task', taskSchema);
