import React from "react";

function ResultPage({ data }) {

  return (
    <div>

      <h2>Resume Score</h2>
      <h1>{data.score}%</h1>

      <h3>Missing Skills</h3>

      <ul>
        {data.missing_skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      <h3>Recommendations</h3>

      <p>{data.recommendations}</p>

    </div>
  );
}

export default ResultPage;