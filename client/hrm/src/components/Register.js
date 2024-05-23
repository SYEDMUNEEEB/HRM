import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Trainee' // Default role set to Trainee
  });

  const { name, email, password, role } = formData;

  const onChange = (e) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ name, email, password, role });

    try {
      const res = await axios.post('http://localhost:5000/api/register', body, config);
      console.log('Response:', res); // Log the response object
      console.log('Response Data:', res.data); 
        
      // Log the data property of the response
    console.log(body)
      navigate("/");
    } catch (err) {
      console.error('Error:', err); // Log any error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
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
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="Admin">Admin</option>
              <option value="Trainer">Trainer</option>
              <option value="Trainee">Trainee</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
