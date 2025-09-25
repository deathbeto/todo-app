import { Task } from '../models/Task.js';

export async function list(req, res) {
  const tasks = await Task.find({ userId: req.user.sub }).sort({ createdAt: -1 });
  res.json(tasks);
}

export async function create(req, res) {
  const task = await Task.create({
    userId: req.user.sub,
    title: req.body.title,
    done: false
  });
  res.status(201).json(task);
}

export async function update(req, res) {
  const { id } = req.params;
  const task = await Task.findOneAndUpdate(
    { _id: id, userId: req.user.sub },
    { $set: req.body, updatedAt: new Date() },
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'No encontrada' });
  res.json(task);
}

export async function remove(req, res) {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, userId: req.user.sub });
  if (!task) return res.status(404).json({ error: 'No encontrada' });
  res.status(204).send();
}
