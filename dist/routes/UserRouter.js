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
var express_1 = __importDefault(require("express"));
var UserModel_1 = require("./../models/UserModel");
var bcrypt_1 = __importDefault(require("bcrypt"));
var randomstring_1 = __importDefault(require("randomstring"));
var mail_1 = require("./../mail");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var UserRouter = express_1.default.Router();
UserRouter.post("/login", function (req, res) {
    UserModel_1.UserModel.find({ username: req.body.username }, function (err, users) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!err) return [3 /*break*/, 1];
                    res.status(500).json("CallbackError : " + err);
                    return [3 /*break*/, 6];
                case 1:
                    if (!users[0]) return [3 /*break*/, 5];
                    if (!users[0].status) return [3 /*break*/, 3];
                    return [4 /*yield*/, bcrypt_1.default.compare(req.body.password, users[0].password, function (err, result) {
                            if (err) {
                                res.status(401).json("Invalid password!");
                            }
                            else if (result) {
                                var token = jsonwebtoken_1.default.sign({
                                    username: users[0].username,
                                    firstname: users[0].firstname,
                                    lastname: users[0].lastname,
                                }, "key", { expiresIn: "1h" });
                                res.status(200).json({ token: token, user: users[0] });
                            }
                            else {
                                res.status(401).json("Invalid password!");
                            }
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    res.status(403).json("User Not Activated");
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    res.status(404).json("User Not Found");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
UserRouter.get("/verify/:username/:random", function (req, res) {
    UserModel_1.UserModel.find({ username: req.params.username }, function (err, users) {
        if (err) {
            res.json("Error when finding " + req.params.username + ": " + err);
        }
        else if (users[0]) {
            if (!users[0].status) {
                UserModel_1.tempRandomData.find({ username: req.params.username }, function (err, temp) {
                    if (err) {
                        res.json("Error when finding random data: " + err);
                    }
                    else if (temp) {
                        if (temp[0].random === req.params.random) {
                            users[0].status = true;
                            users[0].save(function (err) {
                                if (err) {
                                    res.json("error occured!");
                                }
                                else {
                                    UserModel_1.tempRandomData.deleteOne({ username: temp[0].username }, undefined, function (err) {
                                        if (!err) {
                                            res.json("Successfuly activated!");
                                        }
                                        else {
                                            res.json("error occured!");
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            res.json("Code missmatch!");
                        }
                    }
                    else {
                        res.json("nothing found");
                    }
                });
            }
            else {
                res.json("User already activated");
            }
        }
        else {
            res.json("cannot find user");
        }
    });
});
UserRouter.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, firstname, lastname, pwd, status, random;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                pwd = req.body.password;
                status = false;
                random = randomstring_1.default.generate();
                return [4 /*yield*/, bcrypt_1.default.hash(pwd, 10, function (err, password) {
                        if (!err) {
                            UserModel_1.UserModel.findOne({ username: username }, function (err, doc) {
                                if (doc) {
                                    res.status(403).json("Username already exists");
                                }
                                else {
                                    var newUser = new UserModel_1.UserModel({
                                        username: username,
                                        firstname: firstname,
                                        lastname: lastname,
                                        password: password,
                                        status: status,
                                    });
                                    var randomData_1 = new UserModel_1.tempRandomData({ username: username, random: random });
                                    newUser.save(function (err) {
                                        if (err) {
                                            res.status(403).json("Username already exists");
                                        }
                                        else {
                                            randomData_1.save(function (err) {
                                                if (err) {
                                                    res.status(500).json("Save Error");
                                                }
                                                else {
                                                    var url = "Click the confirmation url ===>  http://localhost:3000/confirm/" +
                                                        username +
                                                        "/" +
                                                        random;
                                                    var sm = mail_1.SendMail(username, url);
                                                    if (sm) {
                                                        res
                                                            .status(200)
                                                            .json("Verification Mail Sended to: " + username);
                                                    }
                                                    else {
                                                        res.status(500).json("Email Error");
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            res.status(500).json("Server Error");
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
UserRouter.post("/getsingle", function (req, res) {
    UserModel_1.UserModel.find({ username: req.body.username }, function (err, users) {
        if (err) {
            res.status(500).json("CallbackError : " + err);
        }
        else if (users[0]) {
            if (users[0].status) {
                res.status(200).json(users[0]);
            }
            else {
                res.status(500).json("User Not Activated");
            }
        }
        else {
            res.status(500).json("User Not Found");
        }
    });
});
UserRouter.post("/getrandom", function (req, res) {
    UserModel_1.UserModel.find({ username: req.body.username }, function (err, users) {
        if (err) {
            res.status(500).json("CallbackError : " + err);
        }
        else if (users[0]) {
            var random = randomstring_1.default.generate();
            if (users[0].status) {
                var url = "Confirmation string ===> " + random;
                var sm = mail_1.SendMail(req.body.username, url);
                if (sm) {
                    res.status(200).json({ random: random });
                }
                else {
                    res.status(500).json("Email Error");
                }
            }
            else {
                res.status(500).json("User Not Activated");
            }
        }
        else {
            res.status(500).json("User Not Found");
        }
    });
});
UserRouter.post("/setpassword", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt_1.default.hash(req.body.password, 10, function (err, password) {
                    if (!err) {
                        UserModel_1.UserModel.find({ username: req.body.username }, function (err, doc) {
                            if (err) {
                                res.status(500).json("err");
                            }
                            else {
                                doc[0].password = password;
                                doc[0].save(function (err) {
                                    if (err) {
                                        res.status(500).json("error occured");
                                    }
                                    else {
                                        res.status(200).json("success!");
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.status(500).json("error occured");
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.default = UserRouter;
