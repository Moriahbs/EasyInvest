import express from "express";
import { getTopicExplanation } from "../controllers/topicsController";

const router = express.Router();

router.post("/", getTopicExplanation);

export default router;