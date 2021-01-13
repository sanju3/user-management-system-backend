"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempRandomData = exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
exports.UserModel = mongoose_1.default.model("User", userSchema);
exports.tempRandomData = mongoose_1.default.model("Authenticate", new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    random: {
        type: String,
    },
}));
