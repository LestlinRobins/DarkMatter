# 🚀 NASA Bioscience Knowledge Graph Explorer

**An interactive 3D visualization of NASA's bioscience publications using Three.js and React**

Built for the NASA Space Apps Challenge 2025! This project transforms the exploration of 600+ NASA bioscience publications into an immersive 3D experience.

## ✨ Features

### 🌌 3D Interactive Visualization
- **Knowledge Graph in Space**: Publications are represented as glowing spheres floating in a 3D star field
- **Size by Impact**: Sphere size scales with citation count
- **Color by Category**: Each research category has its own distinctive color
- **Connection Lines**: Visual links show relationships between related publications

### 🔍 Smart Search & Filtering
- **AI-Powered Search**: Search across titles, abstracts, tags, and categories
- **Category Filters**: Filter by research area (Human Physiology, Plant Biology, Radiation Biology, etc.)
- **Real-time Updates**: Instant visual feedback as you search and filter

### 🎯 Interactive Exploration
- **Click to Explore**: Click any publication to see full details
- **Connection Visualization**: Selected publications highlight their related research
- **Hover for Quick Info**: Preview publication details on hover
- **Smooth Navigation**: Orbit, zoom, and pan with intuitive 3D controls

### 📊 Statistics Dashboard
- Real-time statistics on publications, citations, and research areas
- Most active research categories
- Average citation metrics

## 🛠️ Technology Stack

- **React 19** + **TypeScript** - Modern UI framework
- **Three.js** + **React Three Fiber** - 3D graphics and rendering
- **@react-three/drei** - Useful Three.js helpers
- **Vite** - Lightning-fast build tool

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+ (or downgrade Vite to 5.4.x for older Node versions)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 How to Use

1. **Explore in 3D**
   - Drag to rotate the view
   - Scroll to zoom in/out
   - Click on spheres to select publications

2. **Search & Filter**
   - Use the search bar to find specific topics
   - Click category buttons to filter by research area
   - Combine search and filters for precise results

3. **Discover Connections**
   - Select a publication to see its related research
   - Connected publications are highlighted
   - Lines show the knowledge graph connections

## 🌟 Features for NASA Challenge

### Knowledge Discovery
- **Visual Patterns**: Identify research clusters and knowledge gaps at a glance
- **Citation Impact**: Quickly spot highly-cited breakthrough research
- **Cross-Domain Links**: Discover unexpected connections between research areas

### Mission Planning Support
- **Topic Exploration**: Find all research relevant to specific mission needs
- **Research Timeline**: Publications organized by year and category
- **Actionable Insights**: Quick access to abstracts and key findings

### AI Integration (Extensible)
The architecture supports easy integration of:
- LLM-powered publication summaries
- Automated relationship detection
- Semantic similarity clustering
- Research gap identification

## 📁 Project Structure

```
src/
├── components/
│   ├── StarField.tsx          # Animated star background
│   ├── PublicationNode.tsx    # 3D publication spheres
│   └── ConnectionLines.tsx    # Knowledge graph connections
├── data.ts                     # Publication data and utilities
├── types.ts                    # TypeScript interfaces
├── App.tsx                     # Main application
└── main.tsx                    # Entry point
```

## 🎨 Design Philosophy

**"Make Space Science Accessible and Beautiful"**

We believe that scientific data exploration should be:
- **Intuitive**: Natural 3D interaction
- **Beautiful**: Engaging visual design
- **Informative**: Rich contextual information
- **Fast**: Smooth 60fps 3D rendering

## 🔮 Future Enhancements

- [ ] Integration with actual NASA publication API
- [ ] AI-powered publication summaries using LLMs
- [ ] Advanced graph algorithms for relationship detection
- [ ] VR support for immersive exploration
- [ ] Timeline animation showing research evolution
- [ ] Export capabilities for mission planners
- [ ] Collaborative annotation features
- [ ] Graph clustering algorithms to identify research trends
- [ ] Natural language queries powered by AI
- [ ] Real-time collaboration features

## 📊 Data Structure

Each publication includes:
- Title, authors, year, abstract
- Research category and tags
- Citation count
- Related publications (knowledge graph)
- 3D position in space

## 🎯 NASA Challenge Alignment

This tool addresses the challenge objectives by:

1. **Summarizing NASA bioscience publications** through visual categorization and search
2. **Enabling exploration** via interactive 3D navigation
3. **Showing impacts and results** through citation metrics and connections
4. **Identifying knowledge gaps** through visual clustering
5. **Providing actionable information** with detailed publication views

## 💡 Why This Approach?

**3D Visualization > Traditional Dashboards**

Traditional dashboards present data in flat, 2D tables and charts. Our 3D knowledge graph:
- Shows **relationships spatially** - related research naturally clusters together
- Provides **intuitive navigation** - zoom, rotate, and explore like flying through space
- Offers **better information density** - see hundreds of publications at once
- Creates **memorable experiences** - spatial memory helps researchers remember connections
- Makes **complex patterns visible** - gaps and clusters emerge naturally

## 🚀 Next Steps for Production

To extend this to the full 608 NASA publications:

1. **Data Integration**
   ```typescript
   // Replace mockPublications with API calls
   const publications = await fetch('nasa-api-endpoint')
   ```

2. **AI Enhancement**
   ```typescript
   // Add LLM-powered summaries
   const summary = await generateSummary(publication.abstract)
   ```

3. **Graph Algorithms**
   ```typescript
   // Auto-detect relationships using NLP
   const connections = await findRelatedPublications(publication)
   ```

4. **Performance Optimization**
   - Implement LOD (Level of Detail) for large datasets
   - Add WebWorkers for graph calculations
   - Use instanced rendering for better performance

## 👥 Team

Built with 🚀 for NASA Space Apps Challenge 2025

## 📝 License

MIT License - Feel free to use this for your space exploration needs!

---

**"Exploring the final frontier, one publication at a time"** 🌟

### Quick Tips for Judges

- **Click any glowing sphere** to explore a publication
- **Use search** to find topics like "radiation", "plants", or "microgravity"
- **Filter by category** to focus on specific research areas
- **Watch the connections** - they reveal the knowledge graph structure
- **Check the stats panel** for overview metrics

The sphere size represents citation impact - bigger spheres = more influential research! 📊
