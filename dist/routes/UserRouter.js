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
var services_1 = require("./../services");
var express_1 = __importDefault(require("express"));
var randomstring_1 = __importDefault(require("randomstring"));
var mail_1 = require("./../mail");
var services_2 = require("../services");
var UserRouter = express_1.default.Router();
UserRouter.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isMatch, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_2.getSingleUser(req.body.username)];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 2];
                res.status(404).json("User Not Found");
                return [3 /*break*/, 5];
            case 2:
                if (!!user.status) return [3 /*break*/, 3];
                res.status(403).json("User Not Activated");
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, services_2.compairPassword(req.body.password, user.password)];
            case 4:
                isMatch = _a.sent();
                if (!isMatch) {
                    res.status(401).json("Invalid password!");
                }
                else {
                    token = services_1.createToken({
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                    }, "key", { expiresIn: "1h" });
                    res.status(200).json({ token: token, user: user });
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
UserRouter.get("/verify/:username/:random", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userRandom, userStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_2.getSingleUser(req.params.username)];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 2];
                res.status(400).send({ message: "User Not Found: " + req.params.username });
                return [3 /*break*/, 9];
            case 2:
                if (!user.status) return [3 /*break*/, 3];
                res
                    .status(400)
                    .send({ message: "User Already Activated: " + req.params.username });
                return [3 /*break*/, 9];
            case 3: return [4 /*yield*/, services_1.getUserTemporyData(req.params.username)];
            case 4:
                userRandom = _a.sent();
                if (!!userRandom) return [3 /*break*/, 5];
                res
                    .status(400)
                    .send({ message: "User Not Found: " + req.params.username });
                return [3 /*break*/, 9];
            case 5:
                if (!(userRandom.random === req.params.random)) return [3 /*break*/, 9];
                user.status = true;
                return [4 /*yield*/, services_1.saveUser(user)];
            case 6:
                userStatus = _a.sent();
                if (!!userStatus) return [3 /*break*/, 7];
                res.status(400).send({ message: "Server Error, Try Again!" });
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, services_1.deleteTempData(user.username)];
            case 8:
                _a.sent();
                res.status(200).send({
                    message: "Successfully Activated: " + req.params.username,
                });
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
UserRouter.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, firstname, lastname, pwd, status, random, user, password, url, sm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                pwd = req.body.password;
                status = false;
                random = randomstring_1.default.generate();
                return [4 /*yield*/, services_2.getSingleUser(username)];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                res.status(403).json("Username already exists");
                return [3 /*break*/, 7];
            case 2: return [4 /*yield*/, services_1.hashPassword(pwd, 10)];
            case 3:
                password = _a.sent();
                return [4 /*yield*/, services_1.createUser({
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        status: status,
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, services_1.createTempRandom({ username: username, random: random })];
            case 5:
                _a.sent();
                url = "Click the confirmation url ===>  http://localhost:3000/confirm/" +
                    username +
                    "/" +
                    random;
                return [4 /*yield*/, mail_1.SendMail(username, url)];
            case 6:
                sm = _a.sent();
                if (sm) {
                    res.status(200).json("Verification Mail Sended to: " + username);
                }
                else {
                    res.status(500).json("Email Error");
                }
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
UserRouter.post("/getsingle", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_2.getSingleUser(req.body.username)];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(500).json("User Not Found");
                }
                else {
                    if (!user.status) {
                        res.status(500).json("User Not Activated");
                    }
                    else {
                        res.status(200).json(user);
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
UserRouter.post("/getrandom", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, random, url, sm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_2.getSingleUser(req.body.username)];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 2];
                res.status(500).json("User Not Found");
                return [3 /*break*/, 5];
            case 2:
                if (!!user.status) return [3 /*break*/, 3];
                res.status(500).json("User Not Activated");
                return [3 /*break*/, 5];
            case 3:
                random = randomstring_1.default.generate();
                url = "Confirmation string ===> " + random;
                return [4 /*yield*/, mail_1.SendMail(req.body.username, url)];
            case 4:
                sm = _a.sent();
                if (sm) {
                    res.status(200).json({ random: random });
                }
                else {
                    res.status(500).json("Email Error try again!");
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
UserRouter.post("/setpassword", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, password, success;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_2.getSingleUser(req.body.username)];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 2];
                res.status(500).json("User not found!");
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, services_1.hashPassword(req.body.password, 10)];
            case 3:
                password = _a.sent();
                user.password = password;
                success = services_1.saveUser(user);
                if (!success) {
                    res.status(500).json("mongoose error occured!");
                }
                else {
                    res.status(200).json("successfully changed the password!");
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = UserRouter;
