import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Trainee' // Default role
  });

  const { email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('http://localhost:5000/api/login', body, config);
      const { token, role } = res.data; // Destructure the token and role from the response

      console.log('Response:', res.data);
      console.log('Role:', role);

      // Store the token in localStorage or state management
      localStorage.setItem('token', token);

      // Redirect based on user role
      if (role === 'Admin') {
        navigate('/task');
      } else if (role === 'Trainee') {
        navigate('/trainee');
      } else if (role === 'Trainer') {
        navigate('/trainer');
      }
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
     
          <div>
            <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Login
            </button>
          </div>
        </form>
        <p className="text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
