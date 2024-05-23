import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Task from './components/Task';
import Trainer from "./components/Trainer";
import Trainee from "./components/Trainee"
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task" element={<Task />} />
          <Route  path="/trainee" element={<Trainee/>} />
          <Route path="/trainer" element={<Trainer/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
