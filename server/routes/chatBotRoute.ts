import {getInvestmentRecommendations} from "../controllers/chatBotController";
import express from "express";

const router = express.Router();

router.post("/recommended", getInvestmentRecommendations);

export default router;