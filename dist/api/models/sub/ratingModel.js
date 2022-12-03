"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        maxlength: [500, "Comments can't be more than 500"],
    },
    // reminder:{
    //     types:Boolean,
    // },
    like: {
        types: Boolean,
    },
    rateBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    coupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'coupon'
    }
}, {
    timestamps: true
});
const Rating = (0, mongoose_1.model)('Rating', ratingSchema);
exports.Rating = Rating;
