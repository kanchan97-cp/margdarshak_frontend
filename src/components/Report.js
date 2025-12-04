import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import API from "../utils/api";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(res.data);
    } catch {
      alert("Failed to load reports!");
    }
  };

  const generateReport = async () => {
    try {
      const res = await API.post("/reports/generate");
      setSelected(res.data);
      loadReports();
    } catch {
      alert("Please complete all quizzes first!");
    }
  };

  const generatePDF = (report) => {
    const doc = new jsPDF();
    doc.text(report.title, 10, 10);

    let y = 20;
    report.careers.forEach((careerObj, i) => {
      doc.text(`${i + 1}. ${careerObj.career}`, 10, y);
      y += 6;
      doc.text(`Why: ${careerObj.reason}`, 10, y);
      y += 8;
      careerObj.roadmap.forEach(step => {
        doc.text(`• ${step}`, 12, y);
        y += 6;
      });
      y += 6;
    });

    doc.save("Career_Report.pdf");
  };

  if (selected) {
    return (
      <div className="section">
        <button className="btn" onClick={() => setSelected(null)}>← Back</button>
        <h2>{selected.title}</h2>

        {selected.careers.map((c, i) => (
          <div key={i} className="card">
            <h3>{c.career}</h3>
            <p><strong>Why:</strong> {c.reason}</p>
            <h4>Roadmap:</h4>
            <ul>
              {c.roadmap.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        ))}

        <button className="btn" onClick={() => generatePDF(selected)}>
          Download PDF
        </button>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Your Career Reports</h2>
      <button className="btn" onClick={generateReport}>Generate Report</button>

      <div className="grid" style={{ marginTop: "20px" }}>
        {reports.map(r => (
          <div key={r._id} className="card">
            <h3>{r.title}</h3>
            <button className="btn" onClick={() => setSelected(r)}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
