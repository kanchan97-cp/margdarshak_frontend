import React from 'react';

function HowItWorks() {
  const steps = [
    { title: '1. Sign Up', desc: 'Create your free account to get started.' },
    { title: '2. Take Quizzes', desc: 'Complete 5 fun and insightful assessments.' },
    { title: '3. Get Analysis', desc: 'Our AI analyzes your unique profile.' },
    { title: '4. View Roadmap', desc: 'Receive a personalized career path.' }
  ];

  return (
    <div className="section text-center">
      <h2 className="mb-2">How It Works</h2>
      <div className="grid">
        {steps.map((step, index) => (
          <div key={index} className="card">
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '1rem', opacity: '0.8' }}>{index + 1}</div>
            <h3>{step.title.split('. ')[1]}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;