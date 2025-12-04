import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
function Dashboard({ user }) {
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    API.get('/quizzes').then(res => {
      setQuizzes(res.data);
      // Calculate progress based on unique completed quizzes
      const completedTypes = new Set(res.data.filter(q => q.completed).map(q => q.type));
      setProgress((completedTypes.size / 5) * 100);
    }).catch(err => console.error(err));
  }, []);
  const quizTypes = [
    { id: 'orientation', label: 'Orientation Style', desc: 'Discover your work style.' },
    { id: 'interest', label: 'Interest Profiler', desc: 'What do you love to do?' },
    { id: 'aptitude', label: 'Aptitude Test', desc: 'Test your logical skills.' },
    { id: 'personality', label: 'Personality Assessment', desc: 'Understand who you are.' },
    { id: 'emotional', label: 'Emotional Intelligence', desc: 'How do you handle emotions?' }
  ];
  const isCompleted = (type) => quizzes.some(q => q.type === type && q.completed);
  return (
    <div className="section">
      <div className="mb-2">
        <h2>Welcome back, {user.name}!</h2>
        <p>You are {progress}% closer to your career path.</p>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="grid">
        {quizTypes.map(type => (
          <div key={type.id} className={`card ${isCompleted(type.id) ? 'card-border-secondary' : 'card-border-primary'}`}>
            <h3>{type.label}</h3>
            <p>{type.desc}</p>
            {isCompleted(type.id) ? (
              <button className="btn btn-secondary" disabled>Completed</button>
            ) : (
              <Link to={`/quiz/${type.id}`}><button className="btn">Start Quiz</button></Link>
            )}
          </div>
        ))}
      </div>
      {progress === 100 && (
        <div className="mt-2 text-center">
          <h3>Congratulations! You've completed all assessments.</h3>
          <Link to="/report"><button className="btn" style={{ fontSize: '1.2rem' }}>Generate Your Career Report</button></Link>
        </div>
      )}
    </div>
  );
}
export default Dashboard;