import { injectable } from 'inversify';
import { GeographicCoordinates } from '../types/geolocation';
import { GeolocationServiceError } from './errors';

export interface IGeoUtilsService {
  calculateDistance(point1: GeographicCoordinates, point2: GeographicCoordinates): number;
  calculateBearing(start: GeographicCoordinates, end: GeographicCoordinates): number;
  isValidCoordinate(coords: GeographicCoordinates): boolean;
  formatCoordinates(coords: GeographicCoordinates): string;
}

@injectable()
export class GeoUtilsService implements IGeoUtilsService {
  private readonly EARTH_RADIUS = 6371e3; // Earth's radius in meters

  public calculateDistance(
    point1: GeographicCoordinates,
    point2: GeographicCoordinates
  ): number {
    if (!this.isValidCoordinate(point1) || !this.isValidCoordinate(point2)) {
      throw GeolocationServiceError.invalidCoordinates();
    }

    // Haversine formula
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return this.EARTH_RADIUS * c;
  }

  public calculateBearing(
    start: GeographicCoordinates,
    end: GeographicCoordinates
  ): number {
    if (!this.isValidCoordinate(start) || !this.isValidCoordinate(end)) {
      throw GeolocationServiceError.invalidCoordinates();
    }

    const φ1 = (start.latitude * Math.PI) / 180;
    const φ2 = (end.latitude * Math.PI) / 180;
    const λ1 = (start.longitude * Math.PI) / 180;
    const λ2 = (end.longitude * Math.PI) / 180;

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
             Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    
    const θ = Math.atan2(y, x);
    
    return (θ * 180 / Math.PI + 360) % 360;
  }

  public isValidCoordinate(coords: GeographicCoordinates): boolean {
    return (
      coords.latitude >= -90 && coords.latitude <= 90 &&
      coords.longitude >= -180 && coords.longitude <= 180 &&
      (coords.altitude === undefined || !isNaN(coords.altitude))
    );
  }

  public formatCoordinates(coords: GeographicCoordinates): string {
    if (!this.isValidCoordinate(coords)) {
      throw GeolocationServiceError.invalidCoordinates();
    }

    const lat = `${Math.abs(coords.latitude).toFixed(6)}°${coords.latitude >= 0 ? 'N' : 'S'}`;
    const lon = `${Math.abs(coords.longitude).toFixed(6)}°${coords.longitude >= 0 ? 'E' : 'W'}`;
    const alt = coords.altitude ? ` ${coords.altitude.toFixed(2)}m` : '';

    return `${lat} ${lon}${alt}`;
  }
}