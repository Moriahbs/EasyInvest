"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../handlers/passportConfig"); // Make sure this initializes the strategy
const authUtils_1 = require("../handlers/authUtils");
const router = express_1.default.Router();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    const { userId } = req.user;
    const accessToken = (0, authUtils_1.generateAccessToken)({ userId });
    const refreshToken = (0, authUtils_1.generateRefreshToken)({ userId });
    res.cookie("refreshToken", refreshToken);
    res.cookie("Authorization", `Bearer ${accessToken}`);
    res.redirect("https://easy-invest.cs.colman.ac.il");
});
exports.default = router;
