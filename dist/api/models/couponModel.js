"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    //coupon can have the same discount title
    discount: {
        type: String,
        trim: true,
        minLength: [3, "Invalid discount given"],
        required: [true, "Discount is required"],
    },
    expiry: {
        type: String,
        trim: true,
        default: null,
    },
    code: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        minlength: [6, "Description can't be less than 6 characters "],
        default: "No description for this coupon"
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Coupon have to be owned by an owner"],
        ref: 'user'
    }
}, {
    timestamps: true
});
const Coupon = (0, mongoose_1.model)('Coupon', couponSchema);
exports.Coupon = Coupon;
