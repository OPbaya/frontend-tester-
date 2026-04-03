import { useState } from "react";
import { runLoadTest } from "../services/api";

function LoadTest() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestCount, setRequestCount] = useState(10);
  const [mode, setMode] = useState("SEQUENTIAL");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function addHeader() {
    setHeaders([...headers, { key: "", value: "" }]);
  }

  function updateHeader(index, field, value) {
    const updated = headers.map((header, i) =>
      i === index ? { ...header, [field]: value } : header,
    );
    setHeaders(updated);
  }

  function removeHeader(index) {
    setHeaders(headers.filter((_, i) => i !== index));
  }

  function buildHeaders() {
    const result = {};
    headers.forEach(({ key, value }) => {
      if (key.trim() !== "") {
        result[key.trim()] = value.trim();
      }
    });
    return result;
  }

  async function handleSubmit() {
    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    // Parse body if present
    let parsedBody = null;
    if (body.trim() !== "" && (method === "POST" || method === "PUT")) {
      try {
        parsedBody = JSON.parse(body);
      } catch (err) {
        setError("Invalid JSON in request body");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setReport(null);

    const result = await runLoadTest({
      url,
      method,
      headers: buildHeaders(),
      body: parsedBody,
      requestCount,
      mode,
    });

    if (result.success) {
      setReport(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  // Color based on verdict
  function getVerdictColor(verdict) {
    if (verdict === "STABLE")
      return "text-green-400 bg-green-900/30 border-green-800";
    if (verdict === "SLOW")
      return "text-yellow-400 bg-yellow-900/30 border-yellow-800";
    return "text-red-400 bg-red-900/30 border-red-800";
  }

  // Color based on response time
  function getResponseTimeColor(time) {
    if (time < 300) return "text-green-400";
    if (time < 1000) return "text-yellow-400";
    return "text-red-400";
  }

  // Color based on status code
  function getStatusColor(status) {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    return "text-red-400";
  }

  // Trend icon
  function getTrendIcon(trend) {
    if (trend === "GETTING_SLOWER") return "📈 Getting slower";
    if (trend === "GETTING_FASTER") return "📉 Getting faster";
    if (trend === "STABLE") return "➡️ Stable";
    return "—";
  }

  const methodColors = {
    GET: "text-green-400",
    POST: "text-yellow-400",
    PUT: "text-blue-400",
    DELETE: "text-red-400",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Load Test</h2>
        <p className="text-gray-400 text-sm mt-1">
          Send multiple requests and analyze how your API performs under load
        </p>
      </div>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        {/* URL + Method */}
        <div className="flex gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-semibold focus:outline-none focus:border-gray-500 ${methodColors[method]}`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            placeholder="Enter URL (e.g. https://jsonplaceholder.typicode.com/posts)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Request Count + Mode */}
        <div className="flex gap-4">
          {/* Request Count */}
          <div className="flex-1 space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-wide">
              Number of Requests
              <span className="text-gray-600 ml-2 normal-case">(max 50)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={50}
                value={requestCount}
                onChange={(e) => setRequestCount(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-white font-bold text-lg w-10 text-center">
                {requestCount}
              </span>
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-wide">
              Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("SEQUENTIAL")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  mode === "SEQUENTIAL"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                Sequential
              </button>
              <button
                onClick={() => setMode("CONCURRENT")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  mode === "CONCURRENT"
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                Concurrent
              </button>
            </div>
          </div>
        </div>

        {/* Mode description */}
        <p className="text-gray-500 text-xs">
          {mode === "SEQUENTIAL"
            ? "🔁 Sequential — sends requests one after another. Tests reliability and response time trend."
            : "⚡ Concurrent — sends all requests at the same time. Tests how the API handles load and stress."}
        </p>

        {/* Headers */}
        <div className="space-y-3">
          <h3 className="text-gray-400 text-xs uppercase tracking-wide">
            Headers
          </h3>
          {headers.map((header, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(index, "key", e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(index, "value", e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
              <button
                onClick={() => removeHeader(index)}
                className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addHeader}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            + Add Header
          </button>
        </div>

        {/* Body */}
        {(method === "POST" || method === "PUT") && (
          <div className="space-y-3">
            <h3 className="text-gray-400 text-xs uppercase tracking-wide">
              Body
            </h3>
            <textarea
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 font-mono text-sm"
            />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading
            ? "Running load test..."
            : `Run ${requestCount} ${mode.toLowerCase()} requests`}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
          ❌ Error: {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-400 animate-pulse text-lg">
            {mode === "CONCURRENT"
              ? `⚡ Firing ${requestCount} concurrent requests...`
              : `🔁 Running ${requestCount} sequential requests...`}
          </p>
        </div>
      )}

      {/* Report */}
      {report && !loading && (
        <div className="space-y-6">
          {/* Verdict banner */}
          <div
            className={`border rounded-xl p-5 text-center ${getVerdictColor(report.verdict)}`}
          >
            <p className="text-sm uppercase tracking-wide mb-1">Verdict</p>
            <p className="text-2xl font-bold">
              {report.verdict === "STABLE" && "✅ STABLE"}
              {report.verdict === "SLOW" && "🐢 SLOW"}
              {report.verdict === "UNSTABLE" && "⚠️ UNSTABLE"}
            </p>
            <p className="text-sm mt-2 opacity-80">{report.summary}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Success rate */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Success Rate
              </p>
              <p
                className={`text-3xl font-bold ${
                  report.successRate >= 90
                    ? "text-green-400"
                    : report.successRate >= 70
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {report.successRate.toFixed(1)}%
              </p>
              <p className="text-gray-500 text-xs">
                {report.successCount} passed / {report.failureCount} failed out
                of {report.totalRequests}
              </p>
            </div>

            {/* Response times */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Response Time
              </p>
              <p
                className={`text-3xl font-bold ${getResponseTimeColor(report.avgResponseTime)}`}
              >
                {report.avgResponseTime}ms
                <span className="text-sm font-normal text-gray-500 ml-1">
                  avg
                </span>
              </p>
              <p className="text-gray-500 text-xs">
                Min: {report.minResponseTime}ms / Max: {report.maxResponseTime}
                ms
              </p>
            </div>

            {/* Status code breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Status Code Breakdown
              </p>
              <div className="space-y-2">
                {Object.entries(report.statusCodeBreakdown).map(
                  ([code, count]) => (
                    <div
                      key={code}
                      className="flex justify-between items-center"
                    >
                      <span
                        className={`text-sm font-semibold ${getStatusColor(Number(code))}`}
                      >
                        {code}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Progress bar */}
                        <div className="w-24 bg-gray-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              Number(code) >= 200 && Number(code) < 300
                                ? "bg-green-500"
                                : Number(code) >= 400 && Number(code) < 500
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${(count / report.totalRequests) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-300 text-sm">{count}x</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Trend */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Response Time Trend
              </p>
              <p className="text-white text-lg font-semibold">
                {getTrendIcon(report.responseTimeTrend)}
              </p>
              <p className="text-gray-500 text-xs">
                {report.responseTimeTrend === "N/A"
                  ? "Trend is only available in sequential mode"
                  : "Comparing first half vs second half of requests"}
              </p>
            </div>
          </div>

          {/* Individual results table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-4">
              Individual Request Results
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-800">
                    <th className="text-left py-2 pr-4">#</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2 pr-4">Success</th>
                    <th className="text-left py-2 pr-4">Response Time</th>
                    <th className="text-left py-2">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {report.results.map((result, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-2 pr-4 text-gray-400">
                        {result.requestNumber}
                      </td>
                      <td
                        className={`py-2 pr-4 font-semibold ${getStatusColor(result.status)}`}
                      >
                        {result.status}
                      </td>
                      <td className="py-2 pr-4">
                        {result.success ? (
                          <span className="text-green-400">✅ Yes</span>
                        ) : (
                          <span className="text-red-400">❌ No</span>
                        )}
                      </td>
                      <td
                        className={`py-2 pr-4 font-medium ${getResponseTimeColor(result.responseTime)}`}
                      >
                        {result.responseTime}ms
                      </td>
                      <td className="py-2 text-red-400 text-xs">
                        {result.error || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadTest;
