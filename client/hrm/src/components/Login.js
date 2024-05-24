import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

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
      const { token, role } = res.data;

      console.log('Response:', res.data);
      console.log('Role:', role);

      // Store the token in localStorage or state management
      localStorage.setItem('token', token);

      // Redirect based on user role
      if (role === 'Admin') {
        navigate('/dashboard');
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
    <>
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="text-3xl font-bold text-center text-blue-700 mb-4">
          Human Resource Management System
        </div>
      </div>
      <section className="h-screen flex items-center justify-center">
        <div className="flex w-full max-w-4xl">
          <div className="w-1/2 flex items-center justify-center">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <form onSubmit={onSubmit} className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Login Page</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email address
                </label>
                <div className="flex items-center border rounded py-2 px-3">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center border rounded py-2 px-3">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="appearance-none border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-500 hover:text-blue-800">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
