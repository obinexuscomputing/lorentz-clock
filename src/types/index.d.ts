/**
 * Main type definitions export file
 */

import { CalculationOptions, ReferenceFrame } from './core';
import { GeolocationOptions } from './geolocation';

// Re-export all types from core
export * from './core';
export * from './synchronization';

// Re-export all types from geolocation
export * from './geolocation';
export * from './time-dilation';
// Rexport all from 'injection-tokens.d.ts';
export * from './injection-tokens'

// Additional composite types and interfaces

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
 * Supported time formats for input/output
 */
export type TimeFormat = 'unix' | 'iso8601' | 'relative';

/**
 * Event types that can be subscribed to
 */
export type EventType = 
  | 'sync'
  | 'drift'
  | 'position'
  | 'error'
  | 'config';

/**
 * Event handler function type
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * Version information
 */
export interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}