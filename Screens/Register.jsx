// Register.jsx - Registration Page
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: formData.firstName });
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <label htmlFor="lastName">Last Name</label>
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <label htmlFor="dob">Date of Birth</label>
        <input type="date" name="dob" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/signin">Sign In</Link></p>
    </div>
  );
};

export default Register;