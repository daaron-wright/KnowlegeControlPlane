"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "@/styles/video-fadein.css";

interface AnimatedOmnisImageProps {
  className?: string;
}

export function AnimatedOmnisImage({
  className = "",
}: AnimatedOmnisImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Neural network animation
  useEffect(() => {
    console.log("Effect running, isLoaded:", isLoaded);
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return; // Only run when image is loaded

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create a more elegant neural network with better distribution
    // Define constants
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;
    const faceY = canvas.height * 0.42; // Face center Y position

    // Grid-based distribution constants
    const GRID_COLS = 10;
    const GRID_ROWS = 12;
    const CELL_WIDTH = canvas.width / GRID_COLS;
    const CELL_HEIGHT = canvas.height / GRID_ROWS;

    // Create nodes for the neural network
    const nodes: Node[] = [];
    const faceNodes: Node[] = []; // Special nodes around the face
    const bodyNodes: Node[] = []; // Special nodes for the body
    const numNodes = 25; // Regular nodes
    const numFaceNodes = 15; // Face-specific nodes
    const numBodyNodes = 12; // Body-specific nodes

    // Position constants - adjust based on image proportions
    const headCenterY = canvas.height * 0.42; // Positioned at the head
    const faceRadius = canvas.width * 0.12; // Radius around the face
    const bodyCenterY = canvas.height * 0.65; // Center of the body/torso

    // Create face nodes in a semi-circular pattern around the head
    for (let i = 0; i < numFaceNodes; i++) {
      // Distribute nodes in a half circle around the face
      const angle = Math.PI * 1.3 * (i / numFaceNodes) - Math.PI * 0.65; // -0.65π to 0.65π

      // Add some randomness to the radius
      const radiusVariation = Math.random() * 0.05 + 0.98;
      const x = centerX + Math.cos(angle) * faceRadius * radiusVariation;
      const y =
        headCenterY + Math.sin(angle) * faceRadius * 1.2 * radiusVariation; // Slightly elliptical

      faceNodes.push({
        x,
        y,
        radius: Math.random() * 2 + 2.5, // Medium-sized nodes
        speed: Math.random() * 0.15 + 0.1,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        active: Math.random() > 0.4, // More often active
        activationTime: 0,
      });
    }

    // Create body nodes in a vertical pattern down the torso
    for (let i = 0; i < numBodyNodes; i++) {
      // Distribute nodes along a vertical line with some randomness
      const progress = i / (numBodyNodes - 1); // 0 to 1
      const verticalPosition =
        headCenterY + (bodyCenterY - headCenterY) * progress * 1.8;

      // Add some horizontal variation
      const horizontalOffset = (Math.random() - 0.5) * faceRadius * 0.8;

      bodyNodes.push({
        x: centerX + horizontalOffset,
        y: verticalPosition,
        radius: Math.random() * 2 + 2,
        speed: Math.random() * 0.15 + 0.1,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        active: Math.random() > 0.6,
        activationTime: 0,
      });
    }

    // Create grid-based nodes with some randomness
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        // Skip some cells randomly for natural look
        if (Math.random() > 0.7) continue;

        // Add randomness within each cell
        const x = col * CELL_WIDTH + CELL_WIDTH * (Math.random() * 0.6 + 0.2);
        const y = row * CELL_HEIGHT + CELL_HEIGHT * (Math.random() * 0.6 + 0.2);

        // Calculate distances from center and face for positioning logic
        const distFromCenter = Math.sqrt(
          Math.pow((x - centerX) / (canvas.width * 0.5), 2) +
            Math.pow((y - centerY) / (canvas.height * 0.5), 2)
        );

        const distFromFace = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - faceY, 2)
        );

        // Skip most nodes in the center area (behind the figure)
        const isCentralArea = distFromFace < canvas.width * 0.2;
        if (isCentralArea && Math.random() > 0.1) continue; // Skip 90% of central nodes

        // Skip more nodes in the center columns
        const isCentralColumn =
          col >= GRID_COLS * 0.4 && col <= GRID_COLS * 0.6;
        if (isCentralColumn && Math.random() > 0.3) continue;

        // Determine node properties based on position
        let radius = Math.random() * 1.5 + 1; // Default small radius
        let active = Math.random() > 0.7;

        // Make nodes appear larger near edges for depth perception
        if (distFromCenter > 0.75) {
          radius = Math.random() * 2 + 2; // Larger nodes near edges
          active = Math.random() > 0.5; // More likely to be active
        }

        // Smaller nodes near face for subtlety
        if (isCentralArea) {
          radius = Math.random() * 0.8 + 0.6; // Even smaller for less visibility behind head
          active = Math.random() > 0.7; // Less likely to be active
        }

        // Add the node
        nodes.push({
          x,
          y,
          radius,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          active,
          activationTime: 0,
          connections: [],
        });
      }
    }

    // Add additional side nodes to compensate for fewer central nodes
    const addSideNodes = () => {
      const NUM_SIDE_NODES = 30; // Reduced from 40 to 30 for less clutter

      for (let i = 0; i < NUM_SIDE_NODES; i++) {
        // Choose which side (left/right)
        const isRightSide = Math.random() > 0.5;

        // Position logic - place nodes along the sides
        let x, y;

        if (isRightSide) {
          // Right side - create a fuller distribution
          const distanceFromCenter = 0.2 + Math.random() * 0.3; // 20-50% of width from center
          x = centerX + canvas.width * distanceFromCenter;
        } else {
          // Left side - create a fuller distribution
          const distanceFromCenter = 0.2 + Math.random() * 0.3; // 20-50% of width from center
          x = centerX - canvas.width * distanceFromCenter;
        }

        // Distribute vertically with fuller coverage
        y = Math.random() * canvas.height * 0.9 + canvas.height * 0.05;

        // Add the node
        nodes.push({
          x,
          y,
          radius: Math.random() * 2 + 1.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.04 + 0.02,
          active: Math.random() > 0.4, // More likely to be active
          activationTime: 0,
          connections: [],
        });
      }

      // Add nodes specifically in the corners for better surrounding effect
      const addCornerNodes = () => {
        const NUM_CORNER_NODES = 16; // Reduced from 20 to 16 for less clutter

        for (let i = 0; i < NUM_CORNER_NODES; i++) {
          // Choose which corner
          const corner = Math.floor(Math.random() * 4);
          let x = 0; // Initialize with default
          let y = 0; // Initialize with default

          switch (corner) {
            case 0: // Top-Left
              x = Math.random() * canvas.width * 0.25;
              y = Math.random() * canvas.height * 0.25;
              break;
            case 1: // Top-Right
              x = canvas.width * 0.75 + Math.random() * canvas.width * 0.25;
              y = Math.random() * canvas.height * 0.25;
              break;
            case 2: // Bottom-Left
              x = Math.random() * canvas.width * 0.25;
              y = canvas.height * 0.75 + Math.random() * canvas.height * 0.25;
              break;
            case 3: // Bottom-Right
              x = canvas.width * 0.75 + Math.random() * canvas.width * 0.25;
              y = canvas.height * 0.75 + Math.random() * canvas.height * 0.25;
              break;
          }

          nodes.push({
            x,
            y,
            radius: Math.random() * 2.5 + 1.5, // Slightly larger for corners
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.05 + 0.02,
            active: Math.random() > 0.3, // More likely to be active
            activationTime: 0,
            connections: [],
          });
        }
      };

      addCornerNodes();

      // Add a few nodes above and below to balance the distribution
      const NUM_VERTICAL_NODES = 20; // Reduced from 25 to 20 for less clutter

      for (let i = 0; i < NUM_VERTICAL_NODES; i++) {
        // Choose top or bottom
        const isTop = Math.random() > 0.5;

        // Position logic - avoid center for X position
        let x;
        const xPosition = Math.random();

        if (xPosition < 0.4) {
          // Left portion
          x = Math.random() * canvas.width * 0.3;
        } else if (xPosition > 0.6) {
          // Right portion
          x = canvas.width * 0.7 + Math.random() * canvas.width * 0.3;
        } else {
          // Middle portion (sides of center)
          const side = Math.random() > 0.5 ? 1 : -1;
          x =
            centerX +
            side * (canvas.width * 0.15 + Math.random() * canvas.width * 0.15);
        }

        let y;

        if (isTop) {
          // Top area
          y = Math.random() * canvas.height * 0.15;
        } else {
          // Bottom area
          y = canvas.height * 0.85 + Math.random() * canvas.height * 0.15;
        }

        // Add the node
        nodes.push({
          x,
          y,
          radius: Math.random() * 2 + 1.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.04 + 0.02,
          active: Math.random() > 0.4,
          activationTime: 0,
          connections: [],
        });
      }
    };

    addSideNodes();

    // Add chest/bottom area nodes with more refined and diverse patterns
    const addChestAreaNodes = () => {
      const NUM_CHEST_NODES = 16; // Reduced from 20 to 16 for less clutter
      const chestCenterY = canvas.height * 0.7; // Position below face, in chest area

      for (let i = 0; i < NUM_CHEST_NODES; i++) {
        // Create a more balanced horizontal spread in the chest area
        let x, y;

        // More diverse positioning - create patterns with varying angles
        const angle = Math.random() * Math.PI * 2; // Full 360-degree distribution
        const distanceFromCenter = Math.random() * 0.25 + 0.15; // 15-40% of width from center

        // Use polar coordinates for more diverse distribution
        x = centerX + Math.cos(angle) * canvas.width * distanceFromCenter;

        // For y, use a more controlled distribution focused on chest area
        if (angle > Math.PI * 0.25 && angle < Math.PI * 0.75) {
          // Bottom half - place lower in chest
          y = chestCenterY + canvas.height * (0.05 + Math.random() * 0.1);
        } else if (angle > Math.PI * 1.25 && angle < Math.PI * 1.75) {
          // Top half - place higher in chest
          y = chestCenterY - canvas.height * (0.03 + Math.random() * 0.07);
        } else {
          // Sides - more variance in height
          y = chestCenterY + canvas.height * (Math.random() * 0.2 - 0.1);
        }

        nodes.push({
          x,
          y,
          radius: Math.random() * 1.6 + 1.0, // Slightly smaller for less clutter
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.02,
          active: Math.random() > 0.5, // Balanced activation likelihood
          activationTime: 0,
          connections: [],
        });
      }
    };

    addChestAreaNodes();

    // Add connections
    const connectNodes = () => {
      // Create connections between nodes - use Delaunay-inspired approach for natural-looking network
      const MAX_CONNECTIONS = 2; // Reduced from 3 to 2 for less clutter
      const MAX_DISTANCE = canvas.width * 0.25; // Reduced from 0.3 to 0.25 for less clutter

      // Connect all nodes including face, body, side, and chest nodes
      const allNodes = [...nodes];

      // For each node, find potential connections
      for (let i = 0; i < allNodes.length; i++) {
        const node = allNodes[i];
        const connections = [];

        // Find potential connections
        for (let j = 0; j < allNodes.length; j++) {
          if (i === j) continue;

          const target = allNodes[j];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MAX_DISTANCE) {
            connections.push({ index: j, distance });
          }
        }

        // Sort by distance and take closest ones
        connections.sort((a, b) => a.distance - b.distance);
        const numConnections = Math.min(
          Math.floor(Math.random() * MAX_CONNECTIONS) + 1,
          connections.length
        );

        // Create connections to closest nodes
        for (let j = 0; j < numConnections; j++) {
          if (j >= connections.length) break;

          // Skip more connections randomly for less density
          if (Math.random() > 0.6) continue; // Increased skip probability from 0.7 to 0.6

          const distance = connections[j].distance;
          const opacity = 1 - distance / MAX_DISTANCE; // Fade with distance

          node.connections.push({
            target: connections[j].index,
            active: Math.random() > 0.5,
            progress: Math.random(),
            speed: Math.random() * 0.006 + 0.002, // Slower for elegance
            width: Math.random() * 0.6 + 0.3, // Thinner lines for elegance (reduced max width)
          });
        }
      }

      // Add side-to-side connections specifically
      const addSideToSideConnections = () => {
        const NUM_CROSS_CONNECTIONS = 10; // Reduced from 15 to 10 for less clutter

        for (let i = 0; i < NUM_CROSS_CONNECTIONS; i++) {
          // Find nodes on opposite sides
          let leftNode = null;
          let rightNode = null;
          let leftIndex = -1;
          let rightIndex = -1;

          // Find a suitable left node
          for (let j = 0; j < 20; j++) {
            // Try up to 20 times
            const randomIndex = Math.floor(Math.random() * allNodes.length);
            const node = allNodes[randomIndex];

            if (node.x < centerX - canvas.width * 0.15) {
              leftNode = node;
              leftIndex = randomIndex;
              break;
            }
          }

          // Find a suitable right node
          for (let j = 0; j < 20; j++) {
            // Try up to 20 times
            const randomIndex = Math.floor(Math.random() * allNodes.length);
            const node = allNodes[randomIndex];

            if (node.x > centerX + canvas.width * 0.15) {
              rightNode = node;
              rightIndex = randomIndex;
              break;
            }
          }

          // Connect if both nodes found
          if (leftNode && rightNode) {
            leftNode.connections.push({
              target: rightIndex,
              active: true,
              progress: Math.random(),
              speed: Math.random() * 0.003 + 0.001, // Slower for elegance
              width: Math.random() * 0.6 + 0.3, // Thinner lines
            });

            // Sometimes make bidirectional
            if (Math.random() > 0.7) {
              // Reduced probability from 0.6 to 0.7
              rightNode.connections.push({
                target: leftIndex,
                active: true,
                progress: Math.random(),
                speed: Math.random() * 0.003 + 0.001,
                width: Math.random() * 0.6 + 0.3,
              });
            }
          }
        }
      };

      // Add a few long-distance connections across the canvas for visual interest
      const addLongConnections = () => {
        const LONG_CONNECTIONS = 15; // Reduced from 25 to 15 for less clutter
        for (let i = 0; i < LONG_CONNECTIONS; i++) {
          const sourceIndex = Math.floor(Math.random() * allNodes.length);
          const targetIndex = Math.floor(Math.random() * allNodes.length);

          if (sourceIndex !== targetIndex) {
            // Ensure we're connecting across significant distance
            const source = allNodes[sourceIndex];
            const target = allNodes[targetIndex];
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > canvas.width * 0.35) {
              // Increased minimum distance for long connections
              source.connections.push({
                target: targetIndex,
                active: true,
                progress: Math.random(),
                speed: Math.random() * 0.004 + 0.002,
                width: Math.random() * 0.5 + 0.2, // Even thinner for long connections
              });
            }
          }
        }
      };

      addSideToSideConnections();
      addLongConnections();
    };

    connectNodes();

    // Add more diverse chest connections with varied angles
    const addChestConnections = () => {
      // Find nodes in the chest area
      const chestNodes: { index: number; x: number; y: number }[] = [];

      // Collect chest area nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Identify nodes in the chest region with a wider vertical range
        if (node.y > canvas.height * 0.6 && node.y < canvas.height * 0.85) {
          chestNodes.push({
            index: i,
            x: node.x,
            y: node.y,
          });
        }
      }

      // Create diverse connections - not just horizontal
      const NUM_CHEST_CONNECTIONS = 8; // Reduced from 12 to 8 for less clutter

      for (let i = 0; i < NUM_CHEST_CONNECTIONS; i++) {
        // Find two nodes to connect in the chest area
        let nodeAIndex = -1;
        let nodeBIndex = -1;

        // Find nodes with diverse positioning - not just horizontal connections
        for (let attempts = 0; attempts < 15; attempts++) {
          if (chestNodes.length < 2) break; // Safety check

          const nodeA =
            chestNodes[Math.floor(Math.random() * chestNodes.length)];
          const nodeB =
            chestNodes[Math.floor(Math.random() * chestNodes.length)];

          // Ensure they're different nodes and sufficiently far apart
          if (
            nodeA.index !== nodeB.index &&
            Math.sqrt(
              Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
            ) >
              canvas.width * 0.15
          ) {
            nodeAIndex = nodeA.index;
            nodeBIndex = nodeB.index;
            break;
          }
        }

        // Connect if we found suitable nodes
        if (nodeAIndex !== -1 && nodeBIndex !== -1) {
          // Create diverse connection patterns - not just A→B but occasionally branching
          nodes[nodeAIndex].connections.push({
            target: nodeBIndex,
            active: Math.random() > 0.5,
            progress: Math.random(),
            speed: Math.random() * 0.004 + 0.002,
            width: Math.random() * 0.5 + 0.3, // Slightly thinner
          });

          // Occasionally create diagonal or vertical patterns by adding a third connection
          if (Math.random() > 0.6 && chestNodes.length > 2) {
            // Find a third node to create a triangle or branch
            const nodeC =
              chestNodes[Math.floor(Math.random() * chestNodes.length)];

            // Ensure it's a different node
            if (nodeC.index !== nodeAIndex && nodeC.index !== nodeBIndex) {
              nodes[nodeBIndex].connections.push({
                target: nodeC.index,
                active: Math.random() > 0.4,
                progress: Math.random(),
                speed: Math.random() * 0.004 + 0.002,
                width: Math.random() * 0.5 + 0.3,
              });
            }
          }
        }
      }
    };

    addChestConnections();

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        for (const conn of node.connections) {
          const target = nodes[conn.target];

          // Update connection progress
          if (node.active && !conn.active) {
            conn.active = true;
          }

          if (conn.active) {
            conn.progress += conn.speed;
            if (conn.progress >= 1) {
              conn.progress = 0;
              // Activate the target node
              if (!target.active) {
                target.active = true;
                target.activationTime = 0;
              }
            }
          }

          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${conn.active ? 0.5 : 0.3})`;
          ctx.lineWidth = conn.width;
          ctx.stroke();

          // Draw pulse along the connection if active
          if (conn.active && conn.progress > 0) {
            const pulseX = node.x + (target.x - node.x) * conn.progress;
            const pulseY = node.y + (target.y - node.y) * conn.progress;

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
            ctx.fill();
          }
        }
      }

      // Draw nodes with soft glow
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Update node pulse
        node.pulsePhase += node.pulseSpeed;

        // Update activation time
        if (node.active) {
          node.activationTime += 0.01;
          // Reset activation after some time to create continuous flow
          if (node.activationTime > 5 && Math.random() > 0.99) {
            node.active = false;
          }
        } else if (Math.random() > 0.995) {
          // Randomly activate nodes
          node.active = true;
          node.activationTime = 0;
        }

        // Draw node
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const radius = node.radius * (1 + (node.active ? 0.5 : 0) * pulse);
        const alpha = 0.8 + (node.active ? 0.2 : 0) * pulse;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.fill();

        // Add glow for active nodes
        if (node.active) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.2 * pulse})`;
          ctx.fill();
        }
      }

      // Additional effect: draw subtle facial circuit lines
      const drawFacialCircuits = () => {
        // Right side vertical line
        ctx.beginPath();
        ctx.moveTo(centerX + canvas.width * 0.08, faceY - canvas.height * 0.1);
        ctx.lineTo(centerX + canvas.width * 0.08, faceY + canvas.height * 0.1);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add branch lines
        ctx.beginPath();
        ctx.moveTo(centerX + canvas.width * 0.08, faceY - canvas.height * 0.05);
        ctx.lineTo(centerX + canvas.width * 0.11, faceY - canvas.height * 0.05);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Left side smaller circuit
        ctx.beginPath();
        ctx.moveTo(centerX - canvas.width * 0.06, faceY - canvas.height * 0.08);
        ctx.lineTo(centerX - canvas.width * 0.1, faceY - canvas.height * 0.08);
        ctx.lineTo(centerX - canvas.width * 0.1, faceY - canvas.height * 0.03);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add soft glow to circuits
        ctx.shadowColor = "rgba(56, 189, 248, 0.4)";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(centerX + canvas.width * 0.08, faceY - canvas.height * 0.1);
        ctx.lineTo(centerX + canvas.width * 0.08, faceY + canvas.height * 0.1);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Reset shadow for other elements
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // Additional chest area circuit lines - more subtle and refined
        const drawChestCircuits = () => {
          // Left side horizontal circuit - simplified
          ctx.beginPath();
          ctx.moveTo(centerX - canvas.width * 0.18, canvas.height * 0.68);
          ctx.lineTo(centerX - canvas.width * 0.25, canvas.height * 0.68);
          ctx.lineTo(centerX - canvas.width * 0.25, canvas.height * 0.72);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Right side horizontal circuit - simplified
          ctx.beginPath();
          ctx.moveTo(centerX + canvas.width * 0.18, canvas.height * 0.7);
          ctx.lineTo(centerX + canvas.width * 0.25, canvas.height * 0.7);
          ctx.lineTo(centerX + canvas.width * 0.25, canvas.height * 0.74);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Add subtle glow
          ctx.shadowColor = "rgba(56, 189, 248, 0.2)";
          ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - canvas.width * 0.18, canvas.height * 0.68);
          ctx.lineTo(centerX - canvas.width * 0.25, canvas.height * 0.68);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(centerX + canvas.width * 0.18, canvas.height * 0.7);
          ctx.lineTo(centerX + canvas.width * 0.25, canvas.height * 0.7);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        };

        drawChestCircuits();
      };

      drawFacialCircuits();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isLoaded]); // Only run this effect when isLoaded changes

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background: "#0a1622",
        border: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Scan lines */}
      <div
        className="absolute inset-0 z-5 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(16, 42, 66, 0.5) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Large circular elements similar to the reference image */}
      <div className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center">
        <div
          className="w-[90%] h-[90%] rounded-full border-2 border-cyan-400/30"
          style={{
            boxShadow: "0 0 15px rgba(56, 189, 248, 0.1)",
          }}
        />
        <div
          className="absolute w-[70%] h-[70%] rounded-full border-2 border-cyan-400/40"
          style={{
            boxShadow: "0 0 15px rgba(56, 189, 248, 0.15)",
          }}
        />
      </div>

      {/* Background image with proper styling to fill the entire space */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative w-full h-full opacity-90">
          {/* Image element */}
          <Image
            src="/kyndryl_welcome.png"
            alt="Kyndryl Welcome"
            fill
            className="object-cover animate-fadein-scale"
            style={{
              objectPosition: "center 40%",
            }}
            onLoad={() => {
              console.log("Image loaded successfully");
              setIsLoaded(true);
            }}
            onError={(e) => {
              console.error("Image error:", e);
            }}
            priority
          />
        </div>
      </div>

      {/* Neural network canvas - make it appear even if video doesn't load */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-25 pointer-events-none opacity-100"
      />

      {/* Subtle vignette effect - adjusted to be less prominent at bottom */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(10, 22, 34, 0.2) 90%)",
        }}
      />

      {/* Subtle scan line effect - reduced opacity */}
      <div
        className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent"
        style={{
          backgroundSize: "100% 8px",
          animation: "scanline 8s linear infinite",
        }}
      />

      {/* Add a dark overlay at the bottom to ensure no grey is visible */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#0a1622] z-50"></div>
    </div>
  );
}

// Types for neural network
interface Node {
  x: number;
  y: number;
  radius: number;
  speed?: number; // Make optional to accommodate new node creation style
  connections: Connection[];
  pulsePhase: number;
  pulseSpeed: number;
  active: boolean;
  activationTime: number;
}

interface Connection {
  target: number;
  active: boolean;
  progress: number;
  speed: number;
  width: number;
}
