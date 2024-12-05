import { calculateLorentzFactor } from './lorentz';
import { calculateTimeDilation } from './time-dilation';
import { Coordinates, RelativeVelocity, TimeInterval } from '../types/core';
import { SPEED_OF_LIGHT } from './lorentz';

/**
 * Represents a spacetime event with both spatial and temporal coordinates
 */
interface SpacetimeEvent {
    coordinates: Coordinates;
    time: TimeInterval;
}

/**
 * Calculates the simultaneous events in a moving reference frame
 */
export function calculateSimultaneousEvents(
    event: SpacetimeEvent,
    velocity: RelativeVelocity
): SpacetimeEvent[] {
    const lorentzFactor = calculateLorentzFactor(velocity);
    const dilatedTime = calculateTimeDilation(event.time, velocity);
    const contractionFactor = 1 / lorentzFactor;
    
    const simultaneousEvents: SpacetimeEvent[] = [];
    
    // Calculate events at different spatial points that are simultaneous in the moving frame
    for (let x = -1000; x <= 1000; x += 100) {
        const newCoordinates: Coordinates = {
            x: x * contractionFactor,
            y: event.coordinates.y,
            z: event.coordinates.z
        };
        
        // Time adjustment due to relativity of simultaneity
        const timeAdjustment = (velocity * x) / Math.pow(SPEED_OF_LIGHT, 2);
        
        simultaneousEvents.push({
            coordinates: newCoordinates,
            time: dilatedTime + timeAdjustment
        });
    }
    
    return simultaneousEvents;
}

/**
 * Synchronizes clocks between two locations considering relativistic effects
 */
export function synchronizeClocks(
    location1: Coordinates,
    location2: Coordinates,
    velocity: RelativeVelocity
): TimeInterval {
    const lorentzFactor = calculateLorentzFactor(velocity);
    
    const separation = Math.sqrt(
        Math.pow(location2.x - location1.x, 2) +
        Math.pow(location2.y - location1.y, 2) +
        Math.pow(location2.z - location1.z, 2)
    );
    
    const timeOffset = (velocity * separation) / Math.pow(SPEED_OF_LIGHT, 2);
    
    return timeOffset * lorentzFactor;
}