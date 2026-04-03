import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHistory, searchHistory, deleteHistory } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUrl, setSearchUrl] = useState("");
  const [selected, setSelected] = useState([]); // max 2 IDs for compare
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [selectedEntry, setSelectedEntry] = useState(null);

  // Load all history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    const result = await getAllHistory();
    if (result.success) {
      setHistory(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleSearch() {
    if (!searchUrl.trim()) {
      fetchHistory(); // reset to all if search is empty
      return;
    }
    setLoading(true);
    const result = await searchHistory(searchUrl.trim());
    if (result.success) {
      setHistory(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    await deleteHistory(id);
    setHistory(history.filter((h) => h.id !== id));
    setSelected(selected.filter((s) => s !== id));
  }

  // Handle checkbox selection — max 2
  function handleSelect(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= 2) return; // block more than 2
      setSelected([...selected, id]);
    }
  }

  // Navigate to compare page with selected IDs
  function handleCompare() {
    navigate(`/compare?id1=${selected[0]}&id2=${selected[1]}`);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString();
  }

  function getMethodColor(method) {
    const colors = {
      GET: "text-green-400 bg-green-900/30 border-green-800",
      POST: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
      PUT: "text-blue-400 bg-blue-900/30 border-blue-800",
      DELETE: "text-red-400 bg-red-900/30 border-red-800",
    };
    return colors[method] || "text-gray-400";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">History</h2>
          <p className="text-gray-400 text-sm mt-1">
            All your previous API test runs
          </p>
        </div>

        {/* Compare button — only show when 2 selected */}
        {selected.length === 2 && (
          <button
            onClick={handleCompare}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            ⚡ Compare Selected
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by URL (e.g. https://jsonplaceholder.typicode.com/posts)"
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchUrl("");
            fetchHistory();
          }}
          className="text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Select hint */}
      <p className="text-gray-500 text-sm">
        {selected.length === 0 && "Select 2 entries to compare them"}
        {selected.length === 1 && "Select 1 more entry to compare"}
        {selected.length === 2 && "✅ 2 entries selected — click Compare"}
      </p>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400 animate-pulse">Loading history...</p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
          ❌ Error: {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && history.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No history found. Run some API tests first.</p>
        </div>
      )}

      {/* History list */}
      <div className="space-y-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className={`bg-gray-900 border rounded-xl p-5 transition-colors cursor-pointer hover:border-gray-600 ${
              selected.includes(entry.id)
                ? "border-purple-600"
                : "border-gray-800"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Checkbox + details */}
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selected.includes(entry.id)}
                  onChange={() => handleSelect(entry.id)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={
                    !selected.includes(entry.id) && selected.length >= 2
                  }
                  className="mt-1 w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${getMethodColor(entry.method)}`}
                    >
                      {entry.method}
                    </span>
                    <span className="text-white font-medium text-sm break-all">
                      {entry.url}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {formatDate(entry.testedAt)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        entry.report.overallStatus === "GOOD"
                          ? "text-green-400 bg-green-900/30 border-green-800"
                          : "text-red-400 bg-red-900/30 border-red-800"
                      }`}
                    >
                      {entry.report.overallStatus === "GOOD"
                        ? "✅ GOOD"
                        : "⚠️ ISSUE"}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {entry.report.summary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(entry.id);
                }}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded-lg hover:bg-red-900/20 transition-colors shrink-0"
              >
                Delete
              </button>

              {/* click on this to view details */}
              {/* Full Analysis Modal */}
              {selectedEntry && (
                <div
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
                  onClick={() => setSelectedEntry(null)}
                >
                  <div
                    className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 space-y-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Full Analysis
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(selectedEntry.testedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedEntry(null)}
                        className="text-gray-400 hover:text-white text-xl px-2"
                      >
                        ✕
                      </button>
                    </div>

                    {/* URL and Method */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded border ${getMethodColor(selectedEntry.method)}`}
                      >
                        {selectedEntry.method}
                      </span>
                      <span className="text-white text-sm break-all">
                        {selectedEntry.url}
                      </span>
                    </div>

                    {/* Overall Status */}
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">
                        Overall Status:
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          selectedEntry.report.overallStatus === "GOOD"
                            ? "text-green-400 bg-green-900/30 border-green-800"
                            : "text-red-400 bg-red-900/30 border-red-800"
                        }`}
                      >
                        {selectedEntry.report.overallStatus === "GOOD"
                          ? "✅ GOOD"
                          : "⚠️ ISSUE"}
                      </span>
                    </div>

                    {/* Summary */}
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                        Summary
                      </p>
                      <p className="text-gray-300 text-sm">
                        {selectedEntry.report.summary}
                      </p>
                    </div>

                    {/* Test Results Table */}
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                        Test Results
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-400 text-xs border-b border-gray-800">
                              <th className="text-left py-2 pr-4">Test</th>
                              <th className="text-left py-2 pr-4">Status</th>
                              <th className="text-left py-2 pr-4">Success</th>
                              <th className="text-left py-2">Response Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {selectedEntry.report.results.map(
                              (result, index) => (
                                <tr key={index}>
                                  <td className="py-2 pr-4 text-white">
                                    {result.testName}
                                  </td>
                                  <td
                                    className={`py-2 pr-4 font-semibold ${
                                      result.status >= 200 &&
                                      result.status < 300
                                        ? "text-green-400"
                                        : result.status >= 400 &&
                                            result.status < 500
                                          ? "text-yellow-400"
                                          : "text-red-400"
                                    }`}
                                  >
                                    {result.status}
                                  </td>
                                  <td className="py-2 pr-4">
                                    {result.success ? (
                                      <span className="text-green-400">
                                        ✅ Yes
                                      </span>
                                    ) : (
                                      <span className="text-red-400">
                                        ❌ No
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 text-gray-300">
                                    {result.responseTime}ms
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                        Suggestions
                      </p>
                      {selectedEntry.report.suggestions &&
                      selectedEntry.report.suggestions.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedEntry.report.suggestions.map((s, i) => (
                            <li
                              key={i}
                              className="text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-800/50 px-4 py-2 rounded-lg"
                            >
                              💡 {s}
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
                </div>
              )}
              {/* end of click to view details */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
