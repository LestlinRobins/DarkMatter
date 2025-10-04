import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { StarField } from "./components/StarField";
import { PublicationNode } from "./components/PublicationNode";
import { ConnectionLines } from "./components/ConnectionLines";
import {
  mockPublications,
  categories,
  searchPublications,
  getStatistics,
} from "./data";
import type { Publication } from "./types";
import "./App.css";

function App() {
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPubs, setFilteredPubs] = useState(mockPublications);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const stats = getStatistics();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
  };

  const applyFilters = (search: string, category: string) => {
    let filtered = mockPublications;

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((pub) => pub.category === category);
    }

    // Apply search filter
    if (search.trim() !== "") {
      filtered = searchPublications(search).filter(
        (pub) => category === "all" || pub.category === category
      );
    }

    setFilteredPubs(filtered);
  };

  const connectedIds = selectedPub ? selectedPub.connections : [];
  const displayPubs =
    searchQuery || selectedCategory !== "all" ? filteredPubs : mockPublications;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "20px",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "28px",
            margin: "0 0 10px 0",
            fontWeight: "700",
            textShadow: "0 0 20px rgba(100,200,255,0.8)",
          }}
        >
          🚀 NASA Bioscience Knowledge Graph
        </h1>
        <p
          style={{
            color: "#aaa",
            margin: "0 0 20px 0",
            fontSize: "14px",
          }}
        >
          Exploring {stats.totalPublications} publications across{" "}
          {stats.categoriesCount} categories
        </p>

        {/* Search Bar */}
        <div style={{ pointerEvents: "auto", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="🔍 Search publications, tags, or topics..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "12px 20px",
              fontSize: "16px",
              border: "2px solid #333",
              borderRadius: "25px",
              background: "rgba(20, 20, 40, 0.9)",
              color: "white",
              outline: "none",
              backdropFilter: "blur(10px)",
            }}
          />
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={() => handleCategoryFilter("all")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border:
                "2px solid " +
                (selectedCategory === "all" ? "#4ECDC4" : "#333"),
              background:
                selectedCategory === "all"
                  ? "rgba(78, 205, 196, 0.3)"
                  : "rgba(20, 20, 40, 0.8)",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            All
          </button>
          {Object.entries(categories).map(([name, info]) => (
            <button
              key={name}
              onClick={() => handleCategoryFilter(name)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: `2px solid ${
                  selectedCategory === name ? info.color : "#333"
                }`,
                background:
                  selectedCategory === name
                    ? `${info.color}40`
                    : "rgba(20, 20, 40, 0.8)",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Panel */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          padding: "15px",
          background: "rgba(20, 20, 40, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          border: "2px solid #333",
          color: "white",
          fontSize: "12px",
          minWidth: "200px",
        }}
      >
        <div
          style={{ fontWeight: "700", marginBottom: "10px", fontSize: "14px" }}
        >
          📊 Statistics
        </div>
        <div>Total Publications: {stats.totalPublications}</div>
        <div>Total Citations: {stats.totalCitations}</div>
        <div>Avg Citations: {stats.averageCitationsPerPaper}</div>
        <div>Top Category: {stats.topCategory}</div>
      </div>

      {/* Selected Publication Details */}
      {selectedPub && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            maxWidth: "600px",
            zIndex: 10,
            padding: "20px",
            background: "rgba(20, 20, 40, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: `3px solid ${
              categories[selectedPub.category as keyof typeof categories]
                ?.color || "#888"
            }`,
            color: "white",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  color:
                    categories[selectedPub.category as keyof typeof categories]
                      ?.color,
                }}
              >
                {selectedPub.title}
              </div>
              <div
                style={{ fontSize: "12px", opacity: 0.8, marginBottom: "10px" }}
              >
                {selectedPub.authors.join(", ")} • {selectedPub.year}
              </div>
              <div style={{ marginBottom: "10px", lineHeight: "1.5" }}>
                {selectedPub.abstract}
              </div>
              <div style={{ display: "flex", gap: "15px", fontSize: "12px" }}>
                <span>📊 {selectedPub.citations} citations</span>
                <span>🏷️ {selectedPub.category}</span>
                <span>🔗 {selectedPub.connections.length} connections</span>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                }}
              >
                {selectedPub.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "4px 10px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "11px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedPub(null)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedPub && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            zIndex: 10,
            padding: "15px",
            background: "rgba(20, 20, 40, 0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "2px solid #333",
            color: "#aaa",
            fontSize: "12px",
            maxWidth: "250px",
          }}
        >
          <div
            style={{ fontWeight: "700", marginBottom: "8px", color: "white" }}
          >
            💡 Controls
          </div>
          <div>• Click on spheres to explore</div>
          <div>• Drag to rotate view</div>
          <div>• Scroll to zoom</div>
          <div>• Search or filter by category</div>
          <div style={{ marginTop: "8px", fontSize: "11px", opacity: 0.7 }}>
            Sphere size = citation count
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 25]} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            maxDistance={50}
            minDistance={5}
          />

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#4ECDC4"
          />

          {/* Star Field */}
          <StarField />

          {/* Publication Nodes */}
          {displayPubs.map((pub) => (
            <PublicationNode
              key={pub.id}
              publication={pub}
              onClick={setSelectedPub}
              isSelected={pub.id === selectedPub?.id}
              isConnected={connectedIds.includes(pub.id)}
            />
          ))}

          {/* Connection Lines */}
          <ConnectionLines
            publications={mockPublications}
            selectedPub={selectedPub}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
