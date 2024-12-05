import 'reflect-metadata';

// Core functionality exports
export { SPEED_OF_LIGHT, calculateLorentzFactor, isValidVelocity } from './core/lorentz';
export { calculateTimeDilation, calculateProperTime, calculateTimeDifference } from './core/time-dilation';
export { calculateSimultaneousEvents, synchronizeClocks } from './core/synchronization';
export { container, ContainerProvider } from './core/container';

// Geolocation functionality exports
export { GeolocationService, type IGeolocationService } from './geolocation/api';
export { LocationTransformService, type ILocationTransformService } from './geolocation/location-transform';
export { GeoUtilsService, type IGeoUtilsService } from './geolocation/geo-utils';
export { GeolocationServiceError } from './geolocation/errors';

// Type exports
export * from './types'