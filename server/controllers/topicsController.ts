import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "express-async-handler";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

export const getTopicExplanation = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  try {
    const aiPrompt = `
        Explain in very simple language this prompt - it should be related to startup/invest/tech:
        "${prompt}"
    `;

    const result = await model.generateContent(aiPrompt);
    const aiResponse = result.response.text();

    res.status(200).json({
      aiResponse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});
