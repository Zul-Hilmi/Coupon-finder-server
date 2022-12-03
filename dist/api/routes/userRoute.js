"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.route("/")
    .get((req, res) => { res.send("h"); });
router.route("/register")
    .post(userController_1.email);
router.route("/login")
    .post(userController_1.login);
router.route("/logout")
    .get(userController_1.logout);
router.route("/create")
    .get(userController_1.create);
router.route("/:id")
    .get(auth_1.authenticate, auth_1.authorizeUser, userController_1.detail)
    .put(auth_1.authenticate, auth_1.authorizeUser, userController_1.update)
    .delete(auth_1.authenticate, auth_1.authorizeUser, userController_1.remove, userController_1.logout);
exports.default = router;
