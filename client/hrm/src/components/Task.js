import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Task = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State to store the list of users

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });

  const { title, description, assignedTo } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ title, description, assignedTo });

    try {
      const res = await axios.post('http://localhost:5000/task/create', body, config);
      console.log(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Create Task</h1>
        <form onSubmit={(e) => onSubmit(e)} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={title}
              onChange={(e) => onChange(e)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description"
              name="description"
              value={description}
              onChange={(e) => onChange(e)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <select
              name="assignedTo"
              value={assignedTo}
              onChange={(e) => onChange(e)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select user...</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Task;
