"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authUtils_1 = require("./authUtils");
const authMiddleware = async (req, res, next) => {
    if (req.url === "/register" || req.url === "/login") {
        res.clearCookie("Authorization", {
            path: "/",
            httpOnly: true,
            secure: true,
        });
        return next();
    }
    if ((0, authUtils_1.auth)(req, res))
        return next();
};
exports.default = authMiddleware;
