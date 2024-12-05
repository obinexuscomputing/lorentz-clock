import 'reflect-metadata';
import { Container as InversifyContainer } from 'inversify';
import { TYPES } from '../types/injection-tokens';
import { IGeolocationService } from '../geolocation/api';
import { ILocationTransformService } from '../geolocation/location-transform';
import { IGeoUtilsService } from '../geolocation/geo-utils';
import { GeolocationService } from '../geolocation/api';
import { LocationTransformService } from '../geolocation/location-transform';
import { GeoUtilsService } from '../geolocation/geo-utils';

export class ContainerProvider {
    private static instance: InversifyContainer | undefined;

    public static getInstance(): InversifyContainer {
        if (!ContainerProvider.instance) {
            ContainerProvider.instance = ContainerProvider.createContainer();
        }
        return ContainerProvider.instance;
    }

    private static createContainer(): InversifyContainer {
        const container = new InversifyContainer({ 
            defaultScope: "Singleton",
            skipBaseClassChecks: false
        });
        
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

        return container;
    }

    public static resetContainer(): void {
        if (ContainerProvider.instance) {
            ContainerProvider.instance.unbindAll();
            ContainerProvider.instance = undefined;
        }
    }

    public static hasInstance(): boolean {
        return ContainerProvider.instance !== undefined;
    }
}

export const container = ContainerProvider.getInstance();
export type Container = InversifyContainer;