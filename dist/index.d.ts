/**
 * Core type definitions for relativistic calculations and transformations
 */
/**
 * Namespace containing standard SI units and physical quantities
 */
declare namespace Physics {
    type MetersPerSecond = number;
    type Seconds = number;
    type Radians = number;
    const SPEED_OF_LIGHT = 299792458;
    const GRAVITATIONAL_CONSTANT = 6.6743e-11;
    const PLANCK_CONSTANT = 6.62607015e-34;
}
/**
 * Represents velocity in meters per second.
 * Must be less than the speed of light (299,792,458 m/s)
 */
type RelativeVelocity = Physics.MetersPerSecond;
/**
 * Represents the Lorentz factor (gamma).
 * Must be greater than or equal to 1
 */
type LorentzFactor = number;
/**
 * Represents time intervals in seconds
 */
type TimeInterval = Physics.Seconds;
/**
 * Three-dimensional spatial coordinates
 */
interface Coordinates {
    x: number;
    y: number;
    z: number;
}
/**
 * Represents a reference frame with position and velocity
 */
interface ReferenceFrame {
    position: Coordinates;
    velocity: RelativeVelocity;
    orientation?: Orientation;
}
/**
 * Spatial orientation in three dimensions using Euler angles
 */
interface Orientation {
    pitch: Physics.Radians;
    yaw: Physics.Radians;
    roll: Physics.Radians;
}
/**
 * Result of a relativistic transformation
 */
interface TransformationResult {
    time: TimeInterval;
    position: Coordinates;
    properTime: TimeInterval;
    lorentzFactor: LorentzFactor;
}
/**
 * Configuration options for relativistic calculations
 */
interface CalculationOptions {
    precision?: number;
    usePreciseFormulas?: boolean;
    throwOnInvalid?: boolean;
}

export { CalculationOptions, Coordinates, LorentzFactor, Orientation, Physics, ReferenceFrame, RelativeVelocity, TimeInterval, TransformationResult };
