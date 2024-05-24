import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';

function Attendance() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    attendanceData: { date: '', status: '' }
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date' || name === 'status') {
      setFormData({
        ...formData,
        attendanceData: { ...formData.attendanceData, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/attendance', {
        username: formData.username,
        email: formData.email,
        date: formData.attendanceData.date,
        status: formData.attendanceData.status,
        role: formData.role,
      });
      setSuccessMessage('Your attendance is marked successfully.');
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Mark Your Attendance</h1>
      <div className="space-y-6">
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
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Status</label>
            <select
              name="status"
              value={formData.attendanceData.status}
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
              required
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="flex items-center border rounded py-2 px-3 mt-4">
            <FontAwesomeIcon icon={faUserShield} className="text-gray-400 mr-2" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
              required
            >
              <option value="">Select Role</option>
          
              <option value="Trainer">Trainer</option>
              <option value="Trainee">Trainee</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600">Submit Attendance</button>
        </form>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
}

export default Attendance;
