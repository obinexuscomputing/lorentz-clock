import { injectable } from 'inversify';
import {
  GeographicCoordinates,
  ECEFCoordinates,
  GeolocationTransformResult
} from '../types/geolocation';
import { GeolocationServiceError } from './errors';

export interface ILocationTransformService {
  transformPosition(position: GeolocationPosition): Promise<GeolocationTransformResult>;
  geographicToECEF(coords: GeographicCoordinates): ECEFCoordinates;
  ecefToGeographic(coords: ECEFCoordinates): GeographicCoordinates;
}

@injectable()
export class LocationTransformService implements ILocationTransformService {
  // WGS84 ellipsoid constants
  private readonly EARTH_RADIUS_MAJOR = 6378137.0; // meters
  private readonly EARTH_RADIUS_MINOR = 6356752.314245; // meters
  private readonly ECCENTRICITY_SQ = 0.006694379990141316;

  public async transformPosition(
    position: GeolocationPosition
  ): Promise<GeolocationTransformResult> {
    const { coords, timestamp } = position;
    
    const geographic: GeographicCoordinates = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      altitude: coords.altitude ?? 0,
      accuracy: coords.accuracy
    };

    const ecef = this.geographicToECEF(geographic);

    return {
      geographic,
      ecef,
      timestamp,
      velocity: coords.speed && coords.heading ? {
        speed: coords.speed,
        heading: coords.heading
      } : undefined
    };
  }

  public geographicToECEF(coords: GeographicCoordinates): ECEFCoordinates {
    const { latitude, longitude, altitude = 0 } = coords;
    
    // Convert to radians
    const lat = (latitude * Math.PI) / 180.0;
    const lon = (longitude * Math.PI) / 180.0;

    const sinLat = Math.sin(lat);
    const cosLat = Math.cos(lat);
    const sinLon = Math.sin(lon);
    const cosLon = Math.cos(lon);

    // Calculate N(φ): radius of curvature in the prime vertical
    const N = this.EARTH_RADIUS_MAJOR / Math.sqrt(1 - this.ECCENTRICITY_SQ * sinLat * sinLat);

    // Calculate ECEF coordinates
    return {
      x: (N + altitude) * cosLat * cosLon,
      y: (N + altitude) * cosLat * sinLon,
      z: (N * (1 - this.ECCENTRICITY_SQ) + altitude) * sinLat
    };
  }

  public ecefToGeographic(coords: ECEFCoordinates): GeographicCoordinates {
    const { x, y, z } = coords;
    
    const p = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(z * this.EARTH_RADIUS_MAJOR, 
                           p * this.EARTH_RADIUS_MINOR);
    
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    const lat = Math.atan2(
      z + this.ECCENTRICITY_SQ * this.EARTH_RADIUS_MINOR * sinTheta * sinTheta * sinTheta,
      p - this.ECCENTRICITY_SQ * this.EARTH_RADIUS_MAJOR * cosTheta * cosTheta * cosTheta
    );

    const lon = Math.atan2(y, x);
    
    const sinLat = Math.sin(lat);
    const N = this.EARTH_RADIUS_MAJOR / Math.sqrt(1 - this.ECCENTRICITY_SQ * sinLat * sinLat);
    
    const alt = p / Math.cos(lat) - N;

    return {
      latitude: (lat * 180) / Math.PI,
      longitude: (lon * 180) / Math.PI,
      altitude: alt
    };
  }
}