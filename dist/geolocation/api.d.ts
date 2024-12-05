import { GeolocationOptions, GeolocationTransformResult } from '../types/geolocation';
import { ILocationTransformService } from './location-transform';
export interface IGeolocationService {
    getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationTransformResult>;
    watchPosition(callback: (position: GeolocationTransformResult) => void, options?: GeolocationOptions): () => void;
    isSupported(): boolean;
}
export declare class GeolocationService implements IGeolocationService {
    private readonly geolocationApi;
    private readonly transformService;
    constructor(transformService: ILocationTransformService);
    isSupported(): boolean;
    getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationTransformResult>;
    watchPosition(callback: (position: GeolocationTransformResult) => void, options?: GeolocationOptions): () => void;
    private getPositionPromise;
    private getGeolocationOptions;
    private handleGeolocationError;
}
