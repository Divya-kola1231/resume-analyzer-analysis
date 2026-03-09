import React from "react";

function ResultPage({ result }) {

  return (
    <div>

      <h2>Resume Analysis Result</h2>

      <pre>
        {result}
      </pre>

    </div>
  );
}

export default ResultPage;