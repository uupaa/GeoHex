export declare const H_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export declare const H_BASE = 20037508.34;
export declare const H_DEG: number;
export declare const H_K: number;
export interface XY {
    x: number;
    y: number;
}
export interface XYL {
    x: number;
    y: number;
    level: number;
}
export interface LatLng {
    lat: number;
    lng: number;
    lon: number;
}
export declare function calcHexSize(level: number): number;
export declare function latLng2xy(lat: number, lng: number): XY;
export declare function xy2latLng(x: number, y: number): LatLng;
export declare type GeoHexCodeString = string;
export interface GeoHexZoneInterface {
    lat: number;
    lng: number;
    lon: number;
    x: number;
    y: number;
    code: string;
    level: number;
    equals(zone: GeoHexZoneInterface): boolean;
    getHexSize(): number;
    getHexCoords(): LatLng[];
}
