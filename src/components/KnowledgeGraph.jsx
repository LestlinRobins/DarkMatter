import React, { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";

const KnowledgeGraph = ({ data }) => {
  const containerRef = useRef(null);
  const sigmaRef = useRef(null);
  const graphRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showChildren, setShowChildren] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    try {
      // Create graph instance
      const graph = new Graph();
      graphRef.current = graph;

      // Add all nodes (both categories and sub-categories)
      data.nodes.forEach((node) => {
        const isCategory = node.type === "category";
        const parentId = node.parent;

        console.log(
          `Adding node: ${node.id}, type: ${node.type}, isCategory: ${isCategory}`
        );

        graph.addNode(node.id, {
          label: node.label,
          type: "circle", // Use default circle type
          nodeType: node.type, // Store original type as custom attribute
          size: isCategory ? 25 : 15,
          color: isCategory
            ? getCategoryColor(node.id)
            : getSubcategoryColor(parentId || node.id),
          x: Math.random() * 800,
          y: Math.random() * 600,
          hidden: false, // Show all nodes initially
          parent: parentId, // Store parent relationship
          originalData: node,
        });
      });

      // Add all edges from data
      data.edges.forEach((edge, index) => {
        if (
          edge &&
          edge.source &&
          edge.target &&
          graph.hasNode(edge.source) &&
          graph.hasNode(edge.target)
        ) {
          try {
            const isParentChild = edge.relation === "belongs_to";
            graph.addEdge(edge.source, edge.target, {
              label: edge.relation || "related",
              type: "line", // Use default line type
              edgeType: isParentChild ? "parent-child" : "relationship", // Classify edge type
              size: isParentChild ? 2 : 3,
              color: isParentChild ? "#CBD5E1" : "#F59E0B",
              hidden: isParentChild, // Initially hide parent-child edges
            });
          } catch (error) {
            console.error(
              `Error adding edge between ${edge.source} and ${edge.target}:`,
              error
            );
          }
        }
      });

      // Apply circular layout (more reliable than ForceAtlas2)
      console.log(`Total nodes in graph: ${graph.order}`);
      applyLayout(graph);

      // Create Sigma instance
      const sigma = new Sigma(graph, containerRef.current, {
        defaultNodeColor: "#EC4899",
        defaultEdgeColor: "#94A3B8",
        minCameraRatio: 0.05,
        maxCameraRatio: 20,
        renderEdgeLabels: true,
        renderLabels: true,
        defaultNodeType: "circle",
        defaultEdgeType: "line",
      });

      // Fit the camera to show all nodes
      setTimeout(() => {
        sigma.getCamera().animatedReset({ duration: 500 });
      }, 100);

      sigmaRef.current = sigma;

      // Set up event handlers
      setupEventHandlers(sigma, graph);

      // Debug: Log all nodes and their positions
      console.log("=== Final Graph State ===");
      graph.forEachNode((nodeId, attributes) => {
        console.log(
          `Node ${nodeId}: type=${attributes.nodeType}, x=${attributes.x}, y=${attributes.y}, hidden=${attributes.hidden}, color=${attributes.color}`
        );
      });
    } catch (error) {
      console.error("Error initializing knowledge graph:", error);
      setError(error.message);
    }

    // Cleanup function
    return () => {
      if (sigmaRef.current) {
        try {
          sigmaRef.current.kill();
        } catch (error) {
          console.error("Error cleaning up Sigma instance:", error);
        }
      }
    };
  }, [data]);

  const getCategoryColor = (categoryId) => {
    const colors = {
      muscle: "#EF4444", // Red
      immune: "#F97316", // Orange
      plants: "#10B981", // Green
      radiation: "#8B5CF6", // Purple
      microgravity: "#3B82F6", // Blue
      cardiovascular: "#EC4899", // Pink
      neurological: "#F59E0B", // Amber
      default: "#6B7280", // Gray
    };
    return colors[categoryId] || colors.default;
  };

  const getSubcategoryColor = (parentId) => {
    const colors = {
      muscle: "#FCA5A5", // Light Red
      immune: "#FDBA74", // Light Orange
      plants: "#6EE7B7", // Light Green
      radiation: "#C4B5FD", // Light Purple
      microgravity: "#93C5FD", // Light Blue
      cardiovascular: "#F9A8D4", // Light Pink
      neurological: "#FCD34D", // Light Amber
      default: "#D1D5DB", // Light Gray
    };
    return colors[parentId] || colors.default;
  };

  const setupEventHandlers = (sigma, graph) => {
    // Node click handler
    sigma.on("clickNode", (event) => {
      const nodeId = event.node;
      const nodeData = graph.getNodeAttributes(nodeId);

      setSelectedNode(nodeId);

      if (nodeData.nodeType === "category") {
        // Toggle children visibility
        toggleChildrenVisibility(graph, sigma, nodeId);

        // Also open PDF for category if it has one
        if (nodeData.originalData?.pdf_url) {
          window.open(nodeData.originalData.pdf_url, "_blank");
        }
      } else if (
        nodeData.nodeType === "sub-category" &&
        nodeData.originalData?.pdf_url
      ) {
        // Open PDF for sub-category nodes
        window.open(nodeData.originalData.pdf_url, "_blank");
      }
    });

    // Click on stage to deselect
    sigma.on("clickStage", () => {
      setSelectedNode(null);
    });

    // Node hover effects
    sigma.on("enterNode", (event) => {
      const nodeId = event.node;
      sigma.getGraph().setNodeAttribute(nodeId, "highlighted", true);
      sigma.refresh();
    });

    sigma.on("leaveNode", (event) => {
      const nodeId = event.node;
      sigma.getGraph().setNodeAttribute(nodeId, "highlighted", false);
      sigma.refresh();
    });
  };

  const toggleChildrenVisibility = (graph, sigma, categoryId) => {
    const isExpanded = showChildren.has(categoryId);

    // Get all child nodes of this category
    graph.forEachNode((nodeId, attributes) => {
      if (attributes.parent === categoryId) {
        graph.setNodeAttribute(nodeId, "hidden", isExpanded);

        // Also toggle the parent-child edges
        graph.forEachEdge(categoryId, nodeId, (edgeId, attributes) => {
          if (attributes.edgeType === "parent-child") {
            graph.setEdgeAttribute(edgeId, "hidden", isExpanded);
          }
        });
      }
    });

    // Update expanded state
    if (isExpanded) {
      setShowChildren((prev) => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    } else {
      setShowChildren((prev) => new Set([...prev, categoryId]));

      // Position children in a circle around parent
      positionChildrenAroundParent(graph, categoryId);
    }

    sigma.refresh();
  };

  const positionChildrenAroundParent = (graph, categoryId) => {
    const parentPos = graph.getNodeAttributes(categoryId);
    const children = [];

    graph.forEachNode((nodeId, attributes) => {
      if (attributes.parent === categoryId) {
        children.push(nodeId);
      }
    });

    if (children.length === 0) return;

    const radius = 100;
    const angleStep = (2 * Math.PI) / children.length;

    children.forEach((childId, index) => {
      const angle = index * angleStep;
      const x = parentPos.x + radius * Math.cos(angle);
      const y = parentPos.y + radius * Math.sin(angle);

      graph.setNodeAttribute(childId, "x", x);
      graph.setNodeAttribute(childId, "y", y);
    });
  };

  const applyLayout = (graph) => {
    // Apply layout for categories
    const categoryNodes = [];
    graph.forEachNode((node, attributes) => {
      if (attributes.nodeType === "category") {
        categoryNodes.push(node);
      }
    });

    console.log(`Category nodes found: ${categoryNodes.length}`, categoryNodes);

    // Position categories based on count
    if (categoryNodes.length === 3) {
      // For 3 nodes, position them in a triangle
      const positions = [
        { x: 400, y: 200 }, // Top
        { x: 200, y: 400 }, // Bottom left
        { x: 600, y: 400 }, // Bottom right
      ];

      categoryNodes.forEach((nodeId, index) => {
        const pos = positions[index];
        console.log(`Positioning category ${nodeId} at (${pos.x}, ${pos.y})`);
        graph.setNodeAttribute(nodeId, "x", pos.x);
        graph.setNodeAttribute(nodeId, "y", pos.y);
      });
    } else {
      // Circular layout for all other counts (including 7)
      const centerX = 500;
      const centerY = 400;
      const radius = 300;
      const angleStep = (2 * Math.PI) / categoryNodes.length;

      categoryNodes.forEach((nodeId, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        console.log(`Positioning category ${nodeId} at (${x}, ${y})`);
        graph.setNodeAttribute(nodeId, "x", x);
        graph.setNodeAttribute(nodeId, "y", y);
      });
    }

    // Position subcategories near their parents but visible
    graph.forEachNode((nodeId, attributes) => {
      if (attributes.nodeType === "sub-category" && attributes.parent) {
        const parentPos = graph.getNodeAttributes(attributes.parent);
        if (parentPos) {
          const offsetX = (Math.random() - 0.5) * 100;
          const offsetY = (Math.random() - 0.5) * 100;
          graph.setNodeAttribute(nodeId, "x", parentPos.x + offsetX);
          graph.setNodeAttribute(nodeId, "y", parentPos.y + offsetY);
        }
      }
    });
  };

  const resetLayout = () => {
    if (graphRef.current && sigmaRef.current) {
      applyLayout(graphRef.current);
      sigmaRef.current.refresh();
    }
  };

  const fitToScreen = () => {
    if (sigmaRef.current) {
      sigmaRef.current.getCamera().animatedReset({ duration: 1000 });
    }
  };

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="relative w-full h-full">
        <div
          className="w-full h-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center"
          style={{ minHeight: "600px" }}
        >
          <div className="text-center p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Graph Error
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Graph container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg"
        style={{ minHeight: "600px" }}
      />

      {/* Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <button
          onClick={resetLayout}
          className="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 text-sm"
        >
          Reset Layout
        </button>
        <button
          onClick={fitToScreen}
          className="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700 text-sm"
        >
          Fit to Screen
        </button>
        <button
          onClick={() => {
            console.log("=== Debug Graph State ===");
            if (graphRef.current) {
              console.log(`Total nodes: ${graphRef.current.order}`);
              graphRef.current.forEachNode((nodeId, attributes) => {
                console.log(
                  `${nodeId}: ${attributes.label}, type=${
                    attributes.nodeType
                  }, visible=${!attributes.hidden}, pos=(${attributes.x}, ${
                    attributes.y
                  })`
                );
              });
            }
          }}
          className="bg-purple-600 text-white px-3 py-2 rounded shadow hover:bg-purple-700 text-sm"
        >
          Debug
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-sm mb-3">Research Categories</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Muscle Physiology</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Immune Response</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Plant Biology</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Radiation Biology</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Microgravity Effects</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-pink-500"></div>
            <span>Cardiovascular Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>Neurological Changes</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-gray-600">
              Click categories to expand & open PDFs
            </p>
            <p className="text-gray-600">Click studies to open PDFs</p>
            <p className="text-gray-600 mt-1">
              {data?.nodes?.filter((n) => n.type === "category")?.length || 0}{" "}
              categories,{" "}
              {data?.nodes?.filter((n) => n.type === "sub-category")?.length ||
                0}{" "}
              studies
            </p>
          </div>
        </div>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold text-sm mb-2">Selected Node</h3>
          <p className="text-xs text-gray-600">
            {graphRef.current?.getNodeAttribute(selectedNode, "label")}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Type: {graphRef.current?.getNodeAttribute(selectedNode, "nodeType")}
          </p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
