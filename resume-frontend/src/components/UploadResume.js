import React, { useState } from "react";
import axios from "axios";

function UploadResume({ setResult }) {

  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
const handleSubmit = async () => {

  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("job_description", jd);

  const response = await axios.post(
    "http://127.0.0.1:8000/api/analyze/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log(response.data);
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
        onChange={(e) => setJd(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Analyze Resume
      </button>

    </div>
  );
}

export default UploadResume;