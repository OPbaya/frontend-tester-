import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div>
          <h1 className="text-xl font-bold text-white">🚀 API Tester</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Test and analyze your APIs
          </p>
        </div>

        {/* Nav Links */}
        <div className="flex gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            History
          </NavLink>
          <NavLink
            to="/load-test"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            Load Test
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            Compare
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
