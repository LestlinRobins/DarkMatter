// API service for NASA OSDR with CORS handling and mock data fallback

const API_BASE_URL = "/api"; // Use proxy
const DIRECT_API_URL = "https://osdr.nasa.gov/osdr/api"; // Direct URL as fallback

// Mock data for development and CORS issues
const mockDatasets = [
  {
    id: "OSD-123",
    title:
      "Transcriptomic and epigenomic analysis of Arabidopsis thaliana grown in space",
    organism: "Arabidopsis thaliana",
    submissionDate: "2023-08-15T10:30:00Z",
    studyType: "Transcriptomics",
    description:
      "This study examines the gene expression changes in Arabidopsis thaliana plants grown aboard the International Space Station compared to ground controls.",
    authorFirstName: "Jane",
    authorLastName: "Smith",
    projectType: "Space Biology",
    accessionId: "GLDS-123",
    tissue: "Root, Leaf",
    experimentalConditions: "Microgravity vs 1g control",
  },
  {
    id: "OSD-124",
    title: "Microgravity effects on bone density in rodent models",
    organism: "Mus musculus",
    submissionDate: "2023-07-22T14:15:00Z",
    studyType: "Proteomics",
    description:
      "Investigation of protein expression changes in mouse bone tissue after exposure to simulated microgravity conditions.",
    authorFirstName: "John",
    authorLastName: "Doe",
    projectType: "Space Medicine",
    accessionId: "GLDS-124",
    tissue: "Bone, Muscle",
    experimentalConditions: "Simulated microgravity",
  },
  {
    id: "OSD-125",
    title: "Bacterial biofilm formation in reduced gravity environments",
    organism: "Escherichia coli",
    submissionDate: "2023-09-10T09:45:00Z",
    studyType: "Genomics",
    description:
      "Study of how bacterial biofilms form and behave differently under reduced gravity conditions compared to Earth gravity.",
    authorFirstName: "Sarah",
    authorLastName: "Johnson",
    projectType: "Microbiology",
    accessionId: "GLDS-125",
    tissue: "Bacterial culture",
    experimentalConditions: "Reduced gravity simulation",
  },
  {
    id: "OSD-126",
    title:
      "Plant growth and development under LED lighting in space conditions",
    organism: "Solanum lycopersicum",
    submissionDate: "2023-06-08T16:20:00Z",
    studyType: "Metabolomics",
    description:
      "Analysis of metabolic changes in tomato plants grown under different LED light spectra in space-like conditions.",
    authorFirstName: "Michael",
    authorLastName: "Chen",
    projectType: "Plant Biology",
    accessionId: "GLDS-126",
    tissue: "Leaf, Fruit",
    experimentalConditions: "LED lighting variations",
  },
  {
    id: "OSD-127",
    title:
      "Immune system response in astronauts during long-duration spaceflight",
    organism: "Homo sapiens",
    submissionDate: "2023-05-30T11:10:00Z",
    studyType: "Immunology",
    description:
      "Comprehensive analysis of immune system markers and gene expression in astronauts before, during, and after 6-month ISS missions.",
    authorFirstName: "Lisa",
    authorLastName: "Williams",
    projectType: "Human Research",
    accessionId: "GLDS-127",
    tissue: "Blood, Saliva",
    experimentalConditions: "Long-duration spaceflight",
  },
];

// Simulate API delay for realistic experience
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class NasaOSDRAPI {
  constructor() {
    this.useMockData = false;
  }

  async fetchDatasets() {
    try {
      // First try the proxy endpoint
      console.log("Attempting to fetch datasets via proxy...");
      const response = await fetch(`${API_BASE_URL}/datasets`);

      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Successfully fetched data via proxy");
      return {
        success: true,
        data: data.results || data || [],
        source: "proxy",
      };
    } catch (proxyError) {
      console.warn("Proxy request failed:", proxyError.message);

      try {
        // Try direct API call
        console.log("Attempting direct API call...");
        const response = await fetch(`${DIRECT_API_URL}/datasets`);

        if (!response.ok) {
          throw new Error(`Direct API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Successfully fetched data via direct API");
        return {
          success: true,
          data: data.results || data || [],
          source: "direct",
        };
      } catch (directError) {
        console.warn("Direct API request failed:", directError.message);
        console.log("Falling back to mock data...");

        // Fallback to mock data
        await delay(500); // Simulate network delay
        this.useMockData = true;
        return {
          success: true,
          data: mockDatasets,
          source: "mock",
          warning: "Using mock data due to CORS restrictions",
        };
      }
    }
  }

  async fetchDatasetDetails(id) {
    if (this.useMockData) {
      await delay(300);
      const dataset = mockDatasets.find((ds) => ds.id === id);
      if (dataset) {
        // Add some additional mock details
        return {
          success: true,
          data: {
            ...dataset,
            abstract: `Detailed abstract for ${dataset.title}. This research provides crucial insights into the effects of space environment on biological systems.`,
            methods:
              "Standard protocols were followed for sample collection and analysis. Statistical significance was determined using appropriate statistical tests.",
            results:
              "Significant changes were observed in the experimental conditions compared to controls.",
            conclusions:
              "The findings contribute to our understanding of space biology and have implications for future space missions.",
            files: [
              { name: "raw_data.csv", size: "2.5MB" },
              { name: "processed_data.xlsx", size: "1.2MB" },
              { name: "analysis_report.pdf", size: "850KB" },
            ],
          },
          source: "mock",
        };
      }
      return { success: false, error: "Dataset not found in mock data" };
    }

    try {
      // Try proxy first
      const response = await fetch(`${API_BASE_URL}/datasets/${id}`);
      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data, source: "proxy" };
    } catch (proxyError) {
      try {
        // Try direct API
        const response = await fetch(`${DIRECT_API_URL}/datasets/${id}`);
        if (!response.ok) {
          throw new Error(`Direct API request failed: ${response.status}`);
        }
        const data = await response.json();
        return { success: true, data, source: "direct" };
      } catch (directError) {
        return {
          success: false,
          error: `Failed to fetch dataset details: ${directError.message}`,
        };
      }
    }
  }
}

const apiService = new NasaOSDRAPI();
export default apiService;
