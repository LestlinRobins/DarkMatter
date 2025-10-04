import { useState } from "react";

function DatasetList({ datasets, loading, onDatasetSelect, searchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 10;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading datasets...</span>
      </div>
    );
  }

  if (!datasets || datasets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {searchTerm
            ? `No datasets found matching "${searchTerm}"`
            : "No datasets available"}
        </div>
        {searchTerm && (
          <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
        )}
      </div>
    );
  }

  // Pagination logic
  const indexOfLastDataset = currentPage * datasetsPerPage;
  const indexOfFirstDataset = indexOfLastDataset - datasetsPerPage;
  const currentDatasets = datasets.slice(
    indexOfFirstDataset,
    indexOfLastDataset
  );
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="text-gray-600">
        Showing {indexOfFirstDataset + 1}-
        {Math.min(indexOfLastDataset, datasets.length)} of {datasets.length}{" "}
        datasets
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Dataset grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentDatasets.map((dataset, index) => (
          <div
            key={dataset.id || index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {dataset.title || "Untitled Dataset"}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">ID:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {dataset.id || "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">
                    Organism:
                  </span>
                  <span>{dataset.organism || "N/A"}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">Date:</span>
                  <span>
                    {formatDate(
                      dataset.submissionDate ||
                        dataset.releaseDate ||
                        dataset.createdDate
                    )}
                  </span>
                </div>

                {dataset.studyType && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">
                      Type:
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {dataset.studyType}
                    </span>
                  </div>
                )}
              </div>

              {dataset.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {dataset.description}
                </p>
              )}

              <button
                onClick={() => onDatasetSelect(dataset)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-md border ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DatasetList;
