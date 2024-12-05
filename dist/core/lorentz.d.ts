import { RelativeVelocity, LorentzFactor } from '../types/core';
/**
 * Physical constants used in relativistic calculations
 */
export declare const SPEED_OF_LIGHT: number;
export declare const MAX_SAFE_VELOCITY: number;
export declare const MIN_SAFE_VELOCITY: number;
export declare const MAX_LORENTZ_FACTOR: number;
/**
 * Calculates the Lorentz factor (γ) based on relative velocity
 * γ = 1 / √(1 - v²/c²)
 *
 * @param velocity - Relative velocity in meters per second
 * @returns The calculated Lorentz factor
 * @throws {Error} If velocity is outside safe bounds
 */
export declare function calculateLorentzFactor(velocity: RelativeVelocity): LorentzFactor;
/**
 * Validates if a given velocity is physically possible and within safe computational bounds
 *
 * @param velocity - Velocity to validate in meters per second
 * @returns True if velocity is valid and safe to use
 */
export declare function isValidVelocity(velocity: number): boolean;
/**
 * Calculates velocity from a given Lorentz factor
 * v = c * √(1 - 1/γ²)
 *
 * @param lorentzFactor - The Lorentz factor (must be ≥ 1 and ≤ MAX_LORENTZ_FACTOR)
 * @returns The corresponding velocity in meters per second
 * @throws {Error} If Lorentz factor is invalid
 */
export declare function velocityFromLorentzFactor(lorentzFactor: LorentzFactor): RelativeVelocity;
