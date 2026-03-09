import React, { useState } from "react";
import UploadResume from "./components/UploadResume";
import ResultPage from "./components/ResultPage";

function App() {

  const [result, setResult] = useState("");

  return (
    <div>

      <UploadResume setResult={setResult} />

      {result && <ResultPage result={result} />}

    </div>
  );
}

export default App;