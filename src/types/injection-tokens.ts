/**
 * Dependency injection token definitions
 */

/**
 * Service identifier symbols for dependency injection
 */
export const TYPES = {
  GeolocationService: Symbol.for('GeolocationService'),
  LocationTransformService: Symbol.for('LocationTransformService'),
  GeoUtilsService: Symbol.for('GeoUtilsService')
} as const;

/**
* Type for service identifiers derived from TYPES constant
*/
export type ServiceTypes = typeof TYPES;