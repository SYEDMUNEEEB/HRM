import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      if (res.data.requiresAdminApproval) {
        toast.info('Registration successful! Please wait for admin approval.');
      } else {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          // Redirect to login page with role after successful registration
          navigate("/", { state: { role: role } }); 
        }, 3600); // Redirect after 3 seconds
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Registration failed. Please try again.');
    }
  };
  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="hidden lg:block w-1/2">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="w-full h-full object-cover"
          alt="Sample"
        />
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md lg:w-1/2">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-center border rounded py-2 px-3">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-2 px-3">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-2 px-3">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="flex items-center border rounded py-2 px-3">
            <FontAwesomeIcon icon={faUserShield} className="text-gray-400 mr-2" />
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            >
             
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
