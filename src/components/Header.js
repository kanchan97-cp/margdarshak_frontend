import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header>
      <Link to="/" className="logo">Margdarshak</Link>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/report">Reports</Link>
            <Link to="/ai-chat">AI Mentor</Link>
            <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Logout</button>
          </>
        ) : (
          <>

            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Get Started</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;