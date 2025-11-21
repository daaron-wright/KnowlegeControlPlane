// Animation utility functions

/**
 * Cubic easing function for smoother animations
 * @param t Progress value between 0 and 1
 * @returns Eased value between 0 and 1
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Linear interpolation between two values
 * @param start Start value
 * @param end End value
 * @param t Progress value between 0 and 1
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}
