import {getInvestmentRecommendations, simplifyDescription} from "../controllers/smartSearchController";
import express from "express";

const router = express.Router();

router.post("/recommended", getInvestmentRecommendations);
router.post("/simplify", simplifyDescription);

export default router;