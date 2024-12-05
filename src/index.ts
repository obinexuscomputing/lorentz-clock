// Core exports
export * from './core/lorentz';
export * from './core/time-dilation';
export * from './core/synchronization';

// Geolocation exports
export * from './geolocation/api';
export * from './geolocation/location-transform';
export * from './geolocation/geo-utils';
export * from './geolocation/errors';

// Type exports
export * from './types/core';
export * from './types/geolocation';

// Container setup
import { Container } from 'inversify';
import { TYPES } from './types/injection-tokens';
import { GeolocationService, IGeolocationService } from './geolocation/api';
import { LocationTransformService, ILocationTransformService } from './geolocation/location-transform';
import { GeoUtilsService, IGeoUtilsService } from './geolocation/geo-utils';

export const container = new Container();

// Register services
container.bind<IGeolocationService>(TYPES.GeolocationService).to(GeolocationService);
container.bind<ILocationTransformService>(TYPES.LocationTransformService).to(LocationTransformService);
container.bind<IGeoUtilsService>(TYPES.GeoUtilsService).to(GeoUtilsService);