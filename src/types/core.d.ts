/**
 * Core type definitions for relativistic calculations and transformations
 */

/**
 * Represents velocity in meters per second.
 * Must be less than the speed of light (299,792,458 m/s)
 */
export type RelativeVelocity = number;

/**
 * Represents the Lorentz factor (gamma).
 * Must be greater than or equal to 1
 */
export type LorentzFactor = number;

/**
 * Represents time intervals in seconds
 */
export type TimeInterval = number;

/**
 * Three-dimensional spatial coordinates
 */
export interface Coordinates {
    x: number;
    y: number;
    z: number;
}

/**
 * Represents a reference frame with position and velocity
 */
export interface ReferenceFrame {
    position: Coordinates;
    velocity: RelativeVelocity;
    orientation?: Orientation;
}

/**
 * Spatial orientation in three dimensions using Euler angles
 */
export interface Orientation {
    pitch: number;  // Rotation around X-axis in radians
    yaw: number;    // Rotation around Y-axis in radians
    roll: number;   // Rotation around Z-axis in radians
}

/**
 * Result of a relativistic transformation
 */
export interface TransformationResult {
    time: TimeInterval;
    position: Coordinates;
    properTime: TimeInterval;
    lorentzFactor: LorentzFactor;
}

/**
 * Configuration options for relativistic calculations
 */
export interface CalculationOptions {
    precision?: number;        // Number of decimal places for calculations
    usePreciseFormulas?: boolean;  // Use more computationally intensive but precise formulas
    throwOnInvalid?: boolean; // Whether to throw errors on invalid inputs
}