const H_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const H_BASE = 20037508.34;
const H_DEG = Math.PI * (30 / 180);
const H_K = Math.tan(H_DEG);
function calcHexSize(level) {
    return H_BASE / Math.pow(3, level + 3);
}
function latLng2xy(lat, lng) {
    const x = lng * H_BASE / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y *= H_BASE / 180;
    return { x, y };
}
function xy2latLng(x, y) {
    const lng = (x / H_BASE) * 180;
    let lat = (y / H_BASE) * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return { lat, lng, lon: lng };
}

class GeoHexZone {
    constructor(lat, lng, x, y, code) {
        this._lat = lat;
        this._lng = lng;
        this._x = x;
        this._y = y;
        this._code = code;
    }
    get lat() { return this._lat; }
    get lng() { return this._lng; }
    get lon() { return this._lng; }
    get x() { return this._x; }
    get y() { return this._y; }
    get code() { return this._code; }
    get level() { return this._code.length - 2; }
    equals(zone) {
        return this._lat === zone.lat && this._lng === zone.lng &&
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

function getXYByLocation(lat, lng, level) {
    const h_size = calcHexSize(level);
    const z_xy = latLng2xy(lat, lng);
    const lng_grid = z_xy.x;
    const lat_grid = z_xy.y;
    const unit_x = 6 * h_size;
    const unit_y = 6 * h_size * H_K;
    const h_pos_x = (lng_grid + lat_grid / H_K) / unit_x;
    const h_pos_y = (lat_grid - H_K * lng_grid) / unit_y;
    const h_x_0 = Math.floor(h_pos_x);
    const h_y_0 = Math.floor(h_pos_y);
    const h_x_q = h_pos_x - h_x_0;
    const h_y_q = h_pos_y - h_y_0;
    let x = Math.round(h_pos_x);
    let y = Math.round(h_pos_y);
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
    let { x, y } = xyl;
    const { level } = xyl;
    const h_size = calcHexSize(level);
    const unit_x = 6 * h_size;
    const unit_y = 6 * h_size * H_K;
    const h_lat = (H_K * x * unit_x + y * unit_y) / 2;
    const h_lng = (h_lat - y * unit_y) / H_K;
    const z_loc = xy2latLng(h_lng, h_lat);
    let z_loc_x = z_loc.lng;
    const z_loc_y = z_loc.lat;
    const max_hsteps = Math.pow(3, level + 2);
    const hsteps = Math.abs(x - y);
    if (hsteps === max_hsteps) {
        if (x > y) {
            const tmp = x;
            x = y;
            y = tmp;
        }
        z_loc_x = -180;
    }
    const code3_x = [];
    const code3_y = [];
    let mod_x = x;
    let mod_y = y;
    for (let i = 0; i <= level + 2; i++) {
        const h_pow = Math.pow(3, level + 2 - i);
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
    let h_code = "";
    for (let i = 0; i < code3_x.length; i++) {
        const code3 = ("" + code3_x[i] + code3_y[i]);
        const code9 = parseInt(code3, 3);
        h_code += code9.toString(10);
    }
    const h_2 = h_code.slice(3);
    const h_1 = h_code.slice(0, 3);
    const h_1_num = parseInt(h_1, 10) || 0;
    const h_a1 = Math.floor(h_1_num / 30);
    const h_a2 = h_1_num % 30;
    h_code = H_KEY[h_a1] + H_KEY[h_a2] + h_2;
    return new GeoHexZone(z_loc_y, z_loc_x, xyl.x, xyl.y, h_code);
}
function getXYByCode(code) {
    const level = code.length - 2;
    let x = 0;
    let y = 0;
    let h_dec9 = (H_KEY.indexOf(code[0]) * 30 + H_KEY.indexOf(code[1])) + code.slice(2);
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
    let d9xlen = h_dec9.length;
    for (let i = 0; i < level + 3 - d9xlen; i++) {
        h_dec9 = "0" + h_dec9;
        ++d9xlen;
    }
    let h_dec3 = "";
    for (let i = 0; i < d9xlen; i++) {
        const h_dec0 = parseInt(h_dec9[i]).toString(3);
        if (!h_dec0) {
            h_dec3 += "00";
        }
        else if (h_dec0.length === 1) {
            h_dec3 += "0";
        }
        h_dec3 += h_dec0;
    }
    let h_decx = [];
    let h_decy = [];
    for (let i = 0; i < h_dec3.length / 2; i++) {
        h_decx[i] = h_dec3[i * 2];
        h_decy[i] = h_dec3[i * 2 + 1];
    }
    for (let i = 0; i <= level + 2; i++) {
        let h_pow = Math.pow(3, level + 2 - i);
        if (h_decx[i] === "0") {
            x -= h_pow;
        }
        else if (h_decx[i] === "2") {
            x += h_pow;
        }
        if (h_decy[i] === "0") {
            y -= h_pow;
        }
        else if (h_decy[i] === "2") {
            y += h_pow;
        }
    }
    return adjustXY(x, y, level);
}
function adjustXY(x, y, level) {
    let max_hsteps = Math.pow(3, level + 2);
    let hsteps = Math.abs(x - y);
    if (hsteps === max_hsteps && x > y) {
        let tmp = x;
        x = y;
        y = tmp;
    }
    else if (hsteps > max_hsteps) {
        const dif = hsteps - max_hsteps;
        const dif_x = Math.floor(dif / 2);
        const dif_y = dif - dif_x;
        let edge_x = 0;
        let edge_y = 0;
        if (x > y) {
            edge_x = x - dif_x;
            edge_y = y + dif_y;
            const h_xy = edge_x;
            edge_x = edge_y;
            edge_y = h_xy;
            x = edge_x + dif_x;
            y = edge_y - dif_y;
        }
        else if (y > x) {
            edge_x = x + dif_x;
            edge_y = y - dif_y;
            const h_xy = edge_x;
            edge_x = edge_y;
            edge_y = h_xy;
            x = edge_x - dif_x;
            y = edge_y + dif_y;
        }
    }
    return { x, y, level };
}
function getXYListByRect(a_lat, a_lng, b_lat, b_lng, level) {
    const base_steps = Math.pow(3, level + 2) * 2;
    const min_lat = (a_lat > b_lat) ? b_lat : a_lat;
    const max_lat = (a_lat < b_lat) ? b_lat : a_lat;
    const min_lng = a_lng;
    const max_lng = b_lng;
    const zone_tl = getZoneByXY(getXYByLocation(max_lat, min_lng, level));
    const zone_bl = getZoneByXY(getXYByLocation(min_lat, min_lng, level));
    const zone_br = getZoneByXY(getXYByLocation(min_lat, max_lng, level));
    const zone_tr = getZoneByXY(getXYByLocation(max_lat, max_lng, level));
    const h_size = zone_br.getHexSize();
    const bl_xy = latLng2xy(zone_bl.lat, zone_bl.lng);
    const bl_cl = xy2latLng(bl_xy.x - h_size, bl_xy.y).lng;
    const bl_cr = xy2latLng(bl_xy.x + h_size, bl_xy.y).lng;
    const br_xy = latLng2xy(zone_br.lat, zone_br.lng);
    const br_cl = xy2latLng(br_xy.x - h_size, br_xy.y).lng;
    const br_cr = xy2latLng(br_xy.x + h_size, br_xy.y).lng;
    const s_steps = getXSteps(min_lng, max_lng, zone_bl, zone_br);
    const w_steps = getYSteps(min_lng, zone_bl, zone_tl);
    const n_steps = getXSteps(min_lng, max_lng, zone_tl, zone_tr);
    const e_steps = getYSteps(max_lng, zone_br, zone_tr);
    const edge = { l: 0, r: 0, t: 0, b: 0 };
    if (s_steps === n_steps && s_steps >= base_steps) {
        edge.l = 0;
        edge.r = 0;
    }
    else {
        if (min_lng > 0 && zone_bl.lng === -180) {
            const m_lng = min_lng - 360;
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
            const m_lng = max_lng - 360;
            if (br_cr < m_lng) {
                edge.r = 1;
            }
            if (br_cl > m_lng) {
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
    const s_list = getXList(zone_bl, s_steps, edge.b);
    const w_list = getYList(zone_bl, w_steps, edge.l);
    const tl_end = { x: w_list[w_list.length - 1].x, y: w_list[w_list.length - 1].y };
    const br_end = { x: s_list[s_list.length - 1].x, y: s_list[s_list.length - 1].y };
    const n_list = getXList(tl_end, n_steps, edge.t);
    const e_list = getYList(br_end, e_steps, edge.r);
    return mergeList(s_list.concat(w_list, n_list, e_list), level);
}
function getXList(_min, _xsteps, _edge) {
    const list = [];
    for (let i = 0; i < _xsteps; i++) {
        const x = _edge ? _min.x + Math.floor(i / 2) : _min.x + Math.ceil(i / 2);
        const y = _edge ? _min.y + Math.floor(i / 2) - i : _min.y + Math.ceil(i / 2) - i;
        list.push({ x, y });
    }
    return list;
}
function getYList(_min, _ysteps, _edge) {
    const list = [];
    const steps_base = Math.floor(_ysteps);
    const steps_half = _ysteps - steps_base;
    for (let i = 0; i < steps_base; i++) {
        const x = _min.x + i;
        const y = _min.y + i;
        list.push({ x, y });
        if (_edge !== 0) {
            if (steps_half === 0 && i === steps_base - 1) ;
            else {
                const x = (_edge > 0) ? _min.x + i + 1 : _min.x + i;
                const y = (_edge < 0) ? _min.y + i + 1 : _min.y + i;
                list.push({ x, y });
            }
        }
    }
    return list;
}
function getXSteps(_minlng, _maxlng, _min, _max) {
    const minsteps = Math.abs(_min.x - _min.y);
    const maxsteps = Math.abs(_max.x - _max.y);
    const code = _min.code;
    const base_steps = Math.pow(3, code.length) * 2;
    let steps = 0;
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
    let min_x = _min.x;
    let min_y = _min.y;
    let max_x = _max.x;
    let max_y = _max.y;
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
    const steps = Math.abs(min_y - max_y);
    const half = Math.abs(max_x - min_x) - Math.abs(max_y - min_y);
    return steps + half * 0.5 + 1;
}
function mergeList(_arr, _level) {
    const newArr = [];
    const mrgArr = [];
    _arr.sort(function (a, b) {
        return (a.x > b.x ? 1 : a.x < b.x ? -1 : a.y < b.y ? 1 : -1);
    });
    for (let i = 0; i < _arr.length; i++) {
        if (!i) {
            var inner_xy = adjustXY(_arr[i].x, _arr[i].y, _level);
            var x = inner_xy.x;
            var y = inner_xy.y;
            if (!mrgArr[x]) {
                mrgArr[x] = [];
            }
            if (!mrgArr[x][y]) {
                mrgArr[x][y] = true;
                newArr.push({ x, y });
            }
        }
        else {
            var mrg = margeCheck(_arr[i - 1], _arr[i]);
            for (let j = 0; j < mrg; j++) {
                const inner_xy = adjustXY(_arr[i].x, _arr[i].y + j, _level);
                const x = inner_xy.x;
                const y = inner_xy.y;
                if (!mrgArr[x]) {
                    mrgArr[x] = [];
                }
                if (!mrgArr[x][y]) {
                    mrgArr[x][y] = true;
                    newArr.push({ x, y });
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

class GeoHex {
    static getZoneByLocation(lat, lng, level) {
        return getZoneByXY(getXYByLocation(lat, lng, level));
    }
    static getZoneByXY(x, y, level) {
        return getZoneByXY({ x, y, level });
    }
    static getZoneByCode(code) {
        return getZoneByXY(getXYByCode(code));
    }
    static getXYByLocation(lat, lng, level) {
        return getXYByLocation(lat, lng, level);
    }
    static getXYListByRect(a_lat, a_lng, b_lat, b_lng, level) {
        return getXYListByRect(a_lat, a_lng, b_lat, b_lng, level);
    }
}
GeoHex.version = "3.2.0";

export { GeoHex };
