// import { useState } from "react";

// import RequestForm from "./components/RequestForm.jsx";
// import ResultsTable from "./components/ResultTable.jsx";
// import AnalysisReport from "./components/AnalysisReport.jsx";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import History from "./pages/History";
// import Compare from "./pages/Compare";

// import "./App.css";

// function App() {
//   const [results, setResults] = useState(null);
//   const [overallStatus, setOverallStatus] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [suggestions, setSuggestions] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   function handleResult(result) {
//     // If the API call itself failed (network error etc.)
//     if (!result.success) {
//       setError(result.error);
//       return;
//     }

//     // Clear any previous error
//     setError(null);

//     // Store response data from backend into state
//     const { results, overallStatus, summary, suggestions } = result.data;
//     setResults(results);
//     setOverallStatus(overallStatus);
//     setSummary(summary);
//     setSuggestions(suggestions);
//   }

//   return (
//         <div className="min-h-screen bg-gray-950 text-white">

//             {/* Header */}
//             <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
//                 <h1 className="text-2xl font-bold text-white">🚀 API Tester</h1>
//                 <p className="text-gray-400 text-sm mt-1">Test and analyze your APIs</p>
//             </div>

//             <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

//                 {/* Request Form */}
//                 <RequestForm
//                     onResult={handleResult}
//                     onLoading={setLoading}
//                 />

//                 {/* Loading */}
//                 {loading && (
//                     <div className="text-center py-10">
//                         <p className="text-gray-400 animate-pulse text-lg">⏳ Running tests, please wait...</p>
//                     </div>
//                 )}

//                 {/* Error */}
//                 {error && (
//                     <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
//                         ❌ Error: {error}
//                         console.error("API call failed:", error);
//                     </div>
//                 )}

//                 {/* Results */}
//                 {results && !loading && (
//                     <div className="space-y-8">
//                         <ResultsTable results={results} />
//                         <AnalysisReport
//                             overallStatus={overallStatus}
//                             summary={summary}
//                             suggestions={suggestions}
//                         />
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import History from "./pages/History";
import Compare from "./pages/Compare";
import LoadTest from "./pages/LoadTest";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/load-test" element={<LoadTest />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;