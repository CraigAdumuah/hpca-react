import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

interface User {
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ThemeProvider>
      <Router>
        <nav className="navbar">
          <Link to="/">Dashboard</Link>
          {!user && <Link to="/signin">Sign In</Link>}
          {!user && <Link to="/register">Register</Link>}
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 