const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose=require('mongoose')

// Create Task
router.post('/create', async (req, res) => {
  const { title, description, assignedTo } = req.body;
  try {
    const task = new Task({ title, description, assignedTo });
    await task.save();
    await User.findByIdAndUpdate(assignedTo, { $push: { tasks: task._id } });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Task Status
router.put('/update/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Retrieve Tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Retrieve Tasks Assigned to a Specific User
router.get('/tasks/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
