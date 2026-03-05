import React, { useState } from "react";
import UploadResume from "./components/UploadResume";
import ResultPage from "./components/ResultPage";

function App() {

  const [result, setResult] = useState(null);

  return (

    <div>

      <h1>AI Resume Analyzer</h1>

      {result ? (
        <ResultPage data={result} />
      ) : (
        <UploadResume setResult={setResult} />
      )}

    </div>

  );
}

export default App;