"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicExplanation = void 0;
const generative_ai_1 = require("@google/generative-ai");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
// simple delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.getTopicExplanation = (0, express_async_handler_1.default)(async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    const aiPrompt = `
    Explain in very simple language this prompt.
    Keep it related to startups, investing, or tech:
    "${prompt}"
  `;
    try {
        let attempts = 0;
        let result;
        while (attempts < 3) { // retry up to 3 times
            try {
                result = await model.generateContent(aiPrompt);
                break; // success, break loop
            }
            catch (err) {
                if (err.status === 429) {
                    attempts++;
                    const waitTime = (err.errorDetails?.[2]?.retryDelay || "60s").replace("s", "");
                    const ms = parseInt(waitTime, 10) * 1000 || 60000;
                    console.warn(`Rate limit hit. Retrying in ${ms / 1000}s...`);
                    await delay(ms);
                }
                else {
                    throw err;
                }
            }
        }
        if (!result) {
            return res.status(503).json({ error: "AI service unavailable. Try again later." });
        }
        const aiResponse = result.response.text();
        res.status(200).json({ aiResponse });
    }
    catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});
