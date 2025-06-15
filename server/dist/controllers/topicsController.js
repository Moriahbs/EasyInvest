"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicExplanation = void 0;
const generative_ai_1 = require("@google/generative-ai");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
exports.getTopicExplanation = (0, express_async_handler_1.default)(async (req, res) => {
    const { prompt } = req.body;
    try {
        const aiPrompt = `
        Explain in very simple language this prompt - it should be related to startup/invest/tech:
        "${prompt}"
    `;
        const result = await model.generateContent(aiPrompt);
        const aiResponse = result.response.text();
        res.status(200).json({
            aiResponse
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});
