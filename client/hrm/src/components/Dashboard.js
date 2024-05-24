import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faTasks, faUserCheck, faCheck,faTimes,faClipboardList, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ArcElement } from "chart.js";
import ChartJS from 'chart.js/auto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
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

    const notifySuccess = (message) => {
        toast.success(message);
    };

    const notifyError = (message) => {
        toast.error(message);
    };

    const acceptLeave = async (leave) => {
        try {
            await axios.put(`http://localhost:5000/api/leave`, { status: 'accepted' });
            setLeaves(leaves.map(l => l._id === leave._id ? { ...l, status: 'accepted' } : l));
            notifySuccess('Leave request accepted successfully.');
        } catch (error) {
            console.error('Error accepting leave:', error);
            notifyError('Failed to accept leave request.');
        }
    };
    const rejectLeave = async (leave) => {
      try {
          await axios.put(`http://localhost:5000/api/leave`, { status: 'rejected' });
          setLeaves(leaves.map(l => l._id === leave._id ? { ...l, status: 'rejected' } : l));
          notifySuccess('Leave request rejected successfully.');
      } catch (error) {
          console.error('Error rejecting leave:', error);
          notifyError('Failed to reject leave request.');
      }
  };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
            notifySuccess('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            notifyError('Failed to delete user.');
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            await axios.put(`http://localhost:5000/task/update/${taskId}`, { status });
            setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
            notifySuccess('Task status updated successfully.');
        } catch (error) {
            console.error('Error updating task status:', error);
            notifyError('Failed to update task status.');
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

    const taskCompletionPercentage = {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
            {
                label: 'Task Completion',
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

    const attendanceStatusCounts = attendance.reduce((acc, entry) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1;
        return acc;
    }, {});

    const attendancePercentage = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                label: 'Attendance Status',
                backgroundColor: ['#4CAF50', '#F44336'],
                borderColor: '#000',
                borderWidth: 1,
                hoverBackgroundColor: ['#4CAF50', '#F44336'],
                hoverBorderColor: '#000',
                data: [
                    attendanceStatusCounts['present'] || 0,
                    attendanceStatusCounts['absent'] || 0
                ]
            }
        ]
    };

    const attendanceWithUserDetails = attendance.map(entry => {
        const user = users.find(user => user._id === entry.userId);
        return { ...entry, ...user };
    });

    const leavesWithUserDetails = leaves.map(leave => {
        const user = users.find(user => user._id === leave.userId);
        return { ...leave, ...user };
    });

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <ToastContainer />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faUserCheck} className="mr-3" />
                        HR Admin Dashboard
                    </h1>
                    <Link to="/task" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create Task
                    </Link>
                    <input
                        type="text"
                        placeholder="Search users and tasks..."
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                            Task Status
                        </h2>
                        <Pie data={taskCompletionPercentage} />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            Users
                        </h2>
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">User Role</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="border px-4 py-2">{user.name}</td>
                                        <td className="border px-4 py-2">{user.email}</td>
                                        <td className="border px-4 py-2">{user.role}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => deleteUser(user._id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faTasks} className="mr-2" />
                            Tasks
                        </h2>
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Title</th>
                                    <th className="px-4 py-2 border">Description</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Actions</th>
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
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
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

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                            Attendance
                        </h2>
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Role</th>
                                    <th className="px-4 py-2 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceWithUserDetails.map((entry) => (
                                    <tr key={entry._id}>
                                        <td className="border px-4 py-2">{entry.username}</td>
                                        <td className="border px-4 py-2">{entry.email}</td>
                                        <td className="border px-4 py-2">{entry.role}</td>
                                        <td className="border px-4 py-2">{entry.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4 flex items-center">
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        Leaves
    </h2>
    <ul>
        {leavesWithUserDetails.map((leave) => (
            <li key={leave._id} className="border-b py-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <div className="text-lg font-bold mb-1">
                        Username: {leave.username}
                    </div>
                    <div className="text-gray-600 text-sm">
                        Email: {leave.email}
                    </div>
                    <div className="text-gray-600 text-sm">
                        User Role: {leave.role}
                    </div>
                    <div className="text-gray-600 text-sm">
                        {leave.startDate} to {leave.endDate}
                    </div>
                </div>
                <div className="flex">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                        onClick={() => acceptLeave(leave)}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        onClick={() => rejectLeave(leave)} // Implement rejectLeave function
                    >
                        Reject
                    </button>
                </div>
            </li>
        ))}
    </ul>
</div>




                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            Recent Tasks
                        </h2>
                        <ul>
                            {tasks.slice(0, 5).map((task) => (
                                <li key={task._id} className="border-b py-2">
                                    <div className="font-bold">{task.title}</div>
                                    <div>{task.description}</div>
                                    <div>Status: {task.status}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            Upcoming Leaves
                        </h2>
                        <ul>
                            {leaves.slice(0, 5).map((leave) => (
                                <li key={leave._id} className="border-b py-2">
                                    <div>
                                        {leave.startDate} to {leave.endDate} - {leave.name} ({leave.email}, {leave.role})
                                    </div>
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                                        onClick={() => acceptLeave(leave)}
                                    >
                                        Accept
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            User Attendance Statistics
                        </h2>
                        <Bar
                            data={{
                                labels: Object.keys(attendanceStatusCounts),
                                datasets: [{
                                    label: 'Attendance Count',
                                    backgroundColor: '#4CAF50',
                                    borderColor: '#000',
                                    borderWidth: 1,
                                    hoverBackgroundColor: '#4CAF50',
                                    hoverBorderColor: '#000',
                                    data: Object.values(attendanceStatusCounts)
                                }]
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
