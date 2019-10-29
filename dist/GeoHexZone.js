import { calcHexSize, latLng2xy, xy2latLng } from "./GeoHexDefines.js";
export class GeoHexZone {
    constructor(lat, lng, x, y, code) {
        this._lat = lat;
        this._lng = lng;
        this._x = x;
        this._y = y;
        this._code = code;
    }
    get lat() { return this._lat; }
    get lng() { return this._lng; }
    get lon() { return this._lng; } // lng alias
    get x() { return this._x; }
    get y() { return this._y; }
    get code() { return this._code; }
    get level() { return this._code.length - 2; }
    equals(zone) {
        return this._lat === zone.lat && this._lng === zone.lng && // this._lon === zone.lon &&
            this._x === zone.x && this._y === zone.y &&
            this._code === zone.code;
    }
    getHexSize() { return calcHexSize(this.level); }
    getHexCoords() {
        const h_lat = this._lat;
        const h_lng = this._lng;
        const { x, y } = latLng2xy(h_lat, h_lng);
        const h_deg = Math.tan(Math.PI * (60 / 180));
        const h_size = this.getHexSize();
        const h_top = xy2latLng(x, y + h_deg * h_size).lat;
        const h_btm = xy2latLng(x, y - h_deg * h_size).lat;
        const h_l = xy2latLng(x - 2 * h_size, y).lng;
        const h_r = xy2latLng(x + 2 * h_size, y).lng;
        const h_cl = xy2latLng(x - 1 * h_size, y).lng;
        const h_cr = xy2latLng(x + 1 * h_size, y).lng;
        return [
            { lat: h_lat, lng: h_l, lon: h_l },
            { lat: h_top, lng: h_cl, lon: h_cl },
            { lat: h_top, lng: h_cr, lon: h_cr },
            { lat: h_lat, lng: h_r, lon: h_r },
            { lat: h_btm, lng: h_cr, lon: h_cr },
            { lat: h_btm, lng: h_cl, lon: h_cl },
        ];
    }
    toJSON() {
        const { lat, lng, lon, x, y, code, level } = this;
        return `{ "lat": ${lat}, "lng": ${lng}, "lon": ${lon}, "x": ${x}, "y": ${y}, "code": ${code}, "level": ${level} }`;
    }
}
