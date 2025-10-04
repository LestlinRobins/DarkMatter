import { useState, Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
import * as THREE from "three";
import "./App.css";

// Smooth connection animation component
function SmoothConnections({
  publications,
  selectedPub,
  opacity,
}: {
  publications: Publication[];
  selectedPub: Publication | null;
  opacity: number;
}) {
  const [currentOpacity, setCurrentOpacity] = useState(0);
  const targetOpacity = opacity;

  useFrame(() => {
    if (Math.abs(currentOpacity - targetOpacity) > 0.01) {
      setCurrentOpacity((prev) => prev + (targetOpacity - prev) * 0.1);
    }
  });

  if (!selectedPub) return null;

  const color =
    categories[selectedPub.category as keyof typeof categories]?.color ||
    "#888888";

  return (
    <group>
      {selectedPub.connections.map((connId) => {
        const connectedPub = publications.find((p) => p.id === connId);
        if (!connectedPub) return null;

        return (
          <line key={`${selectedPub.id}-${connId}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={
                  new Float32Array([
                    ...selectedPub.position,
                    ...connectedPub.position,
                  ])
                }
                itemSize={3}
                args={[
                  new Float32Array([
                    ...selectedPub.position,
                    ...connectedPub.position,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.6 * currentOpacity}
              linewidth={2}
            />
          </line>
        );
      })}
    </group>
  );
}

// Smooth camera animation component
function SmoothCamera({
  targetPosition,
  targetLookAt,
  isAnimating,
  onAnimationComplete,
}: {
  targetPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const startPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const startLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const animationStartTime = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  // Start animation when props change
  useEffect(() => {
    if (
      isAnimating &&
      targetPosition &&
      targetLookAt &&
      cameraRef.current &&
      controlsRef.current
    ) {
      startPosition.current.copy(cameraRef.current.position);
      startLookAt.current.copy(controlsRef.current.target);
      animationStartTime.current = 0;
      isAnimatingRef.current = true;
    }
  }, [isAnimating, targetPosition, targetLookAt]);

  useFrame((state) => {
    if (
      !cameraRef.current ||
      !controlsRef.current ||
      !isAnimatingRef.current ||
      !targetPosition ||
      !targetLookAt
    )
      return;

    const currentTime = state.clock.getElapsedTime();

    // Set start time on first frame
    if (animationStartTime.current === 0) {
      animationStartTime.current = currentTime;
    }

    const elapsed = currentTime - animationStartTime.current;
    const duration = 0.8; // Faster animation for better responsiveness

    if (elapsed < duration) {
      // More responsive easing function (ease-out)
      const progress = elapsed / duration;
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      // Interpolate position
      const currentPos = new THREE.Vector3().lerpVectors(
        startPosition.current,
        new THREE.Vector3(...targetPosition),
        easedProgress
      );
      cameraRef.current.position.copy(currentPos);

      // Interpolate look-at target
      const currentLookAt = new THREE.Vector3().lerpVectors(
        startLookAt.current,
        new THREE.Vector3(...targetLookAt),
        easedProgress
      );
      controlsRef.current.target.copy(currentLookAt);
      controlsRef.current.update();
    } else {
      // Animation complete
      cameraRef.current.position.set(...targetPosition);
      controlsRef.current.target.set(...targetLookAt);
      controlsRef.current.update();
      isAnimatingRef.current = false;
      animationStartTime.current = 0;
      onAnimationComplete();
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 60, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fov={60}
        near={0.1}
        far={1000}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        maxDistance={3000}
        minDistance={0}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        zoomSpeed={1.2}
        panSpeed={0.8}
      />
    </>
  );
}

function App() {
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPubs, setFilteredPubs] = useState(mockPublications);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [selectedConstellation, setSelectedConstellation] = useState<
    string | null
  >(null);

  // Animation states
  const [isCameraAnimating, setIsCameraAnimating] = useState(false);
  const [cameraTargetPosition, setCameraTargetPosition] = useState<
    [number, number, number] | null
  >(null);
  const [cameraTargetLookAt, setCameraTargetLookAt] = useState<
    [number, number, number] | null
  >(null);
  const [showConnections, setShowConnections] = useState(false);
  const [connectionOpacity, setConnectionOpacity] = useState(0);

  useEffect(() => {
    const consts = createConstellations();
    setConstellations(consts);
    // Force update of filtered pubs to use new positions
    setFilteredPubs([...mockPublications]);
  }, []);

  const stats = getStatistics();

  const handlePubClick = (pub: Publication) => {
    setSelectedPub(pub);

    // Smooth connection animation
    setShowConnections(true);
    setConnectionOpacity(1);

    // Highlight the category of the selected publication
    setSelectedCategory(pub.category);

    // Zoom into the galaxy - maintain top-down view with smooth animation
    if (pub.constellationId) {
      setSelectedConstellation(pub.constellationId);
      const constellation = constellations.find(
        (c) => c.id === pub.constellationId
      );

      if (constellation) {
        // Calculate proper camera distance based on galaxy bounds
        const publications = constellation.publications;
        if (publications.length > 0) {
          // Find the maximum distance from center in any direction
          let maxDistance = 0;
          publications.forEach(p => {
            const dx = p.position[0] - constellation.center[0];
            const dy = p.position[1] - constellation.center[1];
            const dz = p.position[2] - constellation.center[2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            maxDistance = Math.max(maxDistance, distance);
          });

          // Set camera position with proper distance (1.5x the max distance for comfortable viewing)
          const distanceMultiplier = 1.3; // Slightly closer for better responsiveness
          const cameraDistance = Math.max(maxDistance * distanceMultiplier, 20); // Reduced minimum distance

          // Position camera above and slightly back from the galaxy center for better angle
          const [x, y, z] = constellation.center;
          setCameraTargetPosition([x, y + cameraDistance, z]);
          setCameraTargetLookAt([x, y, z]);
          setIsCameraAnimating(true);
        }
      }
    }
  };

  const handleAnimationComplete = useCallback(() => {
    setIsCameraAnimating(false);
    setCameraTargetPosition(null);
    setCameraTargetLookAt(null);
  }, []);

  const handleBackToOverview = useCallback(() => {
    setSelectedConstellation(null);
    setSelectedPub(null);
    setShowConnections(false);
    setConnectionOpacity(0);

    // Smooth camera return to overview
    setCameraTargetPosition([0, 60, 0]);
    setCameraTargetLookAt([0, 0, 0]);
    setIsCameraAnimating(true);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category);

    // Zoom to the corresponding galaxy when a category is selected
    if (category !== "all") {
      const galaxy = constellations.find((c) => c.category === category);
      if (galaxy) {
        // Calculate proper camera distance based on galaxy bounds
        const publications = galaxy.publications;
        if (publications.length > 0) {
          // Find the maximum distance from center in any direction
          let maxDistance = 0;
          publications.forEach(pub => {
            const dx = pub.position[0] - galaxy.center[0];
            const dy = pub.position[1] - galaxy.center[1];
            const dz = pub.position[2] - galaxy.center[2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            maxDistance = Math.max(maxDistance, distance);
          });

          // Set camera position with proper distance (1.5x the max distance for comfortable viewing)
          const distanceMultiplier = 1.3; // Slightly closer for better responsiveness
          const cameraDistance = Math.max(maxDistance * distanceMultiplier, 20); // Reduced minimum distance

          // Position camera above and slightly back from the galaxy center
          const [x, y, z] = galaxy.center;
          setCameraTargetPosition([x, y + cameraDistance, z]);
          setCameraTargetLookAt([x, y, z]);
          setIsCameraAnimating(true);
          setSelectedConstellation(galaxy.id);
        }
      }
    } else {
      // If "all" is selected, return to overview
      handleBackToOverview();
    }
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

  // When showing connections, include all connected publications even if they're from different categories
  const displayPubs = (() => {
    if (!showConnections || !selectedPub) {
      // Normal filtering when not showing connections
      return searchQuery || selectedCategory !== "all" ? filteredPubs : mockPublications;
    }

    // When showing connections, include the selected publication and all its connections
    const allPubsToShow = new Set([...filteredPubs]);

    // Add the selected publication if it's not already in filteredPubs
    if (selectedPub && !allPubsToShow.has(selectedPub)) {
      allPubsToShow.add(selectedPub);
    }

    // Add all connected publications
    selectedPub.connections.forEach(connId => {
      const connectedPub = mockPublications.find(p => p.id === connId);
      if (connectedPub) {
        allPubsToShow.add(connectedPub);
      }
    });

    return Array.from(allPubsToShow);
  })();

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
            className="smooth-transition"
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
            className="smooth-transition smooth-scale"
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
              className="smooth-transition smooth-scale"
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
            animation: "slideUp 0.5s ease-out",
            transform: "translateY(0)",
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
                  onClick={handleBackToOverview}
                  style={{
                    background: "rgba(100, 200, 255, 0.2)",
                    border: "1px solid rgba(100, 200, 255, 0.5)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => setSelectedPub(null)}
                className="smooth-transition smooth-scale"
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
          {/* Smooth Camera with Animation */}
          <SmoothCamera
            targetPosition={cameraTargetPosition}
            targetLookAt={cameraTargetLookAt}
            isAnimating={isCameraAnimating}
            onAnimationComplete={handleAnimationComplete}
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

          {/* Connection Lines with Smooth Animation */}
          <SmoothConnections
            publications={mockPublications}
            selectedPub={selectedPub}
            opacity={showConnections ? connectionOpacity : 0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
