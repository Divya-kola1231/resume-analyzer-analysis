import React, { useState } from "react";
import axios from "axios";

const EXPERIENCE_LEVELS = [
  { label: "Fresher (0-1 years)", emoji: "🌱" },
  { label: "Junior (1-3 years)", emoji: "🚀" },
  { label: "Mid-level (3-5 years)", emoji: "💼" },
  { label: "Senior (5+ years)", emoji: "🏆" },
];

function UploadResume() {
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [suggestedRoles, setSuggestedRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Analyze resume
  const handleAnalyze = async () => {
    if (!resume) { setError("Please select a resume file."); return; }
    setError("");
    setSkills([]);
    setSuggestedRoles([]);
    setSelectedRoles([]);
    setSelectedExperience("");
    setMatchingJobs([]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/analyze/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const raw = response.data.analysis || "";
      const parsed = raw.split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
      setSkills(parsed);
      setSuggestedRoles(response.data.suggested_roles || []);
    } catch {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role) =>
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );

  const canFindJobs = selectedRoles.length > 0 && selectedExperience !== "";

  // Step 2: Fetch jobs
  const handleFetchJobs = async () => {
    if (!canFindJobs) {
      setError("Please select at least one role and an experience level.");
      return;
    }
    setError("");
    setMatchingJobs([]);
    setLoadingJobs(true);

    try {
      const responseJobs = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/jobs/`,
        { roles: selectedRoles, location: "India", experience: selectedExperience },
        { headers: { "Content-Type": "application/json" } }
      );
      setMatchingJobs(responseJobs.data.jobs || []);
    } catch {
      setError("Failed to fetch job openings. Please try again.");
    } finally {
      setLoadingJobs(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📄 Resume Analyzer</h2>

      {/* Upload */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <input type="file" accept=".pdf,.docx" onChange={(e) => setResume(e.target.files[0])} style={{ fontSize: 14 }} />
        <button onClick={handleAnalyze} disabled={loading} style={primaryBtn}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && <p style={{ color: "#c62828", marginBottom: 16, fontSize: 14 }}>{error}</p>}

      {/* Skills */}
      {skills.length > 0 && (
        <section style={sectionStyle}>
          <h3 style={subHeadingStyle}>📋 Skills Found</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map((skill, i) => (
              <span key={i} style={tagStyle}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Role Checklist + Experience Selector */}
      {suggestedRoles.length > 0 && (
        <section style={sectionStyle}>
          <h3 style={subHeadingStyle}>✅ Suggested Roles Based on Your Resume</h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>
            Select roles and your experience level to find matching jobs.
          </p>

          {/* Role checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {suggestedRoles.map((role, i) => {
              const checked = selectedRoles.includes(role);
              return (
                <label
                  key={i}
                  onClick={() => toggleRole(role)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                    background: checked ? "#e8f5e9" : "#fff",
                    border: checked ? "1.5px solid #2e7d32" : "1.5px solid #e0e0e0",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                    border: checked ? "2px solid #2e7d32" : "2px solid #bdbdbd",
                    background: checked ? "#2e7d32" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}>
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 15, color: checked ? "#1b5e20" : "#333", fontWeight: checked ? 600 : 400 }}>
                    {role}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Experience Level Selector */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#333" }}>
              🎓 Select Your Experience Level
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {EXPERIENCE_LEVELS.map(({ label, emoji }) => {
                const selected = selectedExperience === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedExperience(label)}
                    style={{
                      padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      background: selected ? "#1565c0" : "#fff",
                      border: selected ? "2px solid #1565c0" : "2px solid #e0e0e0",
                      color: selected ? "#fff" : "#333",
                      fontSize: 14, fontWeight: selected ? 600 : 400,
                      transition: "all 0.15s ease",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hint messages */}
          {selectedRoles.length > 0 && !selectedExperience && (
            <p style={{ fontSize: 12, color: "#e65100", marginBottom: 10 }}>
              ⚠️ Please also select an experience level to find jobs.
            </p>
          )}
          {selectedRoles.length === 0 && selectedExperience && (
            <p style={{ fontSize: 12, color: "#e65100", marginBottom: 10 }}>
              ⚠️ Please also select at least one role to find jobs.
            </p>
          )}

          {/* Find Jobs Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={handleFetchJobs}
              disabled={loadingJobs || !canFindJobs}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: canFindJobs ? "#2e7d32" : "#bdbdbd",
                color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: canFindJobs ? "pointer" : "not-allowed",
                transition: "background 0.15s ease",
              }}
            >
              {loadingJobs ? "Fetching Jobs..." : "Find Jobs →"}
            </button>

            {canFindJobs && (
              <span style={{ fontSize: 13, color: "#555" }}>
                {selectedRoles.length} role{selectedRoles.length > 1 ? "s" : ""} · {selectedExperience}
              </span>
            )}
          </div>
        </section>
      )}

      {/* Job Results */}
      {matchingJobs.length > 0 && (
        <section style={sectionStyle}>
          <h3 style={subHeadingStyle}>💼 Job Openings for You</h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>
            Showing {matchingJobs.length} jobs · {selectedExperience}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {matchingJobs.map((job) => (
              <div key={job.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>{job.title}</div>
                  <span style={expBadgeStyle}>{job.experience}</span>
                </div>
                <div style={{ color: "#555", fontSize: 14 }}>{job.company} · {job.location}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>{job.type}</div>
                {job.description && (
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 8, lineHeight: 1.5 }}>
                    {job.description}
                  </div>
                )}
                <a href={job.link} target="_blank" rel="noreferrer"
                  style={{ color: "#1565c0", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
                  View &amp; Apply →
                </a>
              </div>
            ))}
          </div>
          
        </section>
      )}

      {matchingJobs.length === 0 && !loadingJobs && canFindJobs && !error && (
        <p style={{ color: "#888", fontStyle: "italic", fontSize: 14 }}>
          No job openings found. Try selecting different roles or experience level.
        </p>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const containerStyle = {
  maxWidth: 700, margin: "40px auto",
  fontFamily: "'Segoe UI', sans-serif", padding: "0 20px", color: "#1a1a2e",
};
const headingStyle = {
  fontSize: 26, fontWeight: 700, marginBottom: 24,
  borderBottom: "2px solid #e3f2fd", paddingBottom: 12,
};
const subHeadingStyle = { fontSize: 17, fontWeight: 600, marginBottom: 12 };
const sectionStyle = {
  marginBottom: 28, padding: "18px 20px",
  background: "#fafafa", borderRadius: 12, border: "1px solid #e8eaf6",
};
const tagStyle = {
  background: "#e3f2fd", border: "1px solid #90caf9",
  borderRadius: 16, padding: "4px 12px", fontSize: 13, color: "#1565c0",
};
const cardStyle = {
  border: "1px solid #e0e0e0", borderRadius: 10,
  padding: "14px 16px", background: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};
const expBadgeStyle = {
  fontSize: 11, fontWeight: 600, padding: "3px 10px",
  borderRadius: 20, background: "#e8f5e9", color: "#2e7d32",
  border: "1px solid #a5d6a7", whiteSpace: "nowrap", marginLeft: 8,
};
const primaryBtn = {
  padding: "9px 22px", background: "#1565c0", color: "#fff",
  border: "none", borderRadius: 8, cursor: "pointer",
  fontSize: 14, fontWeight: 600, letterSpacing: 0.3,
};

export default UploadResume;