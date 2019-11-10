import { XY, XYL, GeoHexCodeString } from "./GeoHexDefines.js";
import { GeoHexZone } from "./GeoHexZone.js";
export declare function getXYByLocation(lat: number, lng: number, level: number): XYL;
export declare function getZoneByXY(xyl: XYL): GeoHexZone;
export declare function getXYByCode(code: GeoHexCodeString): XYL;
export declare function getXYListByRect(a_lat: number, a_lng: number, b_lat: number, b_lng: number, level: number): XY[];
