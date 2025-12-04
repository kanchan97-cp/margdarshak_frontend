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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      console.warn("No ID found in URL");
      return;
    }

    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (!res.ok) throw new Error("❌ Failed to fetch report");
        const data = await res.json();

        setReport(data);

        // If AI is still generating parts of report → retry in few seconds
        if (
          (!data.topCareers || data.topCareers.length === 0) &&
          (!data.roadmap || data.roadmap.length === 0) &&
          (!data.conclusion || data.conclusion.trim() === "")
        ) {
          setTimeout(fetchReport, 3000);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const deleteReport = async () => {
    if (!window.confirm("🛑 Confirm deletion?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    if (res.ok) {
      alert("✔ Report Deleted");
      navigate("/report");
    }
  };

  const formatDate = (d) =>
    !d ? "Processing..." : new Date(d).toLocaleDateString("en-IN");

  if (loading || !report) {
    return (
      <div className="text-center" style={{ marginTop: "80px" }}>
        <h2>⏳ Preparing Your AI Career Report...</h2>
        <p>It may take 5–10 seconds based on analysis.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center" style={{ marginTop: "80px" }}>
        <h2>⚠ Error Loading Report</h2>
        <p>{error}</p>
        <button className="btn" onClick={() => navigate("/report")}>
          ← Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/report")}>
          ← Back to Reports
        </button>

        <h2 style={styles.title}>{report.title || "Career Report"}</h2>
        <p style={styles.date}>Generated: {formatDate(report.createdAt)}</p>

        {/* Careers */}
        <h3 style={styles.sectionTitle}>Top Career Recommendations</h3>
        <div style={styles.box}>
          {report.topCareers?.length ? (
            report.topCareers.map((c, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <strong>{c.careerName}</strong>
                <p>{c.whyFit}</p>
              </div>
            ))
          ) : (
            <p>Still analyzing...</p>
          )}
        </div>

        {/* Roadmap */}
        <h3 style={styles.sectionTitle}>Career Roadmap</h3>
        <div style={styles.box}>
          {report.roadmap?.length ? (
            <ul>
              {report.roadmap.map((step, i) => (
                <li key={i}>
                  {step.step} — <strong>{step.timeline}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Still preparing step-by-step plan...</p>
          )}
        </div>

        {/* Soft Skills */}
        <h3 style={styles.sectionTitle}>Soft Skills</h3>
        <div style={styles.box}>
          {report.softSkills?.length ? (
            <ul>
              {report.softSkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p>No soft skills yet...</p>
          )}
        </div>

        {/* Conclusion */}
        <h3 style={styles.sectionTitle}>Conclusion</h3>
        <div style={styles.box}>
          <p>{report.conclusion || "Evaluating best-fit careers..."}</p>
        </div>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button
            style={{ ...styles.btn, background: "#28a745" }}
            onClick={() => window.print()}
          >
            Download PDF
          </button>
          <button
            style={{ ...styles.btn, background: "#d90429" }}
            onClick={deleteReport}
          >
            Delete Report
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------- STYLES ------------------- */
const styles = {
  page: {
    padding: "40px 0",
    minHeight: "100vh",
    background: "#eef4ff",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "90%",
    maxWidth: "900px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
  },
  backBtn: {
    background: "none",
    color: "#0077ff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
  },
  title: { fontSize: "28px", fontWeight: "700" },
  date: { fontSize: "14px", color: "#444", marginBottom: "18px" },
  sectionTitle: { fontSize: "20px", fontWeight: "600", margin: "18px 0 10px" },
  box: {
    background: "#f8faff",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #cfe3ff",
  },
  buttons: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  btn: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ReportDetails;
