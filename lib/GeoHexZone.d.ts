import { LatLng } from "./GeoHexDefines.js";
import { GeoHexZoneInterface } from "./GeoHexDefines.js";
export declare class GeoHexZone implements GeoHexZoneInterface {
    private _lat;
    private _lng;
    private _x;
    private _y;
    private _code;
    constructor(lat: number, lng: number, x: number, y: number, code: string);
    readonly lat: number;
    readonly lng: number;
    readonly lon: number;
    readonly x: number;
    readonly y: number;
    readonly code: string;
    readonly level: number;
    equals(zone: GeoHexZoneInterface): boolean;
    getHexSize(): number;
    getHexCoords(): LatLng[];
    toJSON(): string;
}
