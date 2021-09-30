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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var express_1 = __importDefault(require("express"));
var photo_crawler_service_1 = require("./photo-crawler/photo-crawler.service");
var path_1 = __importDefault(require("path"));
var photoSource = process.env.SOURCE || "/home/pi/Pictures";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function scanImages() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, photo_crawler_service_1.getRandomizedPhotosFromFolder(photoSource)];
                        case 1:
                            availableImages = _a.sent();
                            return [2 /*return*/, availableImages];
                    }
                });
            });
        }
        function getNextImage() {
            var image = availableImages.shift();
            if (image !== undefined) {
                availableImages.push(image);
                return image;
            }
            return null;
        }
        var availableImages, app, server, socketServer, clientsCount;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    availableImages = [];
                    return [4 /*yield*/, scanImages()];
                case 1:
                    _a.sent();
                    app = express_1.default();
                    app.use(express_1.default.json());
                    app.use("/photos", express_1.default.static(photoSource));
                    app.get("/get-socket-io", function (req, res) {
                        res.redirect("/socket.io/socket.io.js");
                    });
                    app.get("/scan", function (_, res, next) { return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, scanImages()];
                                case 1:
                                    _a.sent();
                                    res.send(availableImages);
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    next(err_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/build")));
                    app.get("/*", function (req, res) {
                        res.sendFile(path_1.default.join(__dirname, "../../client/build", "index.html"));
                    });
                    server = http_1.default.createServer(app);
                    socketServer = socket_io_1.default(server);
                    clientsCount = 0;
                    setInterval(function () {
                        if (clientsCount) {
                            var nextImage = getNextImage();
                            console.log(nextImage);
                            socketServer.emit("nextImage", nextImage);
                        }
                    }, 15000);
                    socketServer.on("connect", function (socket) {
                        console.log("Client connected, #clients: " + ++clientsCount);
                        socket.on("disconnect", function () {
                            console.log("Client disconnected, #clients " + --clientsCount);
                        });
                    });
                    server.listen(48383, function () {
                        console.log("listening on " + JSON.stringify(server.address(), null, 2));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return console.log("running..."); }, console.error);
