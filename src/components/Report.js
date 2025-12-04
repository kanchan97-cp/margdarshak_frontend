// src/components/Report.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://margdarshak-backend-t6y6.onrender.com";

const Report = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      console.log("Reports API Response:", data);

      setReports(Array.isArray(data) ? data : []); // ← IMPORTANT FIX
    } catch (err) {
      console.error("Fetch Reports Error:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    const confirmDelete = window.confirm("🛑 Confirm delete permanently?");
    if (!confirmDelete) return;

    const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setReports((prev) => prev.filter((report) => report._id !== id));
      alert("✔ Report deleted");
    } else {
      alert("❌ Delete failed");
    }
  };

  if (loading)
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  const styles = {
    wrapper: {
      padding: "40px",
      background: "#eef5ff",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      background: "#fff",
      padding: "18px",
      borderRadius: "14px",
      marginBottom: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
    btn: {
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
      border: "none",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ width: "85%", maxWidth: "900px" }}>
        <h2 style={{ marginBottom: "20px" }}>📊 Your Reports</h2>

        {reports.length === 0 ? (
          <p>No reports yet</p>
        ) : (
          reports.map((report) => (
            <div style={styles.card} key={report._id}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/report/${report._id}`)}
              >
                <h3>{report.title || "Career Report"}</h3>
                <p>{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{ ...styles.btn, background: "#0077ff", color: "#fff" }}
                  onClick={() => navigate(`/report/${report._id}`)}
                >
                  View
                </button>
                <button
                  style={{ ...styles.btn, background: "#e63946", color: "#fff" }}
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
