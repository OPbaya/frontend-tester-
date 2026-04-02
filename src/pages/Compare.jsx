import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { compareHistory } from "../services/api";

function Compare() {
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const id1 = searchParams.get("id1");
  const id2 = searchParams.get("id2");

  // Auto-run compare if IDs are in URL (coming from History page)
  useEffect(() => {
    if (id1 && id2) {
      fetchCompare(id1, id2);
    }
  }, [id1, id2]);

  async function fetchCompare(id1, id2) {
    setLoading(true);
    setError(null);
    const result = await compareHistory(id1, id2);
    if (result.success) {
      setReport(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  function getVerdictColor(verdict) {
    if (verdict.includes("Run 1")) return "text-blue-400";
    if (verdict.includes("Run 2")) return "text-purple-400";
    return "text-gray-400";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Compare Results</h2>
        <p className="text-gray-400 text-sm mt-1">
          {id1 && id2
            ? "Comparing two selected history entries"
            : "Go to History and select 2 entries to compare"}
        </p>
      </div>

      {/* No IDs state */}
      {!id1 && !id2 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">⚡</p>
          <p>No entries selected.</p>
          <p className="text-sm mt-1">
            Go to the History page, select 2 runs and click Compare.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-gray-400 animate-pulse">Comparing runs...</p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
          ❌ Error: {error}
        </div>
      )}

      {/* Compare Report */}
      {report && (
        <div className="space-y-4">
          {/* Verdict */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Overall Verdict</p>
            <p
              className={`text-2xl font-bold ${getVerdictColor(report.verdict)}`}
            >
              🏆 {report.verdict}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                Success Rate
              </p>
              <div className="flex justify-between mb-2">
                <span className="text-blue-400 text-sm">Run 1</span>
                <span className="text-white font-semibold">
                  {report.run1SuccessRate}%
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-purple-400 text-sm">Run 2</span>
                <span className="text-white font-semibold">
                  {report.run2SuccessRate}%
                </span>
              </div>
              <p className="text-gray-400 text-xs border-t border-gray-800 pt-3">
                {report.successRateResult}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                Avg Response Time
              </p>
              <div className="flex justify-between mb-2">
                <span className="text-blue-400 text-sm">Run 1</span>
                <span className="text-white font-semibold">
                  {report.run1AvgResponseTime}ms
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-purple-400 text-sm">Run 2</span>
                <span className="text-white font-semibold">
                  {report.run2AvgResponseTime}ms
                </span>
              </div>
              <p className="text-gray-400 text-xs border-t border-gray-800 pt-3">
                {report.responseTimeResult}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                Issues Found
              </p>
              <div className="flex justify-between mb-2">
                <span className="text-blue-400 text-sm">Run 1</span>
                <span className="text-white font-semibold">
                  {report.run1IssueCount}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-purple-400 text-sm">Run 2</span>
                <span className="text-white font-semibold">
                  {report.run2IssueCount}
                </span>
              </div>
              <p className="text-gray-400 text-xs border-t border-gray-800 pt-3">
                {report.issuesResult}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                Suggestions
              </p>
              <p className="text-gray-400 text-xs">
                {report.suggestionsResult}
              </p>
            </div>
          </div>

          {/* Status code changes */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
              Status Code Changes
            </p>
            <ul className="space-y-2">
              {report.statusCodeChanges.map((change, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-300 flex items-start gap-2"
                >
                  <span className="text-yellow-400 mt-0.5">→</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
