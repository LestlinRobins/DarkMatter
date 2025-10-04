import React from "react";
import KnowledgeGraph from "./components/KnowledgeGraph";
import { knowledgeGraphData } from "./data/knowledgeGraphData";

function App() {
  return <KnowledgeGraph data={knowledgeGraphData} />;
}

export default App;
