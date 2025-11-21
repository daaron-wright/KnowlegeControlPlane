# 3D Multi-Modal (3DM2M) Visualization Component

This is a self-contained 3D visualization component for displaying and transitioning between two different directed acyclic graphs (DAGs). It's built with React, Three.js, and React Three Fiber.

## Features

- Interactive 3D visualization of two different DAGs (Government and Health)
- Smooth zoom transitions between the two views
- Customizable node colors, sizes, and labels
- Curved connections between nodes
- Highlighting of important nodes
- Camera controls for panning, zooming, and rotating
- Double-click to transition from Government to Health DAG
- Back button to return to Government DAG

## Installation

1. Copy the entire `3dm2m` folder into your project's `components` directory
2. Make sure you have the required dependencies:

\`\`\`bash
npm install three @react-three/fiber @react-three/drei
\`\`\`

## Usage

Import and use the component in your Next.js or React application:

\`\`\`jsx
import ThreeDimensionalDAG from '@/components/3dm2m'

export default function YourPage() {
  return (
    <div className="w-full h-screen">
      <ThreeDimensionalDAG />
    </div>
  )
}
\`\`\`

### Interactions

- **Double-click** on the Government DAG to zoom into the Ministry of Health node and transition to the Health DAG
- Click the **Back to Main View** button to return to the Government DAG
- Use **mouse drag** to rotate the view
- Use **scroll wheel** to zoom in/out
- Use **right-click drag** to pan the view

## Customization

You can customize the visualization by modifying the data files:

- `data/government-entities.ts` - Contains the data for the government entities DAG
- `data/graph-data.ts` - Contains the data for the health DAG

### Node Properties

Each node can have the following properties:
- `id`: Unique identifier for the node
- `label`: Display text for the node
- `type`: Type of node, used for coloring
- `cluster`: Group the node belongs to (for health DAG)
- `parent`: Parent node ID (for hierarchical relationships)
- `isHighlighted`: Whether the node should be highlighted

### Styling

You can modify the colors and styling in:
- `dag-visualization.tsx` - Contains color mappings for different node types
- `components/dag-elements.tsx` - Contains styling for nodes and connections

## Structure

- `index.tsx` - Main entry point component with dynamic import and suspense
- `dag-visualization.tsx` - Core visualization logic and transition handling
- `components/dag-elements.tsx` - Reusable 3D elements (nodes, lines)
- `data/` - Data files for both DAGs
- `types/` - TypeScript type definitions
- `utils/` - Utility functions for animations and calculations

## Dependencies

- React
- Three.js
- @react-three/fiber
- @react-three/drei

## Troubleshooting

- If you see a blank screen, make sure the container has a defined height (e.g., `h-screen` or a specific height)
- If you get Three.js related errors, check that all dependencies are properly installed
- For SSR issues, the component uses dynamic import with `ssr: false` to prevent server-side rendering problems

## License

MIT
