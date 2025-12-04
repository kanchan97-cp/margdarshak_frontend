import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/signup', { name, email, password });
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Try again.');
    }
  };

  return (
    <div className="section">
      <h2 className="text-center">Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="text-danger text-center">{error}</div>}
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn" type="submit">Sign Up</button>
        <p className="text-center">
          Already have an account? <Link to="/login" className="link-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;