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

  const Section = ({ title, children }) => (
    <>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <div style={styles.box}>{children}</div>
    </>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/report")}>
          ← Back to Reports
        </button>

        <h2 style={styles.title}>{report.title}</h2>
        <p style={styles.date}>Generated: {formatDate(report.createdAt)}</p>

        <Section title="Top Career Recommendations">
          {report.careers?.map((c, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <h4>{c.career || c.role}</h4>
              <p>{c.reason}</p>
            </div>
          ))}
        </Section>

        <Section title="Personalized Career Roadmap">
          <ul>
            {report.careers
              ?.flatMap((c) => c.roadmap || [])
              .map((step, i) => (
                <li key={i}>{step}</li>
              ))}
          </ul>
        </Section>

        <Section title="Soft Skills & Growth Tips">
          <p>Enhance communication, consistency, teamwork & practical projects.</p>
        </Section>

        <div style={styles.buttons}>
          <button
            style={{ ...styles.btn, background: "#0077ff" }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "50px 0",
    background: "linear-gradient(to bottom, #e9f1ff, #ffffff)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "92%",
    maxWidth: "900px",
    background: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  },
  backBtn: {
    background: "none",
    color: "#0b3d91",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    marginBottom: "18px",
  },
  title: { fontSize: "30px", fontWeight: "700" },
  date: { fontSize: "14px", color: "#555", marginBottom: "25px" },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "25px",
    marginBottom: "12px",
  },
  box: {
    background: "#f7faff",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #d0e0ff",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "35px",
  },
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

export default ReportDetails;
