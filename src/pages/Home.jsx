import { useState } from "react";
import RequestForm from "../components/RequestForm.jsx";
import ResultsTable from "../components/ResultTable.jsx";
import AnalysisReport from "../components/AnalysisReport.jsx";

function Home() {
  const [results, setResults] = useState(null);
  const [overallStatus, setOverallStatus] = useState(null);
  const [summary, setSummary] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleResult(result) {
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError(null);
    const { results, overallStatus, summary, suggestions } = result.data;
    setResults(results);
    setOverallStatus(overallStatus);
    setSummary(summary);
    setSuggestions(suggestions);
  }

  return (
    <div className="space-y-8">
      <RequestForm onResult={handleResult} onLoading={setLoading} />

      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-400 animate-pulse text-lg">
            ⏳ Running tests, please wait...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
          ❌ Error: {error}
        </div>
      )}

      {results && !loading && (
        <div className="space-y-8">
          <ResultsTable results={results} />
          <AnalysisReport
            overallStatus={overallStatus}
            summary={summary}
            suggestions={suggestions}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
