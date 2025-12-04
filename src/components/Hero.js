import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="hero">
      <div className="container">
        <h1>Discover Your True Potential</h1>
        <p>Margdarshak uses AI-driven insights to guide you towards the perfect career path based on your unique skills, interests, and personality.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/signup">
            <button className="btn" style={{ background: 'var(--white)', color: 'var(--primary)' }}>Get Started Free</button>
          </Link>
          <button className="btn btn-secondary" style={{ color: 'var(--white)', borderColor: 'var(--white)' }}>Learn More</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;