# GeoHex v3 for TypeScript

GeoHex v3.2 for TypeScript implementation.

# PREPARE

```sh
$ npm i -S @uupaa/geohex
```

# Build and Bundle modules

`npm run build` command build to `dist/GeoHex.js` file.

`npm run bundle:all` command bundle to `dist/GeoHex.esm.js`, `dist/GeoHex.es5.js` and `dist/GeoHex.cjs.js` files.

and other commands.

| commands             | input file(s) | output file(s) |
|----------------------|---------------|-------------|
| `npm run build`      | `ts/*.ts`     | `dist/GeoHex.js` |
| `npm run bundle`     | `dist/GeoHex.js` | `dist/GeoHex.esm.js` |
| `npm run bundle:esm` | `dist/GeoHex.js` | `dist/GeoHex.esm.js` |
| `npm run bundle:es5` | `dist/GeoHex.js` | `dist/GeoHex.es5.js` |
| `npm run bundle:cjs` | `dist/GeoHex.js` | `dist/GeoHex.cjs.js` |
| `npm run bundle:all` | `dist/GeoHex.js` | `dist/GeoHex.esm.js` <br />`dist/GeoHex.es5.js` <br />`dist/GeoHex.cjs.js` |
| `npm run watch`      |  |  |

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
import { GeoHex } from "./dist/GeoHex.esm.js";
console.log(GeoHex.version);

const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1); // { lat: 35.78044332128247, lng: 139.57018747142203, level: 9, x: 101375, y: -35983, code: "XM566370240" }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

if (zone1.equal(zone2)) {
  console.log(`matchd`);
}
</script> 
</body> 
</html> 
```

Use CommonJS style.

```js
// test/cjs.js
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
```

Use `<script src="GeoHex.es5.js">` style.

```html
// test/es5.html
<!DOCTYPE html><html><head> 
<title>GeoHex ver 3.2 browser test</title> 
</head> 
<body>
<script src="../dist/GeoHex.es5.js"></script>
<script>
const GeoHex = GeoHexLib.GeoHex;
const lat = 35.780516755235475;
const lng = 139.57031250000003;
const lv = 9;

// --- encode lat,lng to GeoHexCode  ---
const zone1 = GeoHex.getZoneByLocation(lat, lng, lv);
console.log(zone1); // { lat: 35.78044332128247, lng: 139.57018747142203, level: 9, x: 101375, y: -35983, code: "XM566370240" }

// --- decode GeoHexCode to GeoHexZone ---
const zone2 = GeoHex.getZoneByCode(zone1.code);

if (zone1.equal(zone2)) {
  console.log(`matchd`);
}
</script> 
</body> 
</html> 
```


# LISENSE

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