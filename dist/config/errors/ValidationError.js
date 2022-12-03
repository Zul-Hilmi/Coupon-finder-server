"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class LoginError extends CustomError_1.default {
    constructor(message, property) {
        super(message);
        this.property = property;
        this.name = "LoginError";
        this.code = 400;
        Object.setPrototypeOf(this, LoginError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message, property: this.property }];
    }
}
exports.default = LoginError;
