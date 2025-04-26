// Dashboard.jsx - Dashboard Page with Time-based Greeting and Live Clock
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import WearableIntegration from "./WearableIntegration";

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <img
          src="https://via.placeholder.com/80"
          alt="User Avatar"
          className="profile-avatar"
        />
        <h1>{getTimeGreeting()} {user ? user.name : "Guest"}</h1>
        <p>Current Time: {currentTime}</p>
        <p>This is your healthcare dashboard where you can view your health records.</p>
      </div>
      
      <WearableIntegration />
    </div>
  );
};

export default Dashboard;


