export const H_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const H_BASE = 20037508.34;
export const H_DEG = Math.PI * (30 / 180);
export const H_K = Math.tan(H_DEG);

export interface XY {
  x:number,
  y:number,
}

export interface XYL {
  x:number,
  y:number,
  level:number,
}

export interface LatLng {
  lat:number,
  lng:number,
  lon:number, // lng alias
}

export function calcHexSize(level:number):number {
  return H_BASE / Math.pow(3, level + 3);
}

export function latLng2xy(lat:number, lng:number):XY {
  const x:number = lng * H_BASE / 180;
  let y:number = Math.log( Math.tan((90 + lat) * Math.PI / 360) ) / (Math.PI / 180);

  y *= H_BASE / 180;

  return { x, y };
}

export function xy2latLng(x:number, y:number):LatLng {
  const lng:number = (x / H_BASE) * 180;
  let lat:number = (y / H_BASE) * 180;

  lat = 180 / Math.PI * (2 * Math.atan( Math.exp(lat * Math.PI / 180) ) - Math.PI / 2);

  return { lat, lng, lon:lng };
}

export type GeoHexCodeString = string; // as `XM566370240`

export interface GeoHexZoneInterface {
  lat:number,
  lng:number,
  lon:number, // lng alias
  x:number,
  y:number,
  code:string,
  level:number,
  equals(zone:GeoHexZoneInterface):boolean,
  getHexSize():number,
  getHexCoords():LatLng[],
}
