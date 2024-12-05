import { RelativeVelocity, TimeInterval } from '../types/core';
/**
 * Calculates time dilation effect for a moving object
 * t' = t * γ where t is proper time and γ is Lorentz factor
 *
 * @param properTime - Time measured in the rest frame (seconds)
 * @param velocity - Relative velocity between frames (m/s)
 * @returns Dilated time in the moving frame
 */
export declare function calculateTimeDilation(properTime: TimeInterval, velocity: RelativeVelocity): TimeInterval;
/**
 * Calculates proper time from dilated time
 * t = t' / γ where t' is dilated time and γ is Lorentz factor
 *
 * @param dilatedTime - Time measured in moving frame (seconds)
 * @param velocity - Relative velocity between frames (m/s)
 * @returns Proper time in the rest frame
 */
export declare function calculateProperTime(dilatedTime: TimeInterval, velocity: RelativeVelocity): TimeInterval;
/**
 * Calculates the time difference between two events in different reference frames
 *
 * @param timeInterval1 - Time interval in first frame (seconds)
 * @param timeInterval2 - Time interval in second frame (seconds)
 * @param relativeVelocity - Relative velocity between frames (m/s)
 * @returns The time difference between frames
 */
export declare function calculateTimeDifference(timeInterval1: TimeInterval, timeInterval2: TimeInterval, relativeVelocity: RelativeVelocity): TimeInterval;
