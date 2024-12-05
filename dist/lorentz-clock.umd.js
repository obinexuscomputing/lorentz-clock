(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata'), require('inversify'), require('tslib')) :
    typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata', 'inversify', 'tslib'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LorentzClock = {}, global.Reflect, global.InversifyJS, global.tslib));
})(this, (function (exports, reflectMetadata, inversify, tslib) { 'use strict';

    /**
     * Physical constants used in relativistic calculations
     */
    const SPEED_OF_LIGHT = 299792458; // meters per second
    const MAX_SAFE_VELOCITY = SPEED_OF_LIGHT * 0.9999999; // Practical upper limit
    const MIN_SAFE_VELOCITY = -MAX_SAFE_VELOCITY;
    const MAX_LORENTZ_FACTOR = Number.MAX_VALUE;
    /**
     * Calculates the Lorentz factor (γ) based on relative velocity
     * γ = 1 / √(1 - v²/c²)
     *
     * @param velocity - Relative velocity in meters per second
     * @returns The calculated Lorentz factor
     * @throws {Error} If velocity is outside safe bounds
     */
    function calculateLorentzFactor(velocity) {
        if (velocity <= MIN_SAFE_VELOCITY || velocity >= MAX_SAFE_VELOCITY) {
            throw new Error(`Velocity must be between ${MIN_SAFE_VELOCITY} and ${MAX_SAFE_VELOCITY} m/s`);
        }
        const velocityRatio = velocity / SPEED_OF_LIGHT;
        const denominator = Math.sqrt(1 - Math.pow(velocityRatio, 2));
        const lorentzFactor = 1 / denominator;
        if (lorentzFactor > MAX_LORENTZ_FACTOR || !isFinite(lorentzFactor)) {
            throw new Error(`Calculated Lorentz factor exceeds maximum safe value: ${MAX_LORENTZ_FACTOR}`);
        }
        return lorentzFactor;
    }
    /**
     * Validates if a given velocity is physically possible and within safe computational bounds
     *
     * @param velocity - Velocity to validate in meters per second
     * @returns True if velocity is valid and safe to use
     */
    function isValidVelocity(velocity) {
        return velocity > MIN_SAFE_VELOCITY &&
            velocity < MAX_SAFE_VELOCITY &&
            isFinite(velocity);
    }

    /**
     * Calculates time dilation effect for a moving object
     * t' = t * γ where t is proper time and γ is Lorentz factor
     *
     * @param properTime - Time measured in the rest frame (seconds)
     * @param velocity - Relative velocity between frames (m/s)
     * @returns Dilated time in the moving frame
     */
    function calculateTimeDilation(properTime, velocity) {
        const lorentzFactor = calculateLorentzFactor(velocity);
        return properTime * lorentzFactor;
    }
    /**
     * Calculates proper time from dilated time
     * t = t' / γ where t' is dilated time and γ is Lorentz factor
     *
     * @param dilatedTime - Time measured in moving frame (seconds)
     * @param velocity - Relative velocity between frames (m/s)
     * @returns Proper time in the rest frame
     */
    function calculateProperTime(dilatedTime, velocity) {
        const lorentzFactor = calculateLorentzFactor(velocity);
        return dilatedTime / lorentzFactor;
    }
    /**
     * Calculates the time difference between two events in different reference frames
     *
     * @param timeInterval1 - Time interval in first frame (seconds)
     * @param timeInterval2 - Time interval in second frame (seconds)
     * @param relativeVelocity - Relative velocity between frames (m/s)
     * @returns The time difference between frames
     */
    function calculateTimeDifference(timeInterval1, timeInterval2, relativeVelocity) {
        const lorentzFactor = calculateLorentzFactor(relativeVelocity);
        return Math.abs(timeInterval1 - timeInterval2 * lorentzFactor);
    }

    /**
     * Calculates the simultaneous events in a moving reference frame
     */
    function calculateSimultaneousEvents(event, velocity) {
        const lorentzFactor = calculateLorentzFactor(velocity);
        const dilatedTime = calculateTimeDilation(event.time, velocity);
        const contractionFactor = 1 / lorentzFactor;
        const simultaneousEvents = [];
        // Calculate events at different spatial points that are simultaneous in the moving frame
        for (let x = -1000; x <= 1000; x += 100) {
            const newCoordinates = {
                x: x * contractionFactor,
                y: event.coordinates.y,
                z: event.coordinates.z
            };
            // Time adjustment due to relativity of simultaneity
            const timeAdjustment = (velocity * x) / Math.pow(SPEED_OF_LIGHT, 2);
            simultaneousEvents.push({
                coordinates: newCoordinates,
                time: dilatedTime + timeAdjustment
            });
        }
        return simultaneousEvents;
    }
    /**
     * Synchronizes clocks between two locations considering relativistic effects
     */
    function synchronizeClocks(location1, location2, velocity) {
        const lorentzFactor = calculateLorentzFactor(velocity);
        const separation = Math.sqrt(Math.pow(location2.x - location1.x, 2) +
            Math.pow(location2.y - location1.y, 2) +
            Math.pow(location2.z - location1.z, 2));
        const timeOffset = (velocity * separation) / Math.pow(SPEED_OF_LIGHT, 2);
        return timeOffset * lorentzFactor;
    }

    /**
     * Dependency injection token definitions
     */
    /**
     * Service identifier symbols for dependency injection
     */
    const TYPES = {
        GeolocationService: Symbol.for('GeolocationService'),
        LocationTransformService: Symbol.for('LocationTransformService'),
        GeoUtilsService: Symbol.for('GeoUtilsService')
    };

    /**
     * Type definitions for geolocation functionality
     */
    /**
    * Error types specific to geolocation operations
    */
    exports.GeolocationErrorType = void 0;
    (function (GeolocationErrorType) {
        GeolocationErrorType["PERMISSION_DENIED"] = "PERMISSION_DENIED";
        GeolocationErrorType["POSITION_UNAVAILABLE"] = "POSITION_UNAVAILABLE";
        GeolocationErrorType["TIMEOUT"] = "TIMEOUT";
        GeolocationErrorType["UNSUPPORTED"] = "UNSUPPORTED";
        GeolocationErrorType["INVALID_COORDINATES"] = "INVALID_COORDINATES";
    })(exports.GeolocationErrorType || (exports.GeolocationErrorType = {}));

    class GeolocationServiceError extends Error {
        constructor(type, message, originalError) {
            super(message);
            this.name = 'GeolocationServiceError';
            this.type = type;
            this.timestamp = Date.now();
            this.originalError = originalError;
        }
        static permissionDenied(message = 'Geolocation permission denied') {
            return new GeolocationServiceError(exports.GeolocationErrorType.PERMISSION_DENIED, message);
        }
        static positionUnavailable(message = 'Position unavailable') {
            return new GeolocationServiceError(exports.GeolocationErrorType.POSITION_UNAVAILABLE, message);
        }
        static timeout(message = 'Geolocation request timed out') {
            return new GeolocationServiceError(exports.GeolocationErrorType.TIMEOUT, message);
        }
        static unsupported(message = 'Geolocation is not supported') {
            return new GeolocationServiceError(exports.GeolocationErrorType.UNSUPPORTED, message);
        }
        static invalidCoordinates(message = 'Invalid coordinates provided') {
            return new GeolocationServiceError(exports.GeolocationErrorType.INVALID_COORDINATES, message);
        }
    }

    exports.GeolocationService = class GeolocationService {
        constructor(transformService) {
            if (!(navigator === null || navigator === void 0 ? void 0 : navigator.geolocation)) {
                throw GeolocationServiceError.unsupported();
            }
            this.geolocationApi = navigator.geolocation;
            this.transformService = transformService;
        }
        isSupported() {
            return !!this.geolocationApi;
        }
        async getCurrentPosition(options) {
            try {
                const position = await this.getPositionPromise(options);
                return this.transformService.transformPosition(position);
            }
            catch (error) {
                throw this.handleGeolocationError(error);
            }
        }
        watchPosition(callback, options) {
            const watchId = this.geolocationApi.watchPosition(async (position) => {
                try {
                    const transformedPosition = await this.transformService.transformPosition(position);
                    callback(transformedPosition);
                }
                catch (error) {
                    throw this.handleGeolocationError(error);
                }
            }, (error) => {
                throw this.handleGeolocationError(error);
            }, this.getGeolocationOptions(options));
            return () => this.geolocationApi.clearWatch(watchId);
        }
        getPositionPromise(options) {
            return new Promise((resolve, reject) => {
                this.geolocationApi.getCurrentPosition(resolve, reject, this.getGeolocationOptions(options));
            });
        }
        getGeolocationOptions(options) {
            var _a, _b, _c;
            return {
                enableHighAccuracy: (_a = options === null || options === void 0 ? void 0 : options.enableHighAccuracy) !== null && _a !== void 0 ? _a : true,
                timeout: (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : 10000,
                maximumAge: (_c = options === null || options === void 0 ? void 0 : options.maximumAge) !== null && _c !== void 0 ? _c : 0
            };
        }
        handleGeolocationError(error) {
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
            return new GeolocationServiceError(exports.GeolocationErrorType.POSITION_UNAVAILABLE, 'Unknown geolocation error', error instanceof Error ? error : undefined);
        }
    };
    exports.GeolocationService = tslib.__decorate([
        inversify.injectable(),
        tslib.__param(0, inversify.inject(TYPES.LocationTransformService)),
        tslib.__metadata("design:paramtypes", [Object])
    ], exports.GeolocationService);

    exports.LocationTransformService = class LocationTransformService {
        constructor() {
            // WGS84 ellipsoid constants
            this.EARTH_RADIUS_MAJOR = 6378137.0; // meters
            this.EARTH_RADIUS_MINOR = 6356752.314245; // meters
            this.ECCENTRICITY_SQ = 0.006694379990141316;
        }
        async transformPosition(position) {
            var _a;
            const { coords, timestamp } = position;
            const geographic = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                altitude: (_a = coords.altitude) !== null && _a !== void 0 ? _a : 0,
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
        geographicToECEF(coords) {
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
        ecefToGeographic(coords) {
            const { x, y, z } = coords;
            const p = Math.sqrt(x * x + y * y);
            const theta = Math.atan2(z * this.EARTH_RADIUS_MAJOR, p * this.EARTH_RADIUS_MINOR);
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            const lat = Math.atan2(z + this.ECCENTRICITY_SQ * this.EARTH_RADIUS_MINOR * sinTheta * sinTheta * sinTheta, p - this.ECCENTRICITY_SQ * this.EARTH_RADIUS_MAJOR * cosTheta * cosTheta * cosTheta);
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
    };
    exports.LocationTransformService = tslib.__decorate([
        inversify.injectable()
    ], exports.LocationTransformService);

    exports.GeoUtilsService = class GeoUtilsService {
        constructor() {
            this.EARTH_RADIUS = 6371e3; // Earth's radius in meters
        }
        calculateDistance(point1, point2) {
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
        calculateBearing(start, end) {
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
        isValidCoordinate(coords) {
            return (coords.latitude >= -90 && coords.latitude <= 90 &&
                coords.longitude >= -180 && coords.longitude <= 180 &&
                (coords.altitude === undefined || !isNaN(coords.altitude)));
        }
        formatCoordinates(coords) {
            if (!this.isValidCoordinate(coords)) {
                throw GeolocationServiceError.invalidCoordinates();
            }
            const lat = `${Math.abs(coords.latitude).toFixed(6)}°${coords.latitude >= 0 ? 'N' : 'S'}`;
            const lon = `${Math.abs(coords.longitude).toFixed(6)}°${coords.longitude >= 0 ? 'E' : 'W'}`;
            const alt = coords.altitude ? ` ${coords.altitude.toFixed(2)}m` : '';
            return `${lat} ${lon}${alt}`;
        }
    };
    exports.GeoUtilsService = tslib.__decorate([
        inversify.injectable()
    ], exports.GeoUtilsService);

    class ContainerProvider {
        static getInstance() {
            if (!ContainerProvider.instance) {
                ContainerProvider.instance = ContainerProvider.createContainer();
            }
            return ContainerProvider.instance;
        }
        static createContainer() {
            const container = new inversify.Container({
                defaultScope: "Singleton",
                skipBaseClassChecks: false
            });
            // Register core services
            container.bind(TYPES.GeolocationService)
                .to(exports.GeolocationService)
                .inSingletonScope();
            container.bind(TYPES.LocationTransformService)
                .to(exports.LocationTransformService)
                .inSingletonScope();
            container.bind(TYPES.GeoUtilsService)
                .to(exports.GeoUtilsService)
                .inSingletonScope();
            return container;
        }
        static resetContainer() {
            if (ContainerProvider.instance) {
                ContainerProvider.instance.unbindAll();
                ContainerProvider.instance = undefined;
            }
        }
        static hasInstance() {
            return ContainerProvider.instance !== undefined;
        }
    }
    const container = ContainerProvider.getInstance();

    /**
     * Core type definitions for relativistic calculations and transformations
     */
    /**
     * Namespace containing standard SI units and physical quantities
     */
    exports.Physics = void 0;
    (function (Physics) {
        Physics.SPEED_OF_LIGHT = 299792458; // meters per second
        Physics.GRAVITATIONAL_CONSTANT = 6.67430e-11; // m³/kg/s²
        Physics.PLANCK_CONSTANT = 6.62607015e-34; // joule-seconds
    })(exports.Physics || (exports.Physics = {}));

    exports.ContainerProvider = ContainerProvider;
    exports.GeolocationServiceError = GeolocationServiceError;
    exports.SPEED_OF_LIGHT = SPEED_OF_LIGHT;
    exports.TYPES = TYPES;
    exports.calculateLorentzFactor = calculateLorentzFactor;
    exports.calculateProperTime = calculateProperTime;
    exports.calculateSimultaneousEvents = calculateSimultaneousEvents;
    exports.calculateTimeDifference = calculateTimeDifference;
    exports.calculateTimeDilation = calculateTimeDilation;
    exports.container = container;
    exports.isValidVelocity = isValidVelocity;
    exports.synchronizeClocks = synchronizeClocks;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=lorentz-clock.umd.js.map
