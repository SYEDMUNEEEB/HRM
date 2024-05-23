import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Trainee = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInProgress, setTaskInProgress] = useState(null);

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
      // Update task status locally
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
      if (newStatus === 'in-progress') {
        setTaskInProgress(taskId);
      } else {
        setTaskInProgress(null);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Trainee</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-gray-100 rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2">Title: {task.title}</h3>
            <p className="mb-2">Description: {task.description}</p>
            <p className="mb-2">Status: {task.status}</p>
            {task.status === 'pending' && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleSubmit(task._id, 'in-progress')}
              >
                Submit Your task
              </button>
            )}
            {task.status === 'in-progress' && (
              <>
                <p className="text-blue-500 font-semibold">Your task is in progress</p>
                {taskInProgress !== task._id && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={() => handleSubmit(task._id, 'completed')}
                  >
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
