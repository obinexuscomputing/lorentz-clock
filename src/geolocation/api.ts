import { 
    GeographicCoordinates, 
    GeolocationErrorType, 
    GeolocationOptions, 
    GeolocationTransformResult 
  } from '../types/geolocation';
  import { GeolocationServiceError } from './errors';
  import { injectable, inject } from 'inversify';
  import { TYPES } from '../types/injection-tokens';
import { ILocationTransformService } from './location-transform';
  
  export interface IGeolocationService {
    getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationTransformResult>;
    watchPosition(
      callback: (position: GeolocationTransformResult) => void,
      options?: GeolocationOptions
    ): () => void;
    isSupported(): boolean;
  }
  
  @injectable()
  export class GeolocationService implements IGeolocationService {
    private readonly geolocationApi: Geolocation;
    private readonly transformService: ILocationTransformService;
  
    constructor(
      @inject(TYPES.LocationTransformService) transformService: ILocationTransformService
    ) {
      if (!navigator?.geolocation) {
        throw GeolocationServiceError.unsupported();
      }
      this.geolocationApi = navigator.geolocation;
      this.transformService = transformService;
    }
  
    public isSupported(): boolean {
      return !!this.geolocationApi;
    }
  
    public async getCurrentPosition(
      options?: GeolocationOptions
    ): Promise<GeolocationTransformResult> {
      try {
        const position = await this.getPositionPromise(options);
        return this.transformService.transformPosition(position);
      } catch (error) {
        throw this.handleGeolocationError(error);
      }
    }
  
    public watchPosition(
      callback: (position: GeolocationTransformResult) => void,
      options?: GeolocationOptions
    ): () => void {
      const watchId = this.geolocationApi.watchPosition(
        async (position) => {
          try {
            const transformedPosition = await this.transformService.transformPosition(position);
            callback(transformedPosition);
          } catch (error) {
            throw this.handleGeolocationError(error);
          }
        },
        (error) => {
          throw this.handleGeolocationError(error);
        },
        this.getGeolocationOptions(options)
      );
  
      return () => this.geolocationApi.clearWatch(watchId);
    }
  
    private getPositionPromise(options?: GeolocationOptions): Promise<GeolocationPosition> {
      return new Promise((resolve, reject) => {
        this.geolocationApi.getCurrentPosition(
          resolve,
          reject,
          this.getGeolocationOptions(options)
        );
      });
    }
  
    private getGeolocationOptions(options?: GeolocationOptions): PositionOptions {
      return {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 0
      };
    }
  
    private handleGeolocationError(error: unknown): GeolocationServiceError {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            return GeolocationServiceError.permissionDenied();
          case error.POSITION_UNAVAILABLE:
            return GeolocationServiceError.positionUnavailable();
          case error.TIMEOUT:
            return GeolocationServiceError.timeout();
        }
      }
      return new GeolocationServiceError(
        GeolocationErrorType.POSITION_UNAVAILABLE,
        'Unknown geolocation error',
        error instanceof Error ? error : undefined
      );
    }
  }