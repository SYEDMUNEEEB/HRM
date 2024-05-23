import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { ArcElement } from "chart.js";
import ChartJS from 'chart.js/auto';

ChartJS.register(ArcElement);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        const tasksResponse = await axios.get('http://localhost:5000/task/tasks');
        const attendanceResponse = await axios.get('http://localhost:5000/api/attendance');
        const leavesResponse = await axios.get('http://localhost:5000/api/leaves');

        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setAttendance(attendanceResponse.data);
        setLeaves(leavesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const acceptLeave = async (leave) => {
    try {
      // Implement the logic to accept the leave request
      // For example, you can make an API call to update the leave status
      await axios.put(`http://localhost:5000/api/leave`, { status: 'accepted' });
      // Update the leaves locally to reflect the accepted leave
      setLeaves(leaves.filter(l => l !== leave));
      // Show a message indicating that the leave request is accepted
      alert('Your leave request has been accepted.');
    } catch (error) {
      console.error('Error accepting leave:', error);
    }
  };
  
  
  
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/task/update/${taskId}`, { status });
      // Update task status locally
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Task Status',
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: '#000',
        borderWidth: 1,
        hoverBackgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverBorderColor: '#000',
        data: [
          taskStatusCounts['completed'] || 0,
          taskStatusCounts['in-progress'] || 0,
          taskStatusCounts['pending'] || 0
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <input
            type="text"
            placeholder="Search users and tasks..."
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Task Status</h2>
          <Pie data={chartData} />
        </div>
    

<div className="bg-white p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-bold mb-4">Leaves</h2>
  <ul>
    {leaves.map((leave) => (
      <li key={leave} className="flex justify-between items-center border-b py-2">
        <div>
          {leave.startDate} to {leave.endDate}
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => acceptLeave(leave)} // You need to implement this function
        >
          Accept
        </button>
      </li>
    ))}
  </ul>
</div>
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td className="border px-4 py-2">{task.title}</td>
                    <td className="border px-4 py-2">{task.description}</td>
                    <td className="border px-4 py-2">{task.status}</td>
                    <td className="border px-4 py-2">
                      {task.status !== 'completed' && (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                          onClick={() => updateTaskStatus(task._id, 'completed')}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-bold mb-4">Attendance</h2>
  <ul className="grid grid-cols-3 gap-4">
  {attendance.map((entry) => (
    <li key={entry._id} className="border p-2 rounded-md">
      <div className="font-bold">{entry.date}</div>
      <div>Status: {entry.status}</div>
      <div>User: {entry.username}</div>
      <div>Email: {entry.email}</div>
    </li>
  ))}
</ul>

</div>

      </div>
    </div>
  );
};

export default Dashboard;
