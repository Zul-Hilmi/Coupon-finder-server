"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.route("/")
    .get(auth_1.authenticate, couponController_1.list); //owner and shopper 
router.route("/create")
    .post(auth_1.authenticate, couponController_1.create); //only owner $done
router.route("/scrape")
    .get(auth_1.authenticate, couponController_1.scrape);
router.route("/:id")
    .post(auth_1.authenticate, auth_1.validCoupon, couponController_1.rate) //shopper $done
    .get(auth_1.authenticate, auth_1.validCoupon, couponController_1.detail) //owner and shopper $done
    .put(auth_1.authenticate, auth_1.validCoupon, auth_1.isTheOwner, couponController_1.update) //only owner $done
    .delete(auth_1.authenticate, auth_1.validCoupon, auth_1.isTheOwner, couponController_1.remove); //only owner $done
exports.default = router;
