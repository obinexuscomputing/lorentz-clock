export const TYPES = {
    GeolocationService: Symbol.for('GeolocationService'),
    LocationTransformService: Symbol.for('LocationTransformService'),
    GeoUtilsService: Symbol.for('GeoUtilsService')
} as const;

export type ServiceTypes = typeof TYPES;