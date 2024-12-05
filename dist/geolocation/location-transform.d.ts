import { GeographicCoordinates, ECEFCoordinates, GeolocationTransformResult } from '../types/geolocation';
export interface ILocationTransformService {
    transformPosition(position: GeolocationPosition): Promise<GeolocationTransformResult>;
    geographicToECEF(coords: GeographicCoordinates): ECEFCoordinates;
    ecefToGeographic(coords: ECEFCoordinates): GeographicCoordinates;
}
export declare class LocationTransformService implements ILocationTransformService {
    private readonly EARTH_RADIUS_MAJOR;
    private readonly EARTH_RADIUS_MINOR;
    private readonly ECCENTRICITY_SQ;
    transformPosition(position: GeolocationPosition): Promise<GeolocationTransformResult>;
    geographicToECEF(coords: GeographicCoordinates): ECEFCoordinates;
    ecefToGeographic(coords: ECEFCoordinates): GeographicCoordinates;
}
