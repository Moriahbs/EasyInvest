import {getInvestmentRecommendations} from "../controllers/smartSearchController";
import express from "express";

const router = express.Router();

router.post("/recommended", getInvestmentRecommendations);

export default router;