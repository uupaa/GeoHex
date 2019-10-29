const GeoHex = require("../dist/GeoHex.cjs.js").GeoHex;

console.log(GeoHex.version);

const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1.toJSON()); // { lat: 35.78044332128247, lng: 139.57018747142203, lon, x: 101375, y: -35983, code: XM566370240, level: 9 }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

const ERR  = "\u001b[31m"; // RED
const WARN = "\u001b[33m"; // YELLOW
const INFO = "\u001b[32m"; // GREEN
const CLR  = "\u001b[0m";  // WHITE

if (zone1.equals(zone2)) {
  console.log(`${INFO}matched${CLR}`);
} else {
  console.log(`${ERR}unmatched${CLR}`);
}
