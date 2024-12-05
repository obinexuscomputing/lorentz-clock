import 'reflect-metadata';
import { Container as InversifyContainer } from 'inversify';
export declare class ContainerProvider {
    private static instance;
    static getInstance(): InversifyContainer;
    private static createContainer;
    static resetContainer(): void;
    static hasInstance(): boolean;
}
export declare const container: InversifyContainer;
export type Container = InversifyContainer;
