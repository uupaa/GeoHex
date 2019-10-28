import { calcHexSize, loc2xy, xy2loc, LatLng } from "./GeoHexDefines.js";
import { GeoHexZoneInterface } from "./GeoHexDefines.js";

export class GeoHexZone implements GeoHexZoneInterface {
  private _lat:number; // Hex中心座標
  private _lng:number; // Hex中心座標
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
  get x():number { return this._x; }
  get y():number { return this._y; }
  get code():string { return this._code; }
  get level():number { return this._code.length - 2; }

  equal(zone:GeoHexZoneInterface):boolean {
    return this._lat === zone.lat && this._lng === zone.lng &&
           this._x === zone.x && this._y === zone.y &&
           this._code === zone.code;
  }
  getHexSize():number { return calcHexSize( this.level ); }
  getHexCoords():LatLng[] {
    const h_lat = this._lat;
    const h_lng = this._lng;
    const { x, y } = loc2xy(h_lng, h_lat);
    const h_deg = Math.tan( Math.PI * (60 / 180) );
    const h_size = this.getHexSize();
    const h_top = xy2loc(x, y + h_deg *  h_size).lat;
    const h_btm = xy2loc(x, y - h_deg *  h_size).lat;
    const h_l   = xy2loc(x - 2 * h_size, y).lng;
    const h_r   = xy2loc(x + 2 * h_size, y).lng;
    const h_cl  = xy2loc(x - 1 * h_size, y).lng;
    const h_cr  = xy2loc(x + 1 * h_size, y).lng;
    return [
      { lat: h_lat, lng: h_l , lon: h_l  },
      { lat: h_top, lng: h_cl, lon: h_cl },
      { lat: h_top, lng: h_cr, lon: h_cr },
      { lat: h_lat, lng: h_r , lon: h_r  },
      { lat: h_btm, lng: h_cr, lon: h_cr },
      { lat: h_btm, lng: h_cl, lon: h_cl },
    ];
  }
}
