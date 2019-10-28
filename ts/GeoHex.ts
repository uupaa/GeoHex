import { XY, XYL, GeoHexCodeString, GeoHexZoneInterface } from "./GeoHexDefines.js";
import { getZoneByXY, getXYByCode, getXYByLocation, getXYListByRect } from "./GeoHexCoreFunctions.js";

export class GeoHex {
  static version = "3.2.0"; // http://geohex.net/src/script/hex_v3.2_core.js
  static getZoneByLocation(lat:number, lng:number, level:number):GeoHexZoneInterface {
    return getZoneByXY(getXYByLocation(lat, lng, level));
  }
  static getZoneByXY(x:number, y:number, level:number):GeoHexZoneInterface {
    return getZoneByXY({ x, y, level });
  }
  static getZoneByCode(code:GeoHexCodeString):GeoHexZoneInterface {
    return getZoneByXY(getXYByCode(code));
  }
  static getXYByLocation(lat:number, lng:number, level:number):XYL {
    return getXYByLocation(lat, lng, level);
  }
  // lat/lng1 から lat/lng2 までの最短ルートHexリストを列挙
  static getXYListByRect(lat1:number, lng1:number, lat2:number, lng2:number, level:number):XY[] {
    return getXYListByRect(lat1, lng1, lat2, lng2, level);
  }
}  
