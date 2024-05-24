const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  username: { type: String },
  role: { type: String, enum: [ 'Trainer', 'Trainee'], required: true },
  email: { type: String, unique: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true }
});

const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema);

module.exports = LeaveRequest;
