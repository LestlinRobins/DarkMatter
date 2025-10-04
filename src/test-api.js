// Test script for NASA OSDR API service
// Run this in the browser console to test API connectivity

import apiService from "./services/apiService.js";

// Test function to verify API service
async function testAPI() {
  console.log("🚀 Testing NASA OSDR API Service...\n");

  try {
    console.log("📡 Fetching datasets...");
    const result = await apiService.fetchDatasets();

    if (result.success) {
      console.log(`✅ Success! Source: ${result.source}`);
      console.log(`📊 Found ${result.data.length} datasets`);

      if (result.warning) {
        console.warn(`⚠️  ${result.warning}`);
      }

      if (result.data.length > 0) {
        const firstDataset = result.data[0];
        console.log("\n📖 First dataset:", {
          id: firstDataset.id,
          title: firstDataset.title,
          organism: firstDataset.organism,
        });

        // Test dataset details
        if (firstDataset.id) {
          console.log("\n🔍 Testing dataset details...");
          const detailResult = await apiService.fetchDatasetDetails(
            firstDataset.id
          );

          if (detailResult.success) {
            console.log(`✅ Details fetched! Source: ${detailResult.source}`);
          } else {
            console.error(`❌ Details failed: ${detailResult.error}`);
          }
        }
      }
    } else {
      console.error(`❌ Failed: ${result.error}`);
    }
  } catch (error) {
    console.error("💥 Test failed:", error);
  }

  console.log("\n🏁 Test complete!");
}

// Export for manual testing
window.testNASAAPI = testAPI;

// Auto-run if in development
if (process.env.NODE_ENV === "development") {
  console.log("🧪 NASA OSDR API Test available. Run testNASAAPI() in console.");
}

export { testAPI };
