import { RelativeVelocity, LorentzFactor } from '../types/core';

/**
 * Physical constants used in relativistic calculations
 */
export const SPEED_OF_LIGHT: number = 299792458; // meters per second
export const MAX_SAFE_VELOCITY: number = SPEED_OF_LIGHT * 0.9999999; // Practical upper limit
export const MIN_SAFE_VELOCITY: number = -MAX_SAFE_VELOCITY;
export const MAX_LORENTZ_FACTOR: number = Number.MAX_VALUE;

/**
 * Calculates the Lorentz factor (γ) based on relative velocity
 * γ = 1 / √(1 - v²/c²)
 * 
 * @param velocity - Relative velocity in meters per second
 * @returns The calculated Lorentz factor
 * @throws {Error} If velocity is outside safe bounds
 */
export function calculateLorentzFactor(velocity: RelativeVelocity): LorentzFactor {
    if (velocity <= MIN_SAFE_VELOCITY || velocity >= MAX_SAFE_VELOCITY) {
        throw new Error(`Velocity must be between ${MIN_SAFE_VELOCITY} and ${MAX_SAFE_VELOCITY} m/s`);
    }

    const velocityRatio: number = velocity / SPEED_OF_LIGHT;
    const denominator: number = Math.sqrt(1 - Math.pow(velocityRatio, 2));
    
    const lorentzFactor: number = 1 / denominator;
    
    if (lorentzFactor > MAX_LORENTZ_FACTOR || !isFinite(lorentzFactor)) {
        throw new Error(`Calculated Lorentz factor exceeds maximum safe value: ${MAX_LORENTZ_FACTOR}`);
    }

    return lorentzFactor;
}

/**
 * Validates if a given velocity is physically possible and within safe computational bounds
 * 
 * @param velocity - Velocity to validate in meters per second
 * @returns True if velocity is valid and safe to use
 */
export function isValidVelocity(velocity: number): boolean {
    return velocity > MIN_SAFE_VELOCITY && 
           velocity < MAX_SAFE_VELOCITY && 
           isFinite(velocity);
}

/**
 * Calculates velocity from a given Lorentz factor
 * v = c * √(1 - 1/γ²)
 * 
 * @param lorentzFactor - The Lorentz factor (must be ≥ 1 and ≤ MAX_LORENTZ_FACTOR)
 * @returns The corresponding velocity in meters per second
 * @throws {Error} If Lorentz factor is invalid
 */
export function velocityFromLorentzFactor(lorentzFactor: LorentzFactor): RelativeVelocity {
    if (lorentzFactor < 1 || lorentzFactor > MAX_LORENTZ_FACTOR || !isFinite(lorentzFactor)) {
        throw new Error(`Lorentz factor must be between 1 and ${MAX_LORENTZ_FACTOR}`);
    }

    const velocityRatio: number = Math.sqrt(1 - 1 / Math.pow(lorentzFactor, 2));
    const velocity: number = velocityRatio * SPEED_OF_LIGHT;

    if (!isValidVelocity(velocity)) {
        throw new Error('Calculated velocity exceeds safe bounds');
    }

    return velocity;
}