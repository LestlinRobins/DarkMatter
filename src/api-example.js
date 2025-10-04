// Example usage of the NASA OSDR API
// This script demonstrates how the components interact with the API

const API_BASE_URL = "https://osdr.nasa.gov/osdr/api";

// Example function to fetch datasets (used in App.jsx)
async function fetchDatasets() {
  try {
    const response = await fetch(`${API_BASE_URL}/datasets`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datasets response structure:", Object.keys(data));
    console.log(
      "First few datasets:",
      data.results?.slice(0, 3) || data?.slice(0, 3)
    );

    return data.results || data || [];
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}

// Example function to fetch dataset details (used in DatasetDetails.jsx)
async function fetchDatasetDetails(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/datasets/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dataset detail structure:", Object.keys(data));

    return data;
  } catch (error) {
    console.error("Error fetching dataset details:", error);
    return null;
  }
}

// Example usage (uncomment to test in browser console)
/*
fetchDatasets().then(datasets => {
  console.log(`Found ${datasets.length} datasets`);
  if (datasets.length > 0) {
    const firstDataset = datasets[0];
    console.log('First dataset:', firstDataset);
    
    if (firstDataset.id) {
      fetchDatasetDetails(firstDataset.id).then(details => {
        console.log('Dataset details:', details);
      });
    }
  }
});
*/

export { fetchDatasets, fetchDatasetDetails };
