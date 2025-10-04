import { useState, useEffect } from "react";

function ConnectionStatus({ apiSource, isVisible = true }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const getStatusConfig = () => {
    switch (apiSource) {
      case "proxy":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "✓",
          title: "Connected via Proxy",
          description:
            "Successfully connected to NASA OSDR API through development proxy",
        };
      case "direct":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "🌐",
          title: "Direct API Connection",
          description: "Connected directly to NASA OSDR API",
        };
      case "mock":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "⚠️",
          title: "Using Mock Data",
          description:
            "CORS restrictions prevent live API access. Displaying sample datasets for demonstration.",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "❓",
          title: "Unknown Status",
          description: "Connection status unknown",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`border rounded-lg p-3 mb-4 ${config.color}`}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{config.icon}</span>
          <span className="font-medium text-sm">{config.title}</span>
        </div>
        <button className="text-xs opacity-60 hover:opacity-100">
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs opacity-80">{config.description}</p>

          {apiSource === "mock" && (
            <div className="mt-2 text-xs space-y-1">
              <p>
                <strong>To fix CORS issues:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>
                  Restart the dev server:{" "}
                  <code className="bg-black bg-opacity-10 px-1 rounded">
                    npm run dev
                  </code>
                </li>
                <li>
                  The proxy configuration should handle CORS automatically
                </li>
                <li>Check browser console for detailed error messages</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConnectionStatus;
