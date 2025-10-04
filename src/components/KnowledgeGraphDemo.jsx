import React from "react";

function KnowledgeGraphDemo() {
  const openPDF = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Knowledge Graph Demo
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Interactive visualization of NASA space biology research network
        </p>
      </div>

      {/* Demo Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          How it Works
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">
              Category Nodes (Large)
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Represent main research areas</li>
              <li>• Click to expand/collapse children</li>
              <li>• Connected by relationship edges</li>
              <li>• Color-coded by topic</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">
              Study Nodes (Small)
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Individual research studies</li>
              <li>• Click to open PDF resources</li>
              <li>• Positioned around parent categories</li>
              <li>• Inherit parent category colors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sample Data Structure */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Data Structure Example
        </h2>
        <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
          {`{
  "nodes": [
    {
      "id": "muscle",
      "label": "Muscle Physiology", 
      "type": "category",
      "children": [
        {
          "id": "muscle_iss1",
          "label": "ISS Study 2020",
          "type": "sub-category",
          "pdf_url": "https://osdr.nasa.gov/pdf/iss_muscle_study_2020.pdf"
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "muscle",
      "target": "plants",
      "relation": "related_topic"
    }
  ]
}`}
        </pre>
      </div>

      {/* Interactive Demo */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interactive Demo
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Categories */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">
              Research Categories
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Muscle Physiology</p>
                  <p className="text-sm text-gray-600">2 studies</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Plant Growth</p>
                  <p className="text-sm text-gray-600">2 studies</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Radiation Biology</p>
                  <p className="text-sm text-gray-600">1 study</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Microgravity Effects</p>
                  <p className="text-sm text-gray-600">2 studies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Studies */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Sample Studies</h3>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-50 cursor-pointer"
                onClick={() =>
                  openPDF("https://osdr.nasa.gov/pdf/iss_muscle_study_2020.pdf")
                }
              >
                <div>
                  <p className="font-medium text-sm">ISS Study 2020</p>
                  <p className="text-xs text-gray-600">Muscle Physiology</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-green-50 cursor-pointer"
                onClick={() =>
                  openPDF(
                    "https://osdr.nasa.gov/pdf/shuttle_plant_study_2019.pdf"
                  )
                }
              >
                <div>
                  <p className="font-medium text-sm">Shuttle Study 2019</p>
                  <p className="text-xs text-gray-600">Plant Growth</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-purple-50 cursor-pointer"
                onClick={() =>
                  openPDF(
                    "https://osdr.nasa.gov/pdf/ground_radiation_study.pdf"
                  )
                }
              >
                <div>
                  <p className="font-medium text-sm">Ground-based Radiation</p>
                  <p className="text-xs text-gray-600">Radiation Biology</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> PDF links are mock URLs for demonstration. In
            a real implementation, these would link to actual NASA research
            papers and datasets.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 border rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            Interactive Navigation
          </h3>
          <p className="text-sm text-gray-600">
            Click nodes to expand hierarchies and access resources
          </p>
        </div>

        <div className="text-center p-6 border rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Dynamic Layout</h3>
          <p className="text-sm text-gray-600">
            Automatic positioning and relationship visualization
          </p>
        </div>

        <div className="text-center p-6 border rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Resource Access</h3>
          <p className="text-sm text-gray-600">
            Direct links to research papers and datasets
          </p>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeGraphDemo;
