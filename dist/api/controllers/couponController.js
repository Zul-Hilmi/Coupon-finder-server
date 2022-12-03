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
const scrape_1 = require("../../config/services/scrape");
const puppeteer_1 = __importDefault(require("puppeteer"));
const request_1 = __importDefault(require("request"));
const userModel_1 = require("../models/userModel");
const clientError_1 = __importDefault(require("../../config/clientError"));
const create = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.user.role) == "shopper")
        throw new clientError_1.default(403);
    const coupon = req.body;
    coupon.owner = req.session.user._id;
    yield new couponModel_1.Coupon(coupon).save();
    res.status(200).json({ message: "Successfully created" });
}));
exports.create = create;
const list = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Filter search based on:
    //alphabet:owner
    //alphabet:discount(name)
    //before,after,range:expiry date
    //likes and dislikes:ratings
    //number:comments
    var _b;
    //Owner could only see their coupon
    //-owner have FIXED filter where the coupon's onwner is owner's id
    //Shopper can see all coupon
    let coupons;
    if (((_b = req.session) === null || _b === void 0 ? void 0 : _b.user.role.toLowerCase()) === "owner") {
        coupons = yield couponModel_1.Coupon.find({ owner: req.session.user._id });
    }
    else {
        coupons = yield couponModel_1.Coupon.find().populate('owner', 'name');
    }
    res.status(200).json({ messsage: coupons });
}));
exports.list = list;
const detail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const coupon = yield couponModel_1.Coupon.findById((_c = req.params) === null || _c === void 0 ? void 0 : _c.id)
        .orFail(() => { throw new clientError_1.default(404, "Coupon doesn't exist"); });
    const ratings = yield ratingModel_1.Rating.find({ coupon: coupon._id });
    res.status(200).json({ messsage: { coupon, ratings } });
}));
exports.detail = detail;
const update = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield couponModel_1.Coupon.findOne({
        id: req.params.id,
        owner: req.session.user._id
    }).orFail(() => { throw new clientError_1.default(403); });
    const { discount, expiry, code, description } = req.body;
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
// rating
const rate = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    if (((_d = req.session) === null || _d === void 0 ? void 0 : _d.user.role) != "shopper")
        throw new clientError_1.default(403);
    const { comment, reminder, like } = req.body;
    if (!like && comment.trim().length < 1 && reminder)
        throw new clientError_1.default(400, "Comment cannot be empty");
    const coupon = yield couponModel_1.Coupon.findById((_e = req.params) === null || _e === void 0 ? void 0 : _e.id).orFail(() => { throw new clientError_1.default(404, "Coupon doesn't exist"); });
    const rating = new ratingModel_1.Rating({ comment, reminder, like, user: req.session.user._id, coupon: coupon._id });
    yield rating.save();
    res.status(200).json({ message: "Rating Submitted" });
}));
exports.rate = rate;
// const listRating = asyncHandler(async(req:getSessionRequest,res:Response)=>{
//     if(req.session?.user.role != "shopper")  throw new ClientError(403)
//     const ratings = await Rating.find({user:req.session!.user._id})
//     res.json({message:ratings})
// })
// const deleteRating = asyncHandler(async(req:getSessionRequest,res:Response)=>{
//     if(req.session?.user.role != "shopper")  throw new ClientError(403)
//     const ratings = await Rating.deleteOne({user:req.session!.user._id})
//     res.json({message:ratings})
// })
//admin scrape
const scrape = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user.role.toLowerCase() != "admin")
        throw new clientError_1.default(403);
    const adminId = req.session.user._id;
    const shopName = req.body.shopName;
    if (!shopName)
        throw new clientError_1.default(400, "Shop name is not given");
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto(`https://www.hargapedia.com.my/vouchers/store/${shopName}`, { timeout: 0 });
    let insertData = []; //insert the requested data in this array
    //scrape the element use for sending request
    const discounts = yield page.$$eval(".styles_colMid__3FOth h4", (e) => { return e.map(x => x.textContent); });
    for (const discount of discounts) {
        (0, request_1.default)((0, scrape_1.getOption)(discount), (error, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (!error && response) {
                let result = JSON.parse(response.body);
                let expiry = (0, scrape_1.formatDate)(result.data.getExternalVoucherBySlug.expiry);
                let description = (0, scrape_1.formatDescription)(result.data.getExternalVoucherBySlug.description);
                let code = result.data.getExternalVoucherBySlug.code;
                let coupon = new couponModel_1.Coupon({ discount, expiry, code, description, owner: adminId });
                let link = result.data.getExternalVoucherBySlug.outbound_url;
                const existingShop = yield userModel_1.User.find({ name: new RegExp(shopName, "i") });
                yield coupon.save();
                insertData.push(coupon);
            }
        }));
    }
    yield browser.close();
    res.status(200).json({ message: "Done scraping" });
}));
exports.scrape = scrape;
