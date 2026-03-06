import React, { useState } from "react";
import axios from "axios";

function UploadResume({ setResult }) {

  const [resume, setResume] = useState(null);
  const [jd, setJD] = useState("");

  const handleSubmit = async () => {

    if (!resume) {
      alert("Please upload a resume");
      return;
    }

    try {

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jd);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/analyze/",
        formData
      );

      setResult(res.data);

    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    }
  };

  return (
    <div>

      <h2>Upload Resume</h2>

      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />

      <textarea
        placeholder="Paste Job Description"
        onChange={(e) => setJD(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Analyze Resume
      </button>

    </div>
  );
}

export default UploadResume;