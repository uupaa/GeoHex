const GeoHex = require("../dist/GeoHex.cjs.js").GeoHex;

console.log(GeoHex.version);

const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1); // { lat: 35.78044332128247, lng: 139.57018747142203, x: 101375, y: -35983, level: 9, code: "XM566370240" }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

if (zone1.equal(zone2)) {
  console.log(`matchd`);
}