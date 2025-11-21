"use client";

import * as THREE from "three";

// Define custom types for the React Three Fiber objects
interface R3FCanvas extends HTMLCanvasElement {
  __r3f?: {
    root?: {
      renderer?: THREE.WebGLRenderer;
    };
  };
}

// Custom interface for THREE.Object3D with static properties
interface THREEStatic {
  Object3D: {
    _threesIdCount?: number;
    prototype: THREE.Object3D;
    new(): THREE.Object3D;
  };
}

/**
 * Helper to enhance WebGL renderer with context loss handling
 * @param renderer The Three.js WebGL renderer instance
 */
export function setupContextLossHandling(renderer: THREE.WebGLRenderer) {
  if (!renderer) return;

  // Get canvas from renderer
  const canvas = renderer.domElement;

  // Add context lost event listener
  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      console.warn("WebGL context lost. Attempting to restore...");
    },
    false
  );

  // Add context restored event listener
  canvas.addEventListener(
    "webglcontextrestored",
    () => {
      console.log("WebGL context restored. Reinitializing renderer...");
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    },
    false
  );

  return renderer;
}

/**
 * Reduce memory usage of Three.js renderer
 * @param renderer The Three.js WebGL renderer
 */
export function optimizeRenderer(renderer: THREE.WebGLRenderer) {
  if (!renderer) return;

  // Reduce memory usage
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Disable unnecessary features
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  return renderer;
}

/**
 * Dispose Three.js objects properly to prevent memory leaks
 * @param obj Three.js object to dispose
 */
export function disposeObject(obj: THREE.Object3D) {
  if (!obj) return;

  // Traverse the object and dispose all geometries and materials
  obj.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

/**
 * Helper to dispose Three.js materials
 * @param material Material to dispose
 */
function disposeMaterial(material: THREE.Material) {
  if (!material) return;

  // Dispose textures
  const materialAny = material as any;

  // Check for common texture properties
  if (materialAny.map) materialAny.map.dispose();
  if (materialAny.lightMap) materialAny.lightMap.dispose();
  if (materialAny.bumpMap) materialAny.bumpMap.dispose();
  if (materialAny.normalMap) materialAny.normalMap.dispose();
  if (materialAny.specularMap) materialAny.specularMap.dispose();
  if (materialAny.envMap) materialAny.envMap.dispose();

  // Dispose material
  material.dispose();
}

/**
 * Simple function to help clean up WebGL contexts
 */
export function cleanupWebGLContexts() {
  console.log("Cleaning up WebGL contexts");
  
  // Cancel animation frames
  try {
    const highestId = window.requestAnimationFrame(() => {});
    for (let i = 0; i < highestId; i++) {
      window.cancelAnimationFrame(i);
    }
  } catch (e) {
    console.error("Error canceling animation frames:", e);
  }
}

/**
 * Create a WebGL renderer with optimal settings for React Three Fiber
 */
export function createOptimizedRenderer(canvas: HTMLCanvasElement) {
  // Check if canvas already has a WebGL context
  try {
    const existingContext =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    // If there's an existing context, try to lose it first
    if (existingContext && "getExtension" in existingContext) {
      const ext = existingContext.getExtension("WEBGL_lose_context");
      if (ext) {
        ext.loseContext();
      }
    }
  } catch (e) {
    console.warn("Error checking for existing WebGL context:", e);
  }

  // Create renderer with optimized settings
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });

  // Apply optimizations
  setupContextLossHandling(renderer);
  optimizeRenderer(renderer);

  return renderer;
}
