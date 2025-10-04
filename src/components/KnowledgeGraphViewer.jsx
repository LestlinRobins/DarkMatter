import { useState } from "react";
import KnowledgeGraph from "./KnowledgeGraph.jsx";
import KnowledgeGraphDemo from "./KnowledgeGraphDemo.jsx";
import { knowledgeGraphData } from "../data/knowledgeGraphData.js";

function KnowledgeGraphViewer() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState("interactive"); // 'interactive' or 'demo'

  const handleNodeClick = (nodeData) => {
    setSelectedResource(nodeData);
    console.log("Node clicked:", nodeData);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          NASA Space Biology Knowledge Graph
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Interactive visualization of space biology research categories and
          studies. Click on categories to expand and view related studies, then
          click on studies to access resources.
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Click category nodes to
              expand/collapse • Click study nodes to open PDFs
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() =>
              setViewMode(viewMode === "interactive" ? "demo" : "interactive")
            }
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            {viewMode === "interactive" ? "Show Demo" : "Show Interactive"}
          </button>

          {viewMode === "interactive" && (
            <button
              onClick={toggleFullscreen}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "demo" ? (
        <KnowledgeGraphDemo />
      ) : (
        <div
          className={`${
            isFullscreen ? "fixed inset-0 z-50 bg-white p-4" : "relative"
          }`}
        >
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
            >
              ✕ Close
            </button>
          )}

          <KnowledgeGraph
            data={knowledgeGraphData}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}

      {/* Resource Details Panel */}
      {selectedResource && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Selected Resource
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Study Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Title:</strong> {selectedResource.label}
                </p>
                <p>
                  <strong>Type:</strong> {selectedResource.type}
                </p>
                <p>
                  <strong>ID:</strong> {selectedResource.id}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Resource Access
              </h3>
              <div className="space-y-2">
                {selectedResource.pdf_url && (
                  <a
                    href={selectedResource.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Open PDF Resource</span>
                  </a>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Note: PDF links are mock URLs for demonstration purposes
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedResource(null)}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Statistics Panel */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800">Muscle Physiology</h3>
          <p className="text-2xl font-bold text-red-600">
            {knowledgeGraphData.nodes.find((n) => n.id === "muscle")?.children
              ?.length || 0}
          </p>
          <p className="text-sm text-red-600">Studies</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Plant Growth</h3>
          <p className="text-2xl font-bold text-green-600">
            {knowledgeGraphData.nodes.find((n) => n.id === "plants")?.children
              ?.length || 0}
          </p>
          <p className="text-sm text-green-600">Studies</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Radiation Biology</h3>
          <p className="text-2xl font-bold text-purple-600">
            {knowledgeGraphData.nodes.find((n) => n.id === "radiation")
              ?.children?.length || 0}
          </p>
          <p className="text-sm text-purple-600">Studies</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Microgravity Effects</h3>
          <p className="text-2xl font-bold text-blue-600">
            {knowledgeGraphData.nodes.find((n) => n.id === "microgravity")
              ?.children?.length || 0}
          </p>
          <p className="text-sm text-blue-600">Studies</p>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeGraphViewer;
