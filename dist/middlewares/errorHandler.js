"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const clientError_1 = __importDefault(require("../config/clientError"));
const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof mongoose_1.default.Error.ValidationError) { //native mongoose error
        res.status(400);
        let message = {};
        for (let property in err.errors)
            message[property] = err.errors[property].message;
        res.json(message);
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        res.status(400);
        let message = { message: `${err.value} is not valid for ${err.path} field` };
        res.json(message);
    }
    else if (err instanceof clientError_1.default) {
        res.status(err.code);
        res.json({ message: err.message });
    }
    else {
        res.status(500);
        res.json({ message: "An error has occured" });
    }
};
exports.default = errorHandler;
// let message ={[property]:err.errors[property].message}
// let message:SerializedError = {message:err.errors[property].message,property}
// messages.push(message) //array of message and property(SerializedError)
