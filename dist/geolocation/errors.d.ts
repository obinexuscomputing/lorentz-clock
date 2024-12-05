import { GeolocationErrorType } from '../types/geolocation';
export declare class GeolocationServiceError extends Error {
    readonly type: GeolocationErrorType;
    readonly timestamp: number;
    readonly originalError?: Error;
    constructor(type: GeolocationErrorType, message: string, originalError?: Error);
    static permissionDenied(message?: string): GeolocationServiceError;
    static positionUnavailable(message?: string): GeolocationServiceError;
    static timeout(message?: string): GeolocationServiceError;
    static unsupported(message?: string): GeolocationServiceError;
    static invalidCoordinates(message?: string): GeolocationServiceError;
}
