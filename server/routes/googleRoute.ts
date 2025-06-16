import express from "express";
import passport from "passport";
import "../handlers/passportConfig"; // Make sure this initializes the strategy
import {
  generateAccessToken,
  generateRefreshToken,
} from "../handlers/authUtils";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const { userId } = req.user as any;

    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId });

    res.cookie("refreshToken", refreshToken);
    res.cookie("Authorization", `Bearer ${accessToken}`);


    res.redirect("https://easy-invest.cs.colman.ac.il");
  }
);

export default router;