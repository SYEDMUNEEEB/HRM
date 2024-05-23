// Trainer.js

import React, { useState } from 'react';
import axios from 'axios';

function Trainer() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    leaveData: { startDate: '', endDate: '' },
    attendanceData: { date: '', status: '' }
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leave', {
        username: formData.username,
        email: formData.email,
        startDate: formData.leaveData.startDate,
        endDate: formData.leaveData.endDate
      });
      setSuccessMessage('Your leave request is submitted successfully.');
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/attendance', {
        username: formData.username,
        email: formData.email,
        date: formData.attendanceData.date,
        status: formData.attendanceData.status
      });
      setSuccessMessage('Your attendance is marked successfully.');
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  const handleLeaveChange = (e) => {
    setFormData({ ...formData, leaveData: { ...formData.leaveData, [e.target.name]: e.target.value } });
  };

  const handleAttendanceChange = (e) => {
    setFormData({ ...formData, attendanceData: { ...formData.attendanceData, [e.target.name]: e.target.value } });
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Trainer</h1>
      <div className="space-y-6">
        <form onSubmit={handleLeaveSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.leaveData.startDate}
              onChange={handleLeaveChange}
              className="border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.leaveData.endDate}
              onChange={handleLeaveChange}
              className="border rounded-md px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600">Submit Leave</button>
        </form>
        <form onSubmit={handleAttendanceSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Date</label>
            <input
              type="date"
              name="date"
              value={formData.attendanceData.date}
              onChange={handleAttendanceChange}
              className="border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Status</label>
            <select
              name="status"
              value={formData.attendanceData.status}
              onChange={handleAttendanceChange}
              className="border rounded-md px-3 py-2"
              required
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600">Submit Attendance</button>
        </form>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
}

export default Trainer;
