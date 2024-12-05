import { GeographicCoordinates } from '../types/geolocation';
export interface IGeoUtilsService {
    calculateDistance(point1: GeographicCoordinates, point2: GeographicCoordinates): number;
    calculateBearing(start: GeographicCoordinates, end: GeographicCoordinates): number;
    isValidCoordinate(coords: GeographicCoordinates): boolean;
    formatCoordinates(coords: GeographicCoordinates): string;
}
export declare class GeoUtilsService implements IGeoUtilsService {
    private readonly EARTH_RADIUS;
    calculateDistance(point1: GeographicCoordinates, point2: GeographicCoordinates): number;
    calculateBearing(start: GeographicCoordinates, end: GeographicCoordinates): number;
    isValidCoordinate(coords: GeographicCoordinates): boolean;
    formatCoordinates(coords: GeographicCoordinates): string;
}
