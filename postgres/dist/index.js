"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hivePg = void 0;
var pg_1 = require("pg");
var hivePg = /** @class */ (function () {
    function hivePg(config, options) {
        if (options === void 0) { options = { table: 'json' }; }
        this.options = options;
        this.pool = new pg_1.Pool(config);
        this.search("create table if not exists " + this.options.table + " (key text, val text)");
    }
    hivePg.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, ret, base;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.search("select * from " + this.options.table)];
                    case 1:
                        res = _a.sent();
                        ret = [];
                        base = {};
                        if (!res.rows || res.rows.length <= 0)
                            return [2 /*return*/, {}];
                        res.rows.map(function (r) {
                            var _a;
                            return ret.push((_a = {}, _a[r.key] = JSON.parse(r.val), _a));
                        });
                        ret.map(function (e) { return Object.assign(base, e); });
                        return [2 /*return*/, base];
                }
            });
        });
    };
    hivePg.prototype.exists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.search("select * from " + this.options.table + " where key = ($1)", [key])];
                    case 1:
                        res = _a.sent();
                        if (!res.rows || res.rows.length <= 0)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    hivePg.prototype.set = function (key, val) {
        return __awaiter(this, void 0, void 0, function () {
            var found, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            JSON.stringify(val);
                        }
                        catch (e) {
                            throw new Error("Could not stringify value.");
                        }
                        return [4 /*yield*/, this.search("select * from " + this.options.table + " where key = ($1)", [key])];
                    case 1:
                        found = _a.sent();
                        if (!(found.rows.length > 0)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.search("update " + this.options.table + " set val = ($2) where key = ($1)", [key, JSON.stringify(val)])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.search("insert into " + this.options.table + " (key, val) VALUES ($1,$2)", [key, JSON.stringify(val)])];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    hivePg.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.search("select * from " + this.options.table + " where key = ($1)", [key])];
                    case 1:
                        res = _a.sent();
                        if (!res.rows || res.rows.length <= 0)
                            return [2 /*return*/, null];
                        return [2 /*return*/, JSON.parse(res.rows[0].val)];
                }
            });
        });
    };
    hivePg.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.search("delete from " + this.options.table + " where key = ($1)", [key])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    hivePg.prototype.push = function (key, element) {
        return __awaiter(this, void 0, void 0, function () {
            var found, array, e_4, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            JSON.stringify(element);
                        }
                        catch (e) {
                            throw new Error("Could not stringify value.");
                        }
                        return [4 /*yield*/, this.search("select * from " + this.options.table + " where key = ($1)", [key])];
                    case 1:
                        found = _a.sent();
                        if (!(found.rows.length > 0)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        array = JSON.parse(found.rows[0].val);
                        if (!Array.isArray(array))
                            throw new Error('Value gotten from key did not return as an array, will not override value.');
                        array.push(element);
                        return [4 /*yield*/, this.search("update " + this.options.table + " set val = ($2) where key = ($1)", [key, JSON.stringify(array)])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        e_4 = _a.sent();
                        throw new Error(e_4);
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.search("insert into " + this.options.table + " (key, val) VALUES ($1,$2)", [key, JSON.stringify([element])])];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8:
                        e_5 = _a.sent();
                        throw new Error(e_5);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    hivePg.prototype.search = function (query, data) {
        var _this = this;
        if (data === void 0) { data = null; }
        return new Promise(function (res, rej) {
            _this.pool.query(query, data, function (err, result) {
                if (err)
                    rej(err);
                return res(result);
            });
        });
    };
    return hivePg;
}());
exports.hivePg = hivePg;
