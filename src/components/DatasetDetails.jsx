import { useState, useEffect } from "react";
import apiService from "../services/apiService.js";

function DatasetDetails({ dataset, onBack }) {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataset.id) {
      fetchDatasetDetails(dataset.id);
    }
  }, [dataset.id]);

  const fetchDatasetDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiService.fetchDatasetDetails(id);

      if (result.success) {
        setDetailedData(result.data);
      } else {
        setError(result.error || "Failed to fetch dataset details");
      }
    } catch (err) {
      setError("Failed to fetch dataset details: " + err.message);
      console.error("Error fetching dataset details:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const renderSection = (title, content) => {
    if (!content) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {typeof content === "string" ? (
            <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
          ) : (
            content
          )}
        </div>
      </div>
    );
  };

  const renderKeyValuePairs = (obj, title) => {
    if (!obj || typeof obj !== "object") return null;

    const entries = Object.entries(obj).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    );

    if (entries.length === 0) return null;

    return renderSection(
      title,
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="font-medium text-gray-600 text-sm capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
            <span className="text-gray-900 mt-1">
              {typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const data = detailedData || dataset;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Datasets
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {data.title || "Dataset Details"}
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {data.id && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              ID: {data.id}
            </span>
          )}
          {data.studyType && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {data.studyType}
            </span>
          )}
          {data.organism && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {data.organism}
            </span>
          )}
        </div>
      </div>

      {/* Loading state for detailed data */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Loading detailed information...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <strong>Warning:</strong> {error}
          <br />
          <span className="text-sm">
            Showing basic information from the dataset list.
          </span>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Dataset ID:</span>
                <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {data.id || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Organism:</span>
                <span className="ml-2">{data.organism || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Submission Date:
                </span>
                <span className="ml-2">
                  {formatDate(
                    data.submissionDate || data.releaseDate || data.createdDate
                  )}
                </span>
              </div>
              {data.studyType && (
                <div>
                  <span className="font-medium text-gray-600">Study Type:</span>
                  <span className="ml-2">{data.studyType}</span>
                </div>
              )}
              {data.authorLastName && (
                <div>
                  <span className="font-medium text-gray-600">Author:</span>
                  <span className="ml-2">
                    {data.authorFirstName
                      ? `${data.authorFirstName} ${data.authorLastName}`
                      : data.authorLastName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional metadata */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Additional Details
            </h3>
            <div className="space-y-3">
              {data.projectType && (
                <div>
                  <span className="font-medium text-gray-600">
                    Project Type:
                  </span>
                  <span className="ml-2">{data.projectType}</span>
                </div>
              )}
              {data.accessionId && (
                <div>
                  <span className="font-medium text-gray-600">
                    Accession ID:
                  </span>
                  <span className="ml-2 font-mono text-sm">
                    {data.accessionId}
                  </span>
                </div>
              )}
              {data.experimentalConditions && (
                <div>
                  <span className="font-medium text-gray-600">
                    Experimental Conditions:
                  </span>
                  <span className="ml-2">{data.experimentalConditions}</span>
                </div>
              )}
              {data.tissue && (
                <div>
                  <span className="font-medium text-gray-600">Tissue:</span>
                  <span className="ml-2">{data.tissue}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {data.description && renderSection("Description", data.description)}

        {/* Abstract */}
        {data.abstract && renderSection("Abstract", data.abstract)}

        {/* Methods */}
        {data.methods && renderSection("Methods", data.methods)}

        {/* Results */}
        {data.results && renderSection("Results", data.results)}

        {/* Conclusions */}
        {data.conclusions && renderSection("Conclusions", data.conclusions)}

        {/* Study Factors */}
        {data.studyFactors &&
          Array.isArray(data.studyFactors) &&
          data.studyFactors.length > 0 &&
          renderSection(
            "Study Factors",
            <ul className="list-disc list-inside space-y-1">
              {data.studyFactors.map((factor, index) => (
                <li key={index} className="text-gray-700">
                  {factor}
                </li>
              ))}
            </ul>
          )}

        {/* Files/Resources */}
        {data.files &&
          Array.isArray(data.files) &&
          data.files.length > 0 &&
          renderSection(
            "Associated Files",
            <div className="space-y-2">
              {data.files.slice(0, 10).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white border rounded"
                >
                  <span className="text-gray-700">
                    {file.name || file.fileName || `File ${index + 1}`}
                  </span>
                  {file.size && (
                    <span className="text-gray-500 text-sm">{file.size}</span>
                  )}
                </div>
              ))}
              {data.files.length > 10 && (
                <p className="text-gray-500 text-sm">
                  And {data.files.length - 10} more files...
                </p>
              )}
            </div>
          )}

        {/* Raw JSON data for debugging (in development) */}
        {process.env.NODE_ENV === "development" && detailedData && (
          <div className="mt-8 border-t pt-6">
            <details className="cursor-pointer">
              <summary className="font-semibold text-gray-600 hover:text-gray-800">
                Raw API Response (Development Only)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(detailedData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatasetDetails;
