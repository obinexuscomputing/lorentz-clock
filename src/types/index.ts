/**
 * Main type definitions export file
 */

import { CalculationOptions, ReferenceFrame } from './core';
import { GeolocationOptions } from './geolocation';
import { ServiceTypes } from './injection-tokens';

// Re-export all types
export * from './core';
export * from './geolocation';
export * from './injection-tokens';

/**
 * Main configuration for the Lorentz Clock system
 */
export interface LorentzClockConfig {
    geolocation: {
        options: GeolocationOptions;
        coordinateSystem: 'geographic' | 'ecef';
        allowFallback: boolean;
    };
    relativistic: {
        options: CalculationOptions;
        referenceFrame: ReferenceFrame;
    };
    sync: {
        interval: number;        // Sync interval in milliseconds
        maxTimeDrift: number;    // Maximum allowable time drift in milliseconds
        retryAttempts: number;
    };
}

/**
 * Status of the Lorentz Clock system
 */
export interface SystemStatus {
    initialized: boolean;
    lastSync: number;          // UTC timestamp of last sync
    currentError: number;      // Current time error estimate in milliseconds
    referenceFrame: ReferenceFrame;
    geolocation: {
        available: boolean;
        accuracy: number;        // Current position accuracy in meters
        lastUpdate: number;      // UTC timestamp of last position update
    };
    performance: {
        syncLatency: number;     // Average sync latency in milliseconds
        driftRate: number;       // Observed time drift rate
    };
}

/**
 * Time format options for input/output
 */
export type TimeFormat = 'unix' | 'iso8601' | 'relative';

/**
 * Event types that can be subscribed to
 */
export type EventType = 'sync' | 'drift' | 'position' | 'error' | 'config';

/**
 * Generic event handler function type
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * Version information structure
 */
export interface Version {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
}