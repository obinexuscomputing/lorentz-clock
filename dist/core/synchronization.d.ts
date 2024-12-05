import { Coordinates, RelativeVelocity, TimeInterval } from '../types/core';
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
export declare function calculateSimultaneousEvents(event: SpacetimeEvent, velocity: RelativeVelocity): SpacetimeEvent[];
/**
 * Synchronizes clocks between two locations considering relativistic effects
 */
export declare function synchronizeClocks(location1: Coordinates, location2: Coordinates, velocity: RelativeVelocity): TimeInterval;
export {};
