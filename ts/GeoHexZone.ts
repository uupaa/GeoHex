import { calcHexSize, latLng2xy, xy2latLng, LatLng } from "./GeoHexDefines.js";
import { GeoHexZoneInterface } from "./GeoHexDefines.js";

export class GeoHexZone implements GeoHexZoneInterface {
  private _lat:number; // center coordinates of hexagon
  private _lng:number; // center coordinates of hexagon
  private _x:number;
  private _y:number;
  private _code:string;

  constructor(lat:number, lng:number, x:number, y:number, code:string) {
    this._lat = lat;
    this._lng = lng;
    this._x = x;
    this._y = y;
    this._code = code;
  }
  get lat():number { return this._lat; }
  get lng():number { return this._lng; }
  get lon():number { return this._lng; } // lng alias
  get x():number { return this._x; }
  get y():number { return this._y; }
  get code():string { return this._code; }
  get level():number { return this._code.length - 2; }

  equals(zone:GeoHexZoneInterface):boolean {
    return this._lat === zone.lat && this._lng === zone.lng && // this._lon === zone.lon &&
           this._x === zone.x && this._y === zone.y &&
           this._code === zone.code;
  }
  getHexSize():number { return calcHexSize( this.level ); }
  getHexCoords():LatLng[] {
    const h_lat = this._lat;
    const h_lng = this._lng;
    const { x, y } = latLng2xy(h_lat, h_lng);
    const h_deg = Math.tan( Math.PI * (60 / 180) );
    const h_size = this.getHexSize();
    const h_top = xy2latLng(x, y + h_deg *  h_size).lat;
    const h_btm = xy2latLng(x, y - h_deg *  h_size).lat;
    const h_l   = xy2latLng(x - 2 * h_size, y).lng;
    const h_r   = xy2latLng(x + 2 * h_size, y).lng;
    const h_cl  = xy2latLng(x - 1 * h_size, y).lng;
    const h_cr  = xy2latLng(x + 1 * h_size, y).lng;
    return [
      { lat: h_lat, lng: h_l , lon: h_l  },
      { lat: h_top, lng: h_cl, lon: h_cl },
      { lat: h_top, lng: h_cr, lon: h_cr },
      { lat: h_lat, lng: h_r , lon: h_r  },
      { lat: h_btm, lng: h_cr, lon: h_cr },
      { lat: h_btm, lng: h_cl, lon: h_cl },
    ];
  }
  toJSON():string {
    const { lat, lng, lon, x, y, code, level } = this;
    return `{ "lat": ${lat}, "lng": ${lng}, "lon": ${lon}, "x": ${x}, "y": ${y}, "code": ${code}, "level": ${level} }`;
  }
}
