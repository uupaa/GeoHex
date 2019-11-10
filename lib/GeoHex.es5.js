var GeoHexLib = (function (exports) {
    'use strict';

    var H_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var H_BASE = 20037508.34;
    var H_DEG = Math.PI * (30 / 180);
    var H_K = Math.tan(H_DEG);
    function calcHexSize(level) {
        return H_BASE / Math.pow(3, level + 3);
    }
    function latLng2xy(lat, lng) {
        var x = lng * H_BASE / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y *= H_BASE / 180;
        return { x: x, y: y };
    }
    function xy2latLng(x, y) {
        var lng = (x / H_BASE) * 180;
        var lat = (y / H_BASE) * 180;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
        return { lat: lat, lng: lng, lon: lng };
    }

    var GeoHexZone = function GeoHexZone(lat, lng, x, y, code) {
        this._lat = lat;
        this._lng = lng;
        this._x = x;
        this._y = y;
        this._code = code;
    };
    var prototypeAccessors = { lat: { configurable: true },lng: { configurable: true },lon: { configurable: true },x: { configurable: true },y: { configurable: true },code: { configurable: true },level: { configurable: true } };
    prototypeAccessors.lat.get = function () { return this._lat; };
    prototypeAccessors.lng.get = function () { return this._lng; };
    prototypeAccessors.lon.get = function () { return this._lng; };
    prototypeAccessors.x.get = function () { return this._x; };
    prototypeAccessors.y.get = function () { return this._y; };
    prototypeAccessors.code.get = function () { return this._code; };
    prototypeAccessors.level.get = function () { return this._code.length - 2; };
    GeoHexZone.prototype.equals = function equals (zone) {
        return this._lat === zone.lat && this._lng === zone.lng &&
            this._x === zone.x && this._y === zone.y &&
            this._code === zone.code;
    };
    GeoHexZone.prototype.getHexSize = function getHexSize () { return calcHexSize(this.level); };
    GeoHexZone.prototype.getHexCoords = function getHexCoords () {
        var h_lat = this._lat;
        var h_lng = this._lng;
        var ref = latLng2xy(h_lat, h_lng);
            var x = ref.x;
            var y = ref.y;
        var h_deg = Math.tan(Math.PI * (60 / 180));
        var h_size = this.getHexSize();
        var h_top = xy2latLng(x, y + h_deg * h_size).lat;
        var h_btm = xy2latLng(x, y - h_deg * h_size).lat;
        var h_l = xy2latLng(x - 2 * h_size, y).lng;
        var h_r = xy2latLng(x + 2 * h_size, y).lng;
        var h_cl = xy2latLng(x - 1 * h_size, y).lng;
        var h_cr = xy2latLng(x + 1 * h_size, y).lng;
        return [
            { lat: h_lat, lng: h_l, lon: h_l },
            { lat: h_top, lng: h_cl, lon: h_cl },
            { lat: h_top, lng: h_cr, lon: h_cr },
            { lat: h_lat, lng: h_r, lon: h_r },
            { lat: h_btm, lng: h_cr, lon: h_cr },
            { lat: h_btm, lng: h_cl, lon: h_cl } ];
    };
    GeoHexZone.prototype.toJSON = function toJSON () {
        var ref = this;
            var lat = ref.lat;
            var lng = ref.lng;
            var lon = ref.lon;
            var x = ref.x;
            var y = ref.y;
            var code = ref.code;
            var level = ref.level;
        return ("{ \"lat\": " + lat + ", \"lng\": " + lng + ", \"lon\": " + lon + ", \"x\": " + x + ", \"y\": " + y + ", \"code\": " + code + ", \"level\": " + level + " }");
    };
    Object.defineProperties( GeoHexZone.prototype, prototypeAccessors );

    function getXYByLocation(lat, lng, level) {
        var h_size = calcHexSize(level);
        var z_xy = latLng2xy(lat, lng);
        var lng_grid = z_xy.x;
        var lat_grid = z_xy.y;
        var unit_x = 6 * h_size;
        var unit_y = 6 * h_size * H_K;
        var h_pos_x = (lng_grid + lat_grid / H_K) / unit_x;
        var h_pos_y = (lat_grid - H_K * lng_grid) / unit_y;
        var h_x_0 = Math.floor(h_pos_x);
        var h_y_0 = Math.floor(h_pos_y);
        var h_x_q = h_pos_x - h_x_0;
        var h_y_q = h_pos_y - h_y_0;
        var x = Math.round(h_pos_x);
        var y = Math.round(h_pos_y);
        if (h_y_q > -h_x_q + 1) {
            if ((h_y_q < 2 * h_x_q) && (h_y_q > 0.5 * h_x_q)) {
                x = h_x_0 + 1;
                y = h_y_0 + 1;
            }
        }
        else if (h_y_q < -h_x_q + 1) {
            if ((h_y_q > (2 * h_x_q) - 1) && (h_y_q < (0.5 * h_x_q) + 0.5)) {
                x = h_x_0;
                y = h_y_0;
            }
        }
        return adjustXY(x, y, level);
    }
    function getZoneByXY(xyl) {
        var x = xyl.x;
        var y = xyl.y;
        var level = xyl.level;
        var h_size = calcHexSize(level);
        var unit_x = 6 * h_size;
        var unit_y = 6 * h_size * H_K;
        var h_lat = (H_K * x * unit_x + y * unit_y) / 2;
        var h_lng = (h_lat - y * unit_y) / H_K;
        var z_loc = xy2latLng(h_lng, h_lat);
        var z_loc_x = z_loc.lng;
        var z_loc_y = z_loc.lat;
        var max_hsteps = Math.pow(3, level + 2);
        var hsteps = Math.abs(x - y);
        if (hsteps === max_hsteps) {
            if (x > y) {
                var tmp = x;
                x = y;
                y = tmp;
            }
            z_loc_x = -180;
        }
        var code3_x = [];
        var code3_y = [];
        var mod_x = x;
        var mod_y = y;
        for (var i = 0; i <= level + 2; i++) {
            var h_pow = Math.pow(3, level + 2 - i);
            if (mod_x >= Math.ceil(h_pow / 2)) {
                code3_x[i] = 2;
                mod_x -= h_pow;
            }
            else if (mod_x <= -Math.ceil(h_pow / 2)) {
                code3_x[i] = 0;
                mod_x += h_pow;
            }
            else {
                code3_x[i] = 1;
            }
            if (mod_y >= Math.ceil(h_pow / 2)) {
                code3_y[i] = 2;
                mod_y -= h_pow;
            }
            else if (mod_y <= -Math.ceil(h_pow / 2)) {
                code3_y[i] = 0;
                mod_y += h_pow;
            }
            else {
                code3_y[i] = 1;
            }
            if (i === 2 && (z_loc_x === -180 || z_loc_x >= 0)) {
                if (code3_x[0] === 2 &&
                    code3_y[0] === 1 &&
                    code3_x[1] === code3_y[1] &&
                    code3_x[2] === code3_y[2]) {
                    code3_x[0] = 1;
                    code3_y[0] = 2;
                }
                else if (code3_x[0] === 1 &&
                    code3_y[0] === 0 &&
                    code3_x[1] === code3_y[1] &&
                    code3_x[2] === code3_y[2]) {
                    code3_x[0] = 0;
                    code3_y[0] = 1;
                }
            }
        }
        var h_code = "";
        for (var i$1 = 0; i$1 < code3_x.length; i$1++) {
            var code3 = ("" + code3_x[i$1] + code3_y[i$1]);
            var code9 = parseInt(code3, 3);
            h_code += code9.toString(10);
        }
        var h_2 = h_code.slice(3);
        var h_1 = h_code.slice(0, 3);
        var h_1_num = parseInt(h_1, 10) || 0;
        var h_a1 = Math.floor(h_1_num / 30);
        var h_a2 = h_1_num % 30;
        h_code = H_KEY[h_a1] + H_KEY[h_a2] + h_2;
        return new GeoHexZone(z_loc_y, z_loc_x, xyl.x, xyl.y, h_code);
    }
    function getXYByCode(code) {
        var level = code.length - 2;
        var x = 0;
        var y = 0;
        var h_dec9 = (H_KEY.indexOf(code[0]) * 30 + H_KEY.indexOf(code[1])) + code.slice(2);
        if (/[15]/.test(h_dec9[0]) &&
            /[^125]/.test(h_dec9[1]) &&
            /[^125]/.test(h_dec9[2])) {
            if (h_dec9[0] === "5") {
                h_dec9 = "7" + h_dec9.slice(1, h_dec9.length);
            }
            else if (h_dec9[0] === "1") {
                h_dec9 = "3" + h_dec9.slice(1, h_dec9.length);
            }
        }
        var d9xlen = h_dec9.length;
        for (var i = 0; i < level + 3 - d9xlen; i++) {
            h_dec9 = "0" + h_dec9;
            ++d9xlen;
        }
        var h_dec3 = "";
        for (var i$1 = 0; i$1 < d9xlen; i$1++) {
            var h_dec0 = parseInt(h_dec9[i$1]).toString(3);
            if (!h_dec0) {
                h_dec3 += "00";
            }
            else if (h_dec0.length === 1) {
                h_dec3 += "0";
            }
            h_dec3 += h_dec0;
        }
        var h_decx = [];
        var h_decy = [];
        for (var i$2 = 0; i$2 < h_dec3.length / 2; i$2++) {
            h_decx[i$2] = h_dec3[i$2 * 2];
            h_decy[i$2] = h_dec3[i$2 * 2 + 1];
        }
        for (var i$3 = 0; i$3 <= level + 2; i$3++) {
            var h_pow = Math.pow(3, level + 2 - i$3);
            if (h_decx[i$3] === "0") {
                x -= h_pow;
            }
            else if (h_decx[i$3] === "2") {
                x += h_pow;
            }
            if (h_decy[i$3] === "0") {
                y -= h_pow;
            }
            else if (h_decy[i$3] === "2") {
                y += h_pow;
            }
        }
        return adjustXY(x, y, level);
    }
    function adjustXY(x, y, level) {
        var max_hsteps = Math.pow(3, level + 2);
        var hsteps = Math.abs(x - y);
        if (hsteps === max_hsteps && x > y) {
            var tmp = x;
            x = y;
            y = tmp;
        }
        else if (hsteps > max_hsteps) {
            var dif = hsteps - max_hsteps;
            var dif_x = Math.floor(dif / 2);
            var dif_y = dif - dif_x;
            var edge_x = 0;
            var edge_y = 0;
            if (x > y) {
                edge_x = x - dif_x;
                edge_y = y + dif_y;
                var h_xy = edge_x;
                edge_x = edge_y;
                edge_y = h_xy;
                x = edge_x + dif_x;
                y = edge_y - dif_y;
            }
            else if (y > x) {
                edge_x = x + dif_x;
                edge_y = y - dif_y;
                var h_xy$1 = edge_x;
                edge_x = edge_y;
                edge_y = h_xy$1;
                x = edge_x - dif_x;
                y = edge_y + dif_y;
            }
        }
        return { x: x, y: y, level: level };
    }
    function getXYListByRect(a_lat, a_lng, b_lat, b_lng, level) {
        var base_steps = Math.pow(3, level + 2) * 2;
        var min_lat = (a_lat > b_lat) ? b_lat : a_lat;
        var max_lat = (a_lat < b_lat) ? b_lat : a_lat;
        var min_lng = a_lng;
        var max_lng = b_lng;
        var zone_tl = getZoneByXY(getXYByLocation(max_lat, min_lng, level));
        var zone_bl = getZoneByXY(getXYByLocation(min_lat, min_lng, level));
        var zone_br = getZoneByXY(getXYByLocation(min_lat, max_lng, level));
        var zone_tr = getZoneByXY(getXYByLocation(max_lat, max_lng, level));
        var h_size = zone_br.getHexSize();
        var bl_xy = latLng2xy(zone_bl.lat, zone_bl.lng);
        var bl_cl = xy2latLng(bl_xy.x - h_size, bl_xy.y).lng;
        var bl_cr = xy2latLng(bl_xy.x + h_size, bl_xy.y).lng;
        var br_xy = latLng2xy(zone_br.lat, zone_br.lng);
        var br_cl = xy2latLng(br_xy.x - h_size, br_xy.y).lng;
        var br_cr = xy2latLng(br_xy.x + h_size, br_xy.y).lng;
        var s_steps = getXSteps(min_lng, max_lng, zone_bl, zone_br);
        var w_steps = getYSteps(min_lng, zone_bl, zone_tl);
        var n_steps = getXSteps(min_lng, max_lng, zone_tl, zone_tr);
        var e_steps = getYSteps(max_lng, zone_br, zone_tr);
        var edge = { l: 0, r: 0, t: 0, b: 0 };
        if (s_steps === n_steps && s_steps >= base_steps) {
            edge.l = 0;
            edge.r = 0;
        }
        else {
            if (min_lng > 0 && zone_bl.lng === -180) {
                var m_lng = min_lng - 360;
                if (bl_cr < m_lng) {
                    edge.l = 1;
                }
                if (bl_cl > m_lng) {
                    edge.l = -1;
                }
            }
            else {
                if (bl_cr < min_lng) {
                    edge.l = 1;
                }
                if (bl_cl > min_lng) {
                    edge.l = -1;
                }
            }
            if (max_lng > 0 && zone_br.lng === -180) {
                var m_lng$1 = max_lng - 360;
                if (br_cr < m_lng$1) {
                    edge.r = 1;
                }
                if (br_cl > m_lng$1) {
                    edge.r = -1;
                }
            }
            else {
                if (br_cr < max_lng) {
                    edge.r = 1;
                }
                if (br_cl > max_lng) {
                    edge.r = -1;
                }
            }
        }
        if (zone_bl.lat > min_lat) {
            edge.b++;
        }
        if (zone_tl.lat > max_lat) {
            edge.t++;
        }
        var s_list = getXList(zone_bl, s_steps, edge.b);
        var w_list = getYList(zone_bl, w_steps, edge.l);
        var tl_end = { x: w_list[w_list.length - 1].x, y: w_list[w_list.length - 1].y };
        var br_end = { x: s_list[s_list.length - 1].x, y: s_list[s_list.length - 1].y };
        var n_list = getXList(tl_end, n_steps, edge.t);
        var e_list = getYList(br_end, e_steps, edge.r);
        return mergeList(s_list.concat(w_list, n_list, e_list), level);
    }
    function getXList(_min, _xsteps, _edge) {
        var list = [];
        for (var i = 0; i < _xsteps; i++) {
            var x = _edge ? _min.x + Math.floor(i / 2) : _min.x + Math.ceil(i / 2);
            var y = _edge ? _min.y + Math.floor(i / 2) - i : _min.y + Math.ceil(i / 2) - i;
            list.push({ x: x, y: y });
        }
        return list;
    }
    function getYList(_min, _ysteps, _edge) {
        var list = [];
        var steps_base = Math.floor(_ysteps);
        var steps_half = _ysteps - steps_base;
        for (var i = 0; i < steps_base; i++) {
            var x = _min.x + i;
            var y = _min.y + i;
            list.push({ x: x, y: y });
            if (_edge !== 0) {
                if (steps_half === 0 && i === steps_base - 1) ;
                else {
                    var x$1 = (_edge > 0) ? _min.x + i + 1 : _min.x + i;
                    var y$1 = (_edge < 0) ? _min.y + i + 1 : _min.y + i;
                    list.push({ x: x$1, y: y$1 });
                }
            }
        }
        return list;
    }
    function getXSteps(_minlng, _maxlng, _min, _max) {
        var minsteps = Math.abs(_min.x - _min.y);
        var maxsteps = Math.abs(_max.x - _max.y);
        var code = _min.code;
        var base_steps = Math.pow(3, code.length) * 2;
        var steps = 0;
        if (_min.lng == -180 && _max.lng == -180) {
            if ((_minlng > _maxlng && _minlng * _maxlng >= 0) ||
                (_minlng < 0 && _maxlng > 0)) {
                steps = base_steps;
            }
            else {
                steps = 0;
            }
        }
        else if (Math.abs(_min.lng - _max.lng) < 0.0000000001) {
            if (_min.lng != -180 && _minlng > _maxlng) {
                steps = base_steps;
            }
            else {
                steps = 0;
            }
        }
        else if (_min.lng < _max.lng) {
            if (_min.lng <= 0 && _max.lng <= 0) {
                steps = minsteps - maxsteps;
            }
            else if (_min.lng <= 0 && _max.lng >= 0) {
                steps = minsteps + maxsteps;
            }
            else if (_min.lng >= 0 && _max.lng >= 0) {
                steps = maxsteps - minsteps;
            }
        }
        else if (_min.lng > _max.lng) {
            if (_min.lng <= 0 && _max.lng <= 0) {
                steps = base_steps - maxsteps + minsteps;
            }
            else if (_min.lng >= 0 && _max.lng <= 0) {
                steps = base_steps - (minsteps + maxsteps);
            }
            else if (_min.lng >= 0 && _max.lng >= 0) {
                steps = base_steps + maxsteps - minsteps;
            }
        }
        return steps + 1;
    }
    function getYSteps(_lng, _min, _max) {
        var min_x = _min.x;
        var min_y = _min.y;
        var max_x = _max.x;
        var max_y = _max.y;
        if (_lng > 0) {
            if (_min.lng !== -180 && _max.lng === -180) {
                max_x = _max.y;
                max_y = _max.x;
            }
            if (_min.lng === -180 && _max.lng !== -180) {
                min_x = _min.y;
                min_y = _min.x;
            }
        }
        var steps = Math.abs(min_y - max_y);
        var half = Math.abs(max_x - min_x) - Math.abs(max_y - min_y);
        return steps + half * 0.5 + 1;
    }
    function mergeList(_arr, _level) {
        var newArr = [];
        var mrgArr = [];
        _arr.sort(function (a, b) {
            return (a.x > b.x ? 1 : a.x < b.x ? -1 : a.y < b.y ? 1 : -1);
        });
        for (var i = 0; i < _arr.length; i++) {
            if (!i) {
                var inner_xy = adjustXY(_arr[i].x, _arr[i].y, _level);
                var x = inner_xy.x;
                var y = inner_xy.y;
                if (!mrgArr[x]) {
                    mrgArr[x] = [];
                }
                if (!mrgArr[x][y]) {
                    mrgArr[x][y] = true;
                    newArr.push({ x: x, y: y });
                }
            }
            else {
                var mrg = margeCheck(_arr[i - 1], _arr[i]);
                for (var j = 0; j < mrg; j++) {
                    var inner_xy$1 = adjustXY(_arr[i].x, _arr[i].y + j, _level);
                    var x$1 = inner_xy$1.x;
                    var y$1 = inner_xy$1.y;
                    if (!mrgArr[x$1]) {
                        mrgArr[x$1] = [];
                    }
                    if (!mrgArr[x$1][y$1]) {
                        mrgArr[x$1][y$1] = true;
                        newArr.push({ x: x$1, y: y$1 });
                    }
                }
            }
        }
        return newArr;
    }
    function margeCheck(_pre, _next) {
        if (_pre.x === _next.x) {
            if (_pre.y === _next.y) {
                return 0;
            }
            return Math.abs(_next.y - _pre.y);
        }
        return 1;
    }

    var GeoHex = function GeoHex () {};
    GeoHex.getZoneByLocation = function getZoneByLocation (lat, lng, level) {
        return getZoneByXY(getXYByLocation(lat, lng, level));
    };
    GeoHex.getZoneByXY = function getZoneByXY$1 (x, y, level) {
        return getZoneByXY({ x: x, y: y, level: level });
    };
    GeoHex.getZoneByCode = function getZoneByCode (code) {
        return getZoneByXY(getXYByCode(code));
    };
    GeoHex.getXYByLocation = function getXYByLocation$1 (lat, lng, level) {
        return getXYByLocation(lat, lng, level);
    };
    GeoHex.getXYListByRect = function getXYListByRect$1 (a_lat, a_lng, b_lat, b_lng, level) {
        return getXYListByRect(a_lat, a_lng, b_lat, b_lng, level);
    };
    GeoHex.version = "3.2.0";

    exports.GeoHex = GeoHex;

    return exports;

}({}));
