import { useState } from "react";
import { analyzeApi } from "../services/api";

function RequestForm({ onResult, onLoading }) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    onLoading(true);

    // Parse body string to JSON object if it's not empty
    let parsedBody = null;
    if (body.trim() !== "") {
      try {
        parsedBody = JSON.parse(body);
      } catch (err) {
        onResult({ success: false, error: "Invalid JSON in request body" });
        onLoading(false);
        return;
      }
    }

    const requestData = {
      url,
      method,
      headers: buildHeaders(),
      body: parsedBody || null,
    };
    const result = await analyzeApi(requestData);
    onResult(result);
    onLoading(false);
  }

  const methodColors = {
    GET: "text-green-400",
    POST: "text-yellow-400",
    PUT: "text-blue-400",
    DELETE: "text-red-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Request</h2>

      {/* URL and Method */}
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
          required
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Send
        </button>
      </div>

      {/* Headers */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
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
              type="button"
              onClick={() => removeHeader(index)}
              className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHeader}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          + Add Header
        </button>
      </div>

      {/* Body */}
      {(method === "POST" || method === "PUT") && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Body
          </h3>
          <textarea
            placeholder='{"key": "value"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}

export default RequestForm;
