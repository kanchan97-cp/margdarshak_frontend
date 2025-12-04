import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SuccessStories from './components/SuccessStories';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Report from './components/Report';
import AIChat from './components/AIChat';
import AdminPanel from './components/AdminPanel';



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(atob(token.split('.')[1])));
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={
            user ? <Navigate to="/dashboard" /> : (
              <>
                <Hero />
                <HowItWorks />
                <SuccessStories />
                <SuccessStories />
              </>
            )
          } />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/quiz/:type" element={user ? <Quiz user={user} /> : <Navigate to="/login" />} />
          <Route path="/report" element={user ? <Report user={user} /> : <Navigate to="/login" />} />
          <Route path="/ai-chat" element={user ? <AIChat user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;