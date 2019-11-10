import { XY, XYL, GeoHexCodeString, GeoHexZoneInterface } from "./GeoHexDefines.js";
declare type SemVerString = string;
export declare class GeoHex {
    static version: SemVerString;
    static getZoneByLocation(lat: number, lng: number, level: number): GeoHexZoneInterface;
    static getZoneByXY(x: number, y: number, level: number): GeoHexZoneInterface;
    static getZoneByCode(code: GeoHexCodeString): GeoHexZoneInterface;
    static getXYByLocation(lat: number, lng: number, level: number): XYL;
    static getXYListByRect(a_lat: number, a_lng: number, b_lat: number, b_lng: number, level: number): XY[];
}
export {};
