"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.verifyRefreshToken = exports.verifyAccessToken = exports.getAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessTokenOptions = {
    expiresIn: "15m",
    algorithm: "HS256",
};
const refreshTokenOptions = {
    expiresIn: "7d",
    algorithm: "HS256",
};
const generateAccessToken = (user) => {
    if (!process.env.JWT_SECRET)
        throw new Error("JWT_SECRET is not defined in environment variables");
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, accessTokenOptions);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    if (!process.env.JWT_REFRESH_SECRET)
        throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    return jsonwebtoken_1.default.sign(user, process.env.JWT_REFRESH_SECRET, refreshTokenOptions);
};
exports.generateRefreshToken = generateRefreshToken;
const getAccessToken = (req) => {
    if (req.cookies) {
        const authHeader = req.cookies["Authorization"];
        if (authHeader) {
            return decodeURIComponent(authHeader.replace("Bearer%20", "")).split(" ")[1];
        }
    }
};
exports.getAccessToken = getAccessToken;
const verifyAccessToken = (token) => {
    try {
        if (!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET is missing");
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        if (!process.env.JWT_REFRESH_SECRET)
            throw new Error("JWT_REFRESH_SECRET is missing");
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const auth = (req, res) => {
    try {
        const authHeader = req.cookies?.Authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Unauthorized" });
            return false;
        }
        let token = authHeader.replace("Bearer ", "");
        let decoded = (0, exports.verifyAccessToken)(token);
        if (!decoded) {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ error: "Unauthorized" });
                return false;
            }
            const refreshDecoded = (0, exports.verifyRefreshToken)(refreshToken);
            if (!refreshDecoded) {
                res.status(403).json({ error: "Invalid refresh token" });
                return false;
            }
            const newAccessToken = (0, exports.generateAccessToken)({
                userId: refreshDecoded.userId,
            });
            res.cookie("Authorization", `Bearer ${newAccessToken}`, {
                httpOnly: true,
                secure: true,
                domain: ".cs.colman.ac.il",
            });
            decoded = refreshDecoded;
        }
        req.user = decoded;
        console.log("User is authenticated");
        return true;
    }
    catch (error) {
        console.error("Error authenticating user:", error);
        return false;
    }
};
exports.auth = auth;
