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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validCoupon = exports.isTheOwner = exports.authorizeUser = exports.authenticate = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../api/models/userModel");
const mongoose_1 = require("mongoose");
const couponModel_1 = require("../api/models/couponModel");
const clientError_1 = __importDefault(require("../config/clientError"));
//create user session and store them in the cookie
const authenticate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.token)
        throw new clientError_1.default(403);
    const token = yield req.cookies.token;
    const session = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    req.session = session;
    next();
}));
exports.authenticate = authenticate;
//check if id of the page is the same as the user's session id 
const authorizeUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!(0, mongoose_1.isValidObjectId)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || !(0, mongoose_1.isValidObjectId)((_b = req.session) === null || _b === void 0 ? void 0 : _b.user._id))
        throw new clientError_1.default(403);
    const link = req.params.id;
    const id = req.session.user._id;
    if (link != id)
        throw new clientError_1.default(403);
    next();
}));
exports.authorizeUser = authorizeUser;
const isTheOwner = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    if (!(0, mongoose_1.isValidObjectId)((_c = req.params) === null || _c === void 0 ? void 0 : _c.id) || !(0, mongoose_1.isValidObjectId)((_d = req.session) === null || _d === void 0 ? void 0 : _d.user._id))
        throw new clientError_1.default(403);
    const couponId = req.params.id;
    const ownerId = req.session.user._id;
    yield couponModel_1.Coupon.findOne({ id: couponId, owner: ownerId }).orFail(() => { throw new clientError_1.default(403); });
    next();
}));
exports.isTheOwner = isTheOwner;
const validCoupon = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    if (!(0, mongoose_1.isValidObjectId)((_e = req.params) === null || _e === void 0 ? void 0 : _e.id) || !(0, mongoose_1.isValidObjectId)((_f = req.session) === null || _f === void 0 ? void 0 : _f.user._id))
        throw new clientError_1.default(403);
    const couponId = req.params.id;
    const ownerId = req.session.user._id;
    const owner = yield userModel_1.User.findById(ownerId);
    if (!owner) {
        yield couponModel_1.Coupon.deleteMany({ owner: ownerId });
        throw new clientError_1.default(404, "Coupon doesn't exist");
    }
    const coupon = yield couponModel_1.Coupon.findOne({ _id: couponId })
        .orFail(() => { throw new clientError_1.default(404, "Coupon doesn't exist 7"); });
    next();
}));
exports.validCoupon = validCoupon;
