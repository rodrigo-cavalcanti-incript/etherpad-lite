'use strict';
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var node_process_1 = require("node:process");
var ueberdb2_1 = require("ueberdb2");
var log4js_1 = require("log4js");
var settings = require('ep_etherpad-lite/node/utils/Settings');
// As of v14, Node.js does not exit when there is an unhandled Promise rejection. Convert an
// unhandled rejection into an uncaught exception, which does cause Node.js to exit.
node_process_1.default.on('unhandledRejection', function (err) { throw err; });
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var dbWrapperSettings, db, dirty, keys, p, numWritten, _loop_1, _i, keys_1, key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dbWrapperSettings = {
                    cache: '0', // The cache slows things down when you're mostly writing.
                    writeInterval: 0, // Write directly to the database, don't buffer
                };
                db = new ueberdb2_1.Database(// eslint-disable-line new-cap
                settings.dbType, settings.dbSettings, dbWrapperSettings, log4js_1.default.getLogger('ueberDB'));
                return [4 /*yield*/, db.init()];
            case 1:
                _a.sent();
                console.log('Waiting for dirtyDB to parse its file.');
                dirty = new ueberdb2_1.Database('dirty', "".concat(__dirname, "/../var/dirty.db"));
                return [4 /*yield*/, dirty.init()];
            case 2:
                _a.sent();
                return [4 /*yield*/, dirty.findKeys('*', '')];
            case 3:
                keys = _a.sent();
                console.log("Found ".concat(keys.length, " records, processing now."));
                p = [];
                numWritten = 0;
                _loop_1 = function (key) {
                    var value, bcb, wcb;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, dirty.get(key)];
                            case 1:
                                value = _b.sent();
                                p.push(new Promise(function (resolve, reject) {
                                    bcb = function (err) { if (err != null)
                                        return reject(err); };
                                    wcb = function (err) {
                                        if (err != null)
                                            return reject(err);
                                        if (++numWritten % 100 === 0)
                                            console.log("Wrote record ".concat(numWritten, " of ").concat(length));
                                        resolve();
                                    };
                                }));
                                db.set(key, value, bcb, wcb);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, keys_1 = keys;
                _a.label = 4;
            case 4:
                if (!(_i < keys_1.length)) return [3 /*break*/, 7];
                key = keys_1[_i];
                return [5 /*yield**/, _loop_1(key)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, Promise.all(p)];
            case 8:
                _a.sent();
                console.log("Wrote all ".concat(numWritten, " records"));
                return [4 /*yield*/, db.close(null)];
            case 9:
                _a.sent();
                return [4 /*yield*/, dirty.close(null)];
            case 10:
                _a.sent();
                console.log('Finished.');
                node_process_1.default.exit(0);
                return [2 /*return*/];
        }
    });
}); })();
