const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role // Include the user role in the payload
      }
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role }); // Send the token and role in the response
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Find the user by ID and delete it
    await User.findByIdAndDelete(userId);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// Create Leave Request
// Create Leave Request
router.post('/leave', async (req, res) => {
  const { startDate, endDate,username,email,role } = req.body;
  try {
    const leaveRequest = new LeaveRequest({ username,email,role,startDate, endDate, status: 'Pending' });
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Record Attendance
router.post('/attendance', async (req, res) => {
  const { username, email, date, status,role } = req.body;
  try {
    const attendance = new Attendance({ username, email, date, status,role });
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Leave Requests for a User
// Fetch all leaves for a user
router.get('/leaves', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.params.userId });
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all attendance records for a user
router.get('/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.userId });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update leave request status
router.put('/leave', async (req, res) => {
  const { status } = req.body;
  try {
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.leaveId,
      { status },
      { new: true }
    );
    res.json(leaveRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update attendance record status
router.put('/attendance', async (req, res) => {
  const { status } = req.body;
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.attendanceId,
      { status },
      { new: true }
    );
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete leave request
router.delete('/leave/:leaveId', async (req, res) => {
  try {
    await LeaveRequest.findByIdAndDelete(req.params.leaveId);
    res.json({ msg: 'Leave request deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete attendance record
router.delete('/attendance/:attendanceId', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.attendanceId);
    res.json({ msg: 'Attendance record deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Record Trainee Attendance
router.post('/trainee/attendance', async (req, res) => {
  const { date, status } = req.body;
  try {
    const attendance = new Attendance({ date, status });
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch Trainee Attendance
router.get('/trainee/attendance', async (req, res) => {
  try {
    const attendance = await TraineeAttendance.find();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Trainee Attendance
router.put('/trainee/attendance/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const attendance = await TraineeAttendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete Trainee Attendance
router.delete('/trainee/attendance/:id', async (req, res) => {
  try {
    await TraineeAttendance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Trainee attendance deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
