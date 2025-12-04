// src/components/Report.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://margdarshak-backend-t6y6.onrender.com";

const Report = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  // Fetch Reports
  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Delete Report
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "🛑 This report will be permanently deleted! Continue?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("❌ Failed to delete report. Try again.");
      return;
    }

    setReports((prev) => prev.filter((r) => r._id !== id));
    alert("✔ Report deleted successfully!");
  };

  const styles = {
    wrapper: {
      padding: "50px 20px",
      background: "linear-gradient(to bottom, #e9f1ff, #ffffff)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    heading: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#0b3d91",
      marginBottom: "25px",
    },
    cardList: { width: "90%", maxWidth: "850px" },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "14px",
      marginBottom: "12px",
      boxShadow: "0 5px 12px rgba(0,0,0,0.12)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentBox: { cursor: "pointer" },
    title: { fontSize: "19px", fontWeight: "600" },
    date: { fontSize: "14px", color: "#677" },
    btnContainer: { display: "flex", gap: "10px" },
    viewBtn: {
      background: "#1565ff",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },
    restartBtn: {
      background: "#ff9800",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },
    deleteBtn: {
      background: "#e63946",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>📊 Your Career Reports</h2>

      <div style={styles.cardList}>
        {reports.length < 1 ? (
          <p>No reports yet</p>
        ) : (
          reports.map((report) => (
            <div style={styles.card} key={report._id}>
              <div
                style={styles.contentBox}
                onClick={() => navigate(`/report/${report._id}`)}
              >
                <h4 style={styles.title}>{report.title}</h4>
                <p style={styles.date}>
                  Generated: {formatDate(report.createdAt)}
                </p>
              </div>

              <div style={styles.btnContainer}>
                <button
                  style={styles.viewBtn}
                  onClick={() => navigate(`/report/${report._id}`)}
                >
                  View
                </button>

                {/* Restart Quiz Button Added */}
                <button
                  style={styles.restartBtn}
                  onClick={() =>
                    navigate(`/quiz/${report.quizAnswers?.[0]?.type}`, {
                      state: { quizType: report.quizAnswers?.[0]?.type },
                    })
                  }
                >
                  Restart
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(report._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Report;
