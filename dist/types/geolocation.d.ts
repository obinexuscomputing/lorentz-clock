/**
 * Type definitions for geolocation functionality
 */
/**
 * Geographic coordinates using WGS84 datum
 */
export interface GeographicCoordinates {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
}
/**
* Earth-centered, Earth-fixed (ECEF) coordinates
*/
export interface ECEFCoordinates {
    x: number;
    y: number;
    z: number;
}
/**
* Options for geolocation tracking
*/
export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    maximumAge?: number;
    timeout?: number;
    updateInterval?: number;
}
/**
* Time synchronization parameters for a location
*/
export interface LocationTimeSync {
    location: GeographicCoordinates;
    referenceTime: number;
    gravitationalOffset: number;
    velocityOffset: number;
    uncertaintyMs: number;
}
/**
* Result of a geolocation transformation
*/
export interface GeolocationTransformResult {
    geographic: GeographicCoordinates;
    ecef: ECEFCoordinates;
    timestamp: number;
    velocity?: {
        speed: number;
        heading: number;
    };
}
/**
* Error types specific to geolocation operations
*/
export declare enum GeolocationErrorType {
    PERMISSION_DENIED = "PERMISSION_DENIED",
    POSITION_UNAVAILABLE = "POSITION_UNAVAILABLE",
    TIMEOUT = "TIMEOUT",
    UNSUPPORTED = "UNSUPPORTED",
    INVALID_COORDINATES = "INVALID_COORDINATES"
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
