/**
 * Type definitions for geolocation functionality
 */

/**
 * Geographic coordinates using WGS84 datum
 */
export interface GeographicCoordinates {
  latitude: number;   // Degrees (-90 to 90)
  longitude: number;  // Degrees (-180 to 180)
  altitude?: number;  // Meters above sea level
  accuracy?: number;  // Accuracy radius in meters
}

/**
* Earth-centered, Earth-fixed (ECEF) coordinates
*/
export interface ECEFCoordinates {
  x: number;  // Meters from Earth's center towards prime meridian
  y: number;  // Meters from Earth's center towards 90° east
  z: number;  // Meters from Earth's center towards north pole
}

/**
* Options for geolocation tracking
*/
export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;        // Maximum cached position age in milliseconds
  timeout?: number;           // Maximum time to wait for position in milliseconds
  updateInterval?: number;    // Minimum time between updates in milliseconds
}

/**
* Time synchronization parameters for a location
*/
export interface LocationTimeSync {
  location: GeographicCoordinates;
  referenceTime: number;      // UTC timestamp in milliseconds
  gravitationalOffset: number;  // Time offset due to gravitational effects
  velocityOffset: number;      // Time offset due to relative velocity
  uncertaintyMs: number;      // Uncertainty in milliseconds
}

/**
* Result of a geolocation transformation
*/
export interface GeolocationTransformResult {
  geographic: GeographicCoordinates;
  ecef: ECEFCoordinates;
  timestamp: number;
  velocity?: {
      speed: number;       // Meters per second
      heading: number;     // Degrees from true north
  };
}

/**
* Error types specific to geolocation operations
*/
export enum GeolocationErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  UNSUPPORTED = 'UNSUPPORTED',
  INVALID_COORDINATES = 'INVALID_COORDINATES'
}

/**
* Custom error for geolocation operations
*/
export interface GeolocationError {
  type: GeolocationErrorType;
  message: string;
  timestamp: number;
  originalError?: Error;
}