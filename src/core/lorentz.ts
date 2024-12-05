import { RelativeVelocity, LorentzFactor } from '../types/core';

/**
 * Physical constants used in relativistic calculations
 */
export const SPEED_OF_LIGHT = 299792458; // meters per second

/**
 * Calculates the Lorentz factor (γ) based on relative velocity
 * γ = 1 / √(1 - v²/c²)
 * 
 * @param velocity - Relative velocity in meters per second
 * @returns The calculated Lorentz factor
 * @throws {Error} If velocity is greater than or equal to speed of light
 */
export function calculateLorentzFactor(velocity: RelativeVelocity): LorentzFactor {
    if (Math.abs(velocity) >= SPEED_OF_LIGHT) {
        throw new Error('Velocity must be less than the speed of light');
    }

    const velocityRatio = velocity / SPEED_OF_LIGHT;
    const denominator = Math.sqrt(1 - Math.pow(velocityRatio, 2));
    
    if (!isFinite(denominator) || denominator === 0) {
        throw new Error('Invalid velocity results in undefined Lorentz factor');
    }

    return 1 / denominator;
}

/**
 * Validates if a given velocity is physically possible
 * 
 * @param velocity - Velocity to validate in meters per second
 * @returns True if velocity is valid, false otherwise
 */
export function isValidVelocity(velocity: number): boolean {
    return Math.abs(velocity) < SPEED_OF_LIGHT && isFinite(velocity);
}

/**
 * Calculates velocity from a given Lorentz factor
 * v = c * √(1 - 1/γ²)
 * 
 * @param lorentzFactor - The Lorentz factor (must be ≥ 1)
 * @returns The corresponding velocity in meters per second
 * @throws {Error} If Lorentz factor is less than 1
 */
export function velocityFromLorentzFactor(lorentzFactor: LorentzFactor): RelativeVelocity {
    if (lorentzFactor < 1) {
        throw new Error('Lorentz factor must be greater than or equal to 1');
    }

    const velocityRatio = Math.sqrt(1 - 1 / Math.pow(lorentzFactor, 2));
    return velocityRatio * SPEED_OF_LIGHT;
}