// src/components/ReportDetails.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://margdarshak-backend-t6y6.onrender.com";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReport(data.find((r) => r._id === id));
    };
    fetchData();
  }, [id]);

  if (!report) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const deleteReport = async () => {
    const confirmDelete = window.confirm("🛑 Confirm permanent deletion?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("✔ Report deleted");
      navigate("/report");
    } else {
      alert("❌ Failed to delete report");
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");

  const styles = {
    page: {
      padding: "60px 20px",
      background: "linear-gradient(to bottom, #eef5ff, #ffffff)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
    },
    container: {
      width: "95%",
      maxWidth: "920px",
      background: "#fff",
      padding: "35px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
    backBtn: {
      background: "none",
      color: "#1155cc",
      fontWeight: "600",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      marginBottom: "15px",
    },
    title: { fontSize: "26px", fontWeight: "700", marginBottom: "8px" },
    date: { color: "#5d6d88", marginBottom: "20px" },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginTop: "28px",
      marginBottom: "10px",
    },
    box: {
      background: "#f6f9ff",
      padding: "15px",
      borderRadius: "12px",
      border: "1px solid #d6e2ff",
      marginBottom: "10px",
    },
    buttons: { display: "flex", gap: "12px", marginTop: "30px" },
    btn: {
      padding: "10px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
      color: "#fff",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/report")}>
          ← Back
        </button>

        <h2 style={styles.title}>{report.title}</h2>
        <p style={styles.date}>Generated: {formatDate(report.createdAt)}</p>

        <h3 style={styles.sectionTitle}>Career Recommendations</h3>
        {report.careers?.map((c, i) => (
          <div style={styles.box} key={i}>
            <h4>{c.career}</h4>
            <p>{c.reason}</p>
          </div>
        ))}

        <div style={styles.buttons}>
          <button
            style={{ ...styles.btn, background: "#28a745" }}
            onClick={() => window.print()}
          >
            Download
          </button>

          <button
            style={{ ...styles.btn, background: "#d90429" }}
            onClick={deleteReport}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
