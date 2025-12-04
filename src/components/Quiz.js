import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { questions } from '../data/questions';

function Quiz({ user }) {
  const { type } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const quizQuestions = questions[type] || [];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleOptionChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await API.post('/quizzes', { type, responses });
      setIsCompleted(true);
      // navigate('/dashboard'); // Removed immediate redirect
    } catch (err) {
      console.error("Failed to submit quiz", err);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  const handleRestart = () => {
    setResponses({});
    setCurrentQuestion(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="section text-center">
        <h2>Quiz Completed!</h2>
        <p>Your responses have been saved.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button className="btn btn-secondary" onClick={handleRestart}>Restart Quiz</button>
        </div>
      </div>
    );
  }

  if (!quizQuestions.length) return <div className="section">Quiz not found</div>;

  const question = quizQuestions[currentQuestion];

  return (
    <div className="section quiz-container">
      <div className="mb-2">
        <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Quiz</h2>
        <div style={{ background: '#e0e0e0', height: '10px', borderRadius: '5px', marginTop: '10px' }}>
          <div style={{ background: 'var(--primary)', width: `${progress}%`, height: '100%', borderRadius: '5px', transition: 'width 0.3s' }}></div>
        </div>
        <p className="text-center">Question {currentQuestion + 1} of {quizQuestions.length}</p>
      </div>

      <div className="question-card">
        <h3>{question.text}</h3>
        <div className="options">
          {question.options.map(opt => (
            <label key={opt} className="option-label" style={{
              borderColor: responses[question.id] === opt ? 'var(--primary)' : '#e0e0e0',
              backgroundColor: responses[question.id] === opt ? '#f0f7ff' : 'transparent'
            }}>
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={responses[question.id] === opt}
                onChange={() => handleOptionChange(question.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
        >
          Previous
        </button>
        <button
          className="btn"
          onClick={handleNext}
          disabled={!responses[question.id]}
          style={{ opacity: !responses[question.id] ? 0.5 : 1 }}
        >
          {currentQuestion === quizQuestions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default Quiz;