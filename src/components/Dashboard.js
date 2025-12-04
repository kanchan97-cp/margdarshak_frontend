// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    API.get("/quizzes")
      .then((res) => {
        setQuizzes(res.data);

        const completedTypes = new Set(
          res.data.filter((q) => q.completed).map((q) => q.type)
        );

        setProgress((completedTypes.size / 5) * 100);
      })
      .catch((err) => console.error("❌ Quiz Load Error:", err));
  }, []);

  const quizTypes = [
    { id: "orientation", label: "Orientation Style", desc: "Discover your work style." },
    { id: "interest", label: "Interest Profiler", desc: "What do you love to do?" },
    { id: "aptitude", label: "Aptitude Test", desc: "Test your logical skills." },
    { id: "personality", label: "Personality Assessment", desc: "Understand who you are." },
    { id: "emotional", label: "Emotional Intelligence", desc: "Handle emotions smartly." }
  ];

  const isCompleted = (type) =>
    quizzes.some((q) => q.type === type && q.completed);

  const restartQuiz = async (type) => {
    if (!window.confirm("🔁 Restart this quiz? Answers will be erased!")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${process.env.REACT_APP_API_BASE_URL ||
        "https://margdarshak-backend-t6y6.onrender.com"}/api/quizzes/reset/${type}/reset`,
        {
          method: "PATCH",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      // ✨ Update UI without logging out
      setQuizzes((prev) =>
        prev.map((q) =>
          q.type === type ? { ...q, completed: false, responses: {} } : q
        )
      );

      alert("✔ Quiz restarted successfully!");
    
    } catch (error) {
      console.error("Restart Quiz Error:", error);
      alert("Failed to restart quiz");
    }
  };

  const generateReport = async () => {
    if (loadingReport) return;
    setLoadingReport(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ||
        "https://margdarshak-backend-t6y6.onrender.com"}/api/reports/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "⚠ Please complete all quizzes first!");
        setLoadingReport(false);
        return;
      }

      const report = await res.json();
      navigate(`/report/${report._id}`);

    } catch (err) {
      console.error("Report Generation Error:", err);
      alert("❌ Failed to generate report!");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="section">
      <div className="mb-2">
        <h2>Welcome back, {user.name}!</h2>
        <p>You are {progress}% closer to discovering your career path.</p>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid">
        {quizTypes.map((type) => (
          <div
            key={type.id}
            className={`card ${isCompleted(type.id) ? "card-border-secondary" : "card-border-primary"}`}
          >
            <h3>{type.label}</h3>
            <p>{type.desc}</p>

            <button
              className="btn"
              disabled={isCompleted(type.id)}
              onClick={() => navigate(`/quiz/${type.id}`)}
            >
              {isCompleted(type.id) ? "Completed" : "Start Quiz"}
            </button>

            {isCompleted(type.id) && (
              <button
                className="btn btn-danger"
                style={{ marginTop: "8px" }}
                onClick={() => restartQuiz(type.id)}
              >
                🔁 Restart Quiz
              </button>
            )}
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-2 text-center">
          <h3>🎯 You've completed all assessments!</h3>

          <button
            className="btn"
            style={{ fontSize: "1.1rem", marginTop: "1rem" }}
            onClick={generateReport}
            disabled={loadingReport}
          >
            {loadingReport ? "⏳ Generating Report..." : "🚀 Generate Your Career Report"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
