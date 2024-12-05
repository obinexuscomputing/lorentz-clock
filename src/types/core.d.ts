/**
 * Core type definitions for relativistic calculations and transformations
 */

export declare namespace Physics {
    /**
     * Standard SI units for physical quantities
     */
    export type MetersPerSecond = number;
    export type Seconds = number;
    export type Radians = number;
}

/**
 * Represents velocity in meters per second.
 * Must be less than the speed of light (299,792,458 m/s)
 */
export type RelativeVelocity = Physics.MetersPerSecond;

/**
 * Represents the Lorentz factor (gamma).
 * Must be greater than or equal to 1
 */
export type LorentzFactor = number;

/**
 * Represents time intervals in seconds
 */
export type TimeInterval = Physics.Seconds;

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
    pitch: Physics.Radians;  // Rotation around X-axis in radians
    yaw: Physics.Radians;    // Rotation around Y-axis in radians
    roll: Physics.Radians;   // Rotation around Z-axis in radians
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

/**
 * Constants used in relativistic calculations
 */
export const Physics = {
    SPEED_OF_LIGHT: 299792458,
    GRAVITATIONAL_CONSTANT: 6.67430e-11,
    PLANCK_CONSTANT: 6.62607015e-34
} as const;