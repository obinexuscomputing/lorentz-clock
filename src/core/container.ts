import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../types/injection-tokens';

// Import service interfaces
import { IGeolocationService } from '../geolocation/api';
import { ILocationTransformService } from '../geolocation/location-transform';
import { IGeoUtilsService } from '../geolocation/geo-utils';

// Import service implementations
import { GeolocationService } from '../geolocation/api';
import { LocationTransformService } from '../geolocation/location-transform';
import { GeoUtilsService } from '../geolocation/geo-utils';

export class ContainerProvider {
    private static instance: Container;

    public static getInstance(): Container {
        if (!ContainerProvider.instance) {
            const container = new Container({ defaultScope: "Singleton" });
            
            // Register core services
            container.bind<IGeolocationService>(TYPES.GeolocationService)
                    .to(GeolocationService)
                    .inSingletonScope();
                    
            container.bind<ILocationTransformService>(TYPES.LocationTransformService)
                    .to(LocationTransformService)
                    .inSingletonScope();
                    
            container.bind<IGeoUtilsService>(TYPES.GeoUtilsService)
                    .to(GeoUtilsService)
                    .inSingletonScope();

            ContainerProvider.instance = container;
        }

        return ContainerProvider.instance;
    }

    public static resetContainer(): void {
        ContainerProvider.instance = null;
    }
}

export const container = ContainerProvider.getInstance();