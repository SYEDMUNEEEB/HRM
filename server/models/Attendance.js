const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date },
  status: { type: String, enum: ['Present', 'Absent'] },
  username: { type: String },
  role: { type: String, enum: [ 'Trainer', 'Trainee'], required: true },
  email: { type: String, unique: true },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
