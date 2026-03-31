function ResultsTable({ results }) {
  if (!results || results.length === 0) {
    return <p className="text-gray-400">No results to display.</p>;
  }

  function getStatusColor(status) {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    if (status >= 500) return "text-red-400";
    return "text-gray-400";
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Test Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 uppercase text-xs tracking-wide border-b border-gray-800">
              <th className="text-left py-3 pr-4">Test Name</th>
              <th className="text-left py-3 pr-4">Status</th>
              <th className="text-left py-3 pr-4">Success</th>
              <th className="text-left py-3 pr-4">Response Time</th>
              <th className="text-left py-3 pr-4">Issue</th>
              <th className="text-left py-3">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {results.map((result, index) => (
              <tr
                key={index}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 pr-4 text-white font-medium">
                  {result.testName}
                </td>
                <td
                  className={`py-3 pr-4 font-semibold ${getStatusColor(result.status)}`}
                >
                  {result.status}
                </td>
                <td className="py-3 pr-4">
                  {result.success ? (
                    <span className="text-green-400">✅ Yes</span>
                  ) : (
                    <span className="text-red-400">❌ No</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-gray-300">
                  {result.responseTime} ms
                </td>
                <td className="py-3 pr-4 text-gray-300">{result.issue}</td>
                <td className="py-3 text-red-400 text-xs">
                  {result.error || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
