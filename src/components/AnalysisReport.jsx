function AnalysisReport({ overallStatus, summary, suggestions }) {
  if (!overallStatus) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Analysis Report</h2>

      {/* Overall Status */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Overall Status
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            overallStatus === "GOOD"
              ? "bg-green-900/50 text-green-400 border border-green-800"
              : "bg-red-900/50 text-red-400 border border-red-800"
          }`}
        >
          {overallStatus === "GOOD" ? "✅ GOOD" : "⚠️ ISSUE"}
        </span>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Summary
        </h3>
        <p className="text-gray-300">{summary}</p>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Suggestions
        </h3>
        {suggestions && suggestions.length > 0 ? (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-yellow-900/20 border border-yellow-800/50 text-yellow-300 px-4 py-2 rounded-lg text-sm"
              >
                💡 {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-400 text-sm">
            No suggestions. API looks good!
          </p>
        )}
      </div>
    </div>
  );
}

export default AnalysisReport;
