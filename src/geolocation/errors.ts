import { GeolocationErrorType } from '../types/geolocation';

export class GeolocationServiceError extends Error {
  public readonly type: GeolocationErrorType;
  public readonly timestamp: number;
  public readonly originalError?: Error;

  constructor(
    type: GeolocationErrorType,
    message: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'GeolocationServiceError';
    this.type = type;
    this.timestamp = Date.now();
    this.originalError = originalError;
  }

  public static permissionDenied(message = 'Geolocation permission denied'): GeolocationServiceError {
    return new GeolocationServiceError(GeolocationErrorType.PERMISSION_DENIED, message);
  }

  public static positionUnavailable(message = 'Position unavailable'): GeolocationServiceError {
    return new GeolocationServiceError(GeolocationErrorType.POSITION_UNAVAILABLE, message);
  }

  public static timeout(message = 'Geolocation request timed out'): GeolocationServiceError {
    return new GeolocationServiceError(GeolocationErrorType.TIMEOUT, message);
  }

  public static unsupported(message = 'Geolocation is not supported'): GeolocationServiceError {
    return new GeolocationServiceError(GeolocationErrorType.UNSUPPORTED, message);
  }

  public static invalidCoordinates(message = 'Invalid coordinates provided'): GeolocationServiceError {
    return new GeolocationServiceError(GeolocationErrorType.INVALID_COORDINATES, message);
  }
}