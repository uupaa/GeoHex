export const H_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const H_BASE = 20037508.34;
export const H_DEG = Math.PI * (30 / 180);
export const H_K = Math.tan(H_DEG);
export function calcHexSize(level) {
    return H_BASE / Math.pow(3, level + 3);
}
export function latLng2xy(lat, lng) {
    const x = lng * H_BASE / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y *= H_BASE / 180;
    return { x, y };
}
export function xy2latLng(x, y) {
    const lng = (x / H_BASE) * 180;
    let lat = (y / H_BASE) * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return { lat, lng, lon: lng };
}
