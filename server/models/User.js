const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Trainer', 'Trainee'], required: true },
  
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
