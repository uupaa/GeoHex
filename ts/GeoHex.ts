import { XY, XYL, GeoHexCodeString, GeoHexZoneInterface } from "./GeoHexDefines.js";
import { getZoneByXY, getXYByCode, getXYByLocation, getXYListByRect } from "./GeoHexCore.js";

type SemVerString = string;

export class GeoHex {
  static version:SemVerString = "3.2.0"; // http://geohex.net/src/script/hex_v3.2_core.js

  // Convert a map location(lat,lng) to a GeoHex Zone structure.
  static getZoneByLocation(lat:number, lng:number, level:number):GeoHexZoneInterface {
    return getZoneByXY(getXYByLocation(lat, lng, level));
  }
  // Convert a GeoHex position(x,y) to a GeoHex Zone structure.
  static getZoneByXY(x:number, y:number, level:number):GeoHexZoneInterface {
    return getZoneByXY({ x, y, level });
  }
  // Convert a GeoHex code string to a GeoHex Zone structure.
  static getZoneByCode(code:GeoHexCodeString):GeoHexZoneInterface {
    return getZoneByXY(getXYByCode(code));
  }
  // Convert a GeoHex position(x,y) to a map location(lat,lng).
  static getXYByLocation(lat:number, lng:number, level:number):XYL {
    return getXYByLocation(lat, lng, level);
  }
  // List the shortest routes from map location A to map location B.
  static getXYListByRect(a_lat:number, a_lng:number, b_lat:number, b_lng:number, level:number):XY[] {
    return getXYListByRect(a_lat, a_lng, b_lat, b_lng, level);
  }
}  
