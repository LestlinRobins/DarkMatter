import { useState, Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { StarField } from "./components/StarField";
import { Sun } from "./components/Sun";
import { PublicationNode } from "./components/PublicationNode";
import { ConnectionLines } from "./components/ConnectionLines";
import { Galaxy } from "./components/Galaxy";
import {
  mockPublications,
  categories,
  searchPublications,
  getStatistics,
  createConstellations,
} from "./data";
import type { Publication, Constellation } from "./types";
import "./App.css";

function App() {
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPubs, setFilteredPubs] = useState(mockPublications);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [selectedConstellation, setSelectedConstellation] = useState<
    string | null
  >(null);
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const consts = createConstellations();
    setConstellations(consts);
    // Force update of filtered pubs to use new positions
    setFilteredPubs([...mockPublications]);
  }, []);

  const stats = getStatistics();

  const handlePubClick = (pub: Publication) => {
    setSelectedPub(pub);

    // Zoom into the galaxy - maintain top-down view
    if (pub.constellationId) {
      setSelectedConstellation(pub.constellationId);
      const constellation = constellations.find(
        (c) => c.id === pub.constellationId
      );

      if (constellation && cameraRef.current && controlsRef.current) {
        // Zoom in from above (top-down view)
        const [x, y, z] = constellation.center;
        cameraRef.current.position.set(x, 20, z);
        controlsRef.current.target.set(x, y, z);
      }
    }
  };

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
          🌌 NASA Bioscience Knowledge Galaxy
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
            maxWidth: "900px",
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
            <div style={{ display: "flex", gap: "8px" }}>
              {selectedConstellation && (
                <button
                  onClick={() => {
                    setSelectedConstellation(null);
                    if (cameraRef.current && controlsRef.current) {
                      cameraRef.current.position.set(0, 60, 0);
                      controlsRef.current.target.set(0, 0, 0);
                    }
                  }}
                  style={{
                    background: "rgba(100, 200, 255, 0.2)",
                    border: "1px solid rgba(100, 200, 255, 0.5)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ← Back
                </button>
              )}
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
          <div>• Click planets to zoom into galaxies</div>
          <div>• Each galaxy contains 4 publications</div>
          <div>• Drag to rotate view</div>
          <div>• Scroll to zoom</div>
          <div>• Search or filter by category</div>
          <div style={{ marginTop: "8px", fontSize: "11px", opacity: 0.7 }}>
            🌌 Planet size = citation count
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[0, 40, 80]}
            fov={60}
            near={0.1}
            far={1000}
          />
          <OrbitControls
            ref={controlsRef}
            enablePan
            enableZoom
            enableRotate
            maxDistance={300}
            minDistance={20}
            minPolarAngle={Math.PI * 0.1}
            maxPolarAngle={Math.PI * 0.9}
            target={[0, 0, 0]}
          />

          {/* Lighting */}
          <ambientLight intensity={1.5} color="#FFE5CC" />
          <hemisphereLight
            intensity={1.5}
            color="#FFA500"
            groundColor="#FF6B00"
          />

          {/* Realistic Animated Sun */}
          <Sun />

          {/* Star Field */}
          <StarField />

          {/* Galaxies */}
          {constellations.map((constellation) => (
            <Galaxy
              key={constellation.id}
              center={constellation.center}
              color={constellation.color}
              isSelected={selectedConstellation === constellation.id}
            />
          ))}

          {/* Publication Nodes */}
          {displayPubs.map((pub) => (
            <PublicationNode
              key={pub.id}
              publication={pub}
              onClick={handlePubClick}
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
