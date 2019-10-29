import { getZoneByXY, getXYByCode, getXYByLocation, getXYListByRect } from "./GeoHexCore.js";
export class GeoHex {
    // Convert a map location(lat,lng) to a GeoHex Zone structure.
    static getZoneByLocation(lat, lng, level) {
        return getZoneByXY(getXYByLocation(lat, lng, level));
    }
    // Convert a GeoHex position(x,y) to a GeoHex Zone structure.
    static getZoneByXY(x, y, level) {
        return getZoneByXY({ x, y, level });
    }
    // Convert a GeoHex code string to a GeoHex Zone structure.
    static getZoneByCode(code) {
        return getZoneByXY(getXYByCode(code));
    }
    // Convert a GeoHex position(x,y) to a map location(lat,lng).
    static getXYByLocation(lat, lng, level) {
        return getXYByLocation(lat, lng, level);
    }
    // List the shortest routes from map location A to map location B.
    static getXYListByRect(a_lat, a_lng, b_lat, b_lng, level) {
        return getXYListByRect(a_lat, a_lng, b_lat, b_lng, level);
    }
}
GeoHex.version = "3.2.0"; // http://geohex.net/src/script/hex_v3.2_core.js
