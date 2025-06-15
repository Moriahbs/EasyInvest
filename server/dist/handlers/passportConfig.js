"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const dbUtils_1 = require("../db/dbUtils");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://easy-invest.cs.colman.ac.il:${PORT}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let userId;
        const email = profile.emails?.[0]?.value;
        const username = email?.split("@")[0];
        const existingUser = await dbUtils_1.User.findOne({
            $or: [{ username }, { email }],
        });
        const user = {
            username,
            email,
        };
        if (!existingUser) {
            const newUser = new dbUtils_1.User(user);
            await newUser.save();
            userId = newUser._id.toString();
        }
        else {
            userId = existingUser._id.toString();
        }
        return done(null, { ...user, userId });
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
