# GeoHex v3.2 with TypeScript

[GeoHex](http://www.geohex.org/) v3.2 with TypeScript implementation.

# PREPARE

```sh
$ npm i -S @uupaa/geohex
```

# import
 
```ts
// Pattern 1 (recommended): import complete relative path without `--moduleResolution` and `--baseUrl` compiler options.
// For import url, specify the complete relative path.
// This works with node.js and browser. Please consider bundled into one file.
import { GeoHex } from "../node_modules/@uupaa/geohex/lib/GeoHex.js";

/*
{
  "compilerOptions": {
    "module": "ESNext",
  //"moduleResolution": "node",
  //"baseUrl": "./",
  }
}
 */
```

```ts
// Pattern 2: import package name with `--moduleResolution` and `--baseUrl` compiler options.
// For import url, specify the short package name.
// This works in node.js, but does not work if you import directly from the browser.
import { GeoHex } from "@uupaa/geohex";

/*
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "baseUrl": "./",
  }
}
 */
```

# Build and Bundle modules

The `npm run build` command, build to `lib/GeoHex.js` file.

`npm run bundle:all` command, bundle to `lib/GeoHex.esm.js`, `lib/GeoHex.es5.js` and `lib/GeoHex.cjs.js` files.

Other commands.

| commands             | input file    | output file(s) |
|----------------------|---------------|-------------|
| `npm run build`      | `ts/`         | `lib/GeoHex.js` <br /> `lib/GeoHex.d.ts` |
| `npm run bundle`     | `lib/GeoHex.js` | `lib/GeoHex.esm.js` |
| `npm run bundle:esm` | `lib/GeoHex.js` | `lib/GeoHex.esm.js` |
| `npm run bundle:es5` | `lib/GeoHex.js` | `lib/GeoHex.es5.js` |
| `npm run bundle:cjs` | `lib/GeoHex.js` | `lib/GeoHex.cjs.js` |
| `npm run bundle:all` | `lib/GeoHex.js` | `lib/GeoHex.esm.js` <br />`lib/GeoHex.es5.js` <br />`lib/GeoHex.cjs.js` |
| `npm run watch`      |  |  |
| `npm run test`       |  |  |
| `npm run test:compat` |  |  |

# Browser and runtime support

| Browser                   | `<script type>`<br/>`import` | `<script>` | `require()` |
|---------------------------|----------|----------------|---------------|
| Chrome                    | 61+   | :o: |     |
| Chrome (Android)          | 61+   | :o: |     |
| Safari                    | 10.1+ | :o: |     |
| Safari (iOS)              | 10.3+ | :o: |     |
| Firefox                   | 60+   | :o: |     |
| Edge                      | 16+   | :o: |     |
| new Edge (Chromium based) | 76+   | :o: |     |
| IE                        | :x:   | :o: |     |
| Electron(render)          | :o:   | :o: |     |
| Electron(main)            |       |     | :o: |
| Node.js                   |       |     | :o: |

# USAGE

Use `import` and `<script type="module">` style.

```html
// test/esm.html
<!DOCTYPE html><html><head> 
<title>GeoHex ver 3.2 browser test</title> 
</head> 
<body>
<script type="module">
import { GeoHex } from "./node_modules/@uupaa/geohex/lib/GeoHex.esm.js";
console.log(GeoHex.version);

const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1.toJSON()); // { lat: 35.78044332128247, lng: 139.57018747142203, lon, x: 101375, y: -35983, code: XM566370240, level: 9 }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

if (zone1.equals(zone2)) {
  console.log(`matched`);
}
</script> 
</body> 
</html> 
```

Use CommonJS style.

```js
// test/cjs.js
const GeoHex = require("../lib/GeoHex.cjs.js").GeoHex;
console.log(GeoHex.version);

const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1.toJSON()); // { lat: 35.78044332128247, lng: 139.57018747142203, lon, x: 101375, y: -35983, code: XM566370240, level: 9 }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

if (zone1.equals(zone2)) {
  console.log(`matched`);
}
```

Use `<script src="GeoHex.es5.js">` style.

```html
// test/es5.html
<!DOCTYPE html><html><head> 
<title>GeoHex ver 3.2 browser test</title> 
</head> 
<body>
<script src="./node_modules/@uupaa/geohex/lib/GeoHex.es5.js"></script>
<script>
const GeoHex = GeoHexLib.GeoHex;
const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1.toJSON()); // { lat: 35.78044332128247, lng: 139.57018747142203, lon, x: 101375, y: -35983, code: XM566370240, level: 9 }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

if (zone1.equals(zone2)) {
  console.log(`matched`);
}
</script> 
</body> 
</html> 
```

# Class GeoHex
```ts
export class GeoHex {
  static version:SemVerString = "3.2.0"; // http://geohex.net/src/script/hex_v3.2_core.js

  // Convert a map location(lat,lng) to a GeoHex Zone structure.
  static getZoneByLocation(lat:number, lng:number, level:number):GeoHexZoneInterface,

  // Convert a GeoHex position(x,y) to a GeoHex Zone structure.
  static getZoneByXY(x:number, y:number, level:number):GeoHexZoneInterface,

  // Convert a GeoHex code string to a GeoHex Zone structure.
  static getZoneByCode(code:GeoHexCodeString):GeoHexZoneInterface,

  // Convert a GeoHex position(x,y) to a map location(lat,lng).
  static getXYByLocation(lat:number, lng:number, level:number):XYL,

  // List the shortest routes from map location A to map location B.
  static getXYListByRect(a_lat:number, a_lng:number, b_lat:number, b_lng:number, level:number):XY[],
}  

```

## Class GeoHexZone and other Interfaces

```ts
export class GeoHexZone implements GeoHexZoneInterface {
  constructor(lat:number, lng:number, x:number, y:number, code:string),
  get lat():number,
  get lng():number,
  get lon():number, // alias 
  get x():number,
  get y():number,
  get code():string,
  get level():number,
  equals(zone:GeoHexZoneInterface):boolean,
  getHexSize():number,
  getHexCoords():LatLng[],
  toJSON():string,
}

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
```

# LICENSE

The MIT License (MIT), in honor of @sa2da. http://twitter.com/sa2da comes from http://www.geohex.org

Copyright (c) 2019 @uupaa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
