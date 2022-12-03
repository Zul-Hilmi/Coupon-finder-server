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
exports.scrape = exports.rate = exports.remove = exports.update = exports.detail = exports.list = exports.create = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const couponModel_1 = require("../models/couponModel");
const ratingModel_1 = require("../models/ratingModel");
const clientError_1 = __importDefault(require("../../config/ClientError"));
const create = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rating = req.body;
    if (!rating.like && rating.comment.trim().length < 1)
        throw new clientError_1.default(400, "Comment cannot be empty");
    rating.user = req.session.user._id;
    yield new ratingModel_1.Rating(rating).save();
    res.status(200).json({ message: "Rating submitted" });
}));
exports.create = create;
const list = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rating = yield ratingModel_1.Rating.find({ user: (_a = req.session) === null || _a === void 0 ? void 0 : _a.user._id }).populate('coupon', 'discount')
        .orFail(() => { throw new clientError_1.default(404, "No rating found"); });
    res.send({ message: rating });
}));
exports.list = list;
const detail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const rating = yield ratingModel_1.Rating.findById((_b = req.params) === null || _b === void 0 ? void 0 : _b.id).populate('owner')
        .orFail(() => { throw new clientError_1.default(404, "Rating doesn't exist"); });
    res.status(200).json({ messsage: rating });
}));
exports.detail = detail;
const update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rating = yield ratingModel_1.Rating.findOne({
        id: req.params.id,
        user: req.session.user._id
    }).orFail(() => { throw new clientError_1.default(403, "Coupon doesn't exist"); });
    const { comment, like } = req.body;
    coupon.discount = discount;
    coupon.expiry = expiry;
    coupon.code = code;
    coupon.description = description;
    coupon.save();
    res.status(200).json({ message: "Updated succesfully" });
}));
exports.update = update;
const remove = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield couponModel_1.Coupon.deleteOne({
        id: req.params.id,
        owner: req.session.user._id
    }).orFail(() => { throw new clientError_1.default(403); });
    const ratings = yield ratingModel_1.Rating.deleteMany({ coupon: req.params.id });
    res.status(200).json({ message: "Coupon deleted successfully" });
}));
exports.remove = remove;
