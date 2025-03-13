// App.jsx - Main App Structure with React Router
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";
import Register from "./Register";
import "../styles/App.css";
import "../styles/Dashboard.css";
import "../styles/Register.css";
import "../styles/SignIn.css";


const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Dashboard</Link>
        {!user && <Link to="/signin">Sign In</Link>}
        {!user && <Link to="/register">Register</Link>}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
      <Routes>
        <Route path="/signin" element={<SignIn setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
