import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Trainee = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInProgress, setTaskInProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/task/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/task/update/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
      if (newStatus === 'in-progress') {
        setTaskInProgress(taskId);
      } else {
        setTaskInProgress(null);
      }
      if (newStatus === 'completed') {
        notifySuccess('Task completed successfully');
      } else {
        notifySuccess('Task status updated');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      notifyError('Failed to update task status');
    }
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome into Human Resouce management Trainee Dashboard</h1>
        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 hover:bg-green-600"
          onClick={() => navigate('/attendance')}
        >
          Mark Your Attendance
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Title: {task.title}</h3>
            <p className="text-gray-600 mb-4">Description: {task.description}</p>
            <p className="text-gray-600 mb-4">Status: {task.status}</p>
            {task.status === 'pending' && (
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 hover:bg-blue-600"
                onClick={() => handleSubmit(task._id, 'in-progress')}
              >
                <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                Submit Task
              </button>
            )}
            {task.status === 'in-progress' && (
              <>
                <p className="text-blue-500 font-semibold mt-4 mb-2">Task in progress</p>
                {taskInProgress !== task._id && (
                  <button
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 hover:bg-green-600"
                    onClick={() => handleSubmit(task._id, 'completed')}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Complete
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trainee;
