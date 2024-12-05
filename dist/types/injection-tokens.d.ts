/**
 * Dependency injection token definitions
 */
/**
 * Service identifier symbols for dependency injection
 */
export declare const TYPES: {
    readonly GeolocationService: symbol;
    readonly LocationTransformService: symbol;
    readonly GeoUtilsService: symbol;
};
/**
* Type for service identifiers derived from TYPES constant
*/
export type ServiceTypes = typeof TYPES;
