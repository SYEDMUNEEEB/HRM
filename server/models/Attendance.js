const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
