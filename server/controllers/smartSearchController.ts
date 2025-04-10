import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "express-async-handler";
import { Startup, STARTUP_MOCK_DATA } from "../mocks/mocks";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const tagPool: string[] = [
    "AI", "machine-learning", "data-analytics", "blockchain", "cybersecurity",
    "cloud", "privacy", "fintech", "payments", "decentralized",
    "healthtech", "telemedicine", "wearables", "mental-health", "wellness",
    "edtech", "e-learning", "virtual-reality", "gamification", "spacetech",
    "satellites", "exploration", "cleantech", "renewable-energy", "sustainability",
    "foodtech", "supply-chain", "agritech", "robotics", "automation",
    "autotech", "electric-vehicles", "IoT", "smart-cities", "enterprise",
    "mobile-app", "big-data", "nanotech", "biotech", "3D-printing"
];

const fundingStagesPool: string[] = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C"];

export const getInvestmentRecommendations = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    try {
        const aiPrompt = `
      The user wants to invest in technology startups but doesn’t understand the tech world.
      Based on their preference: "${prompt}", extract the following:
      1. Relevant tech tags from this list: ${JSON.stringify(tagPool)}.
      2. Preferred funding stages from this list: ${JSON.stringify(fundingStagesPool)} (if mentioned, otherwise return empty array).
      3. Minimum founded year (e.g., "after 2020" means >= 2021, if not mentioned return null).
      4. Maximum founded year (e.g., "before 2022" means <= 2021, if not mentioned return null).
      5. Minimum valuation in millions USD (e.g., "more than 10 million" means >= 10, if not mentioned return null).
      6. Maximum valuation in millions USD (e.g., "less than 50 million" means <= 50, if not mentioned return null).
      Return the result as a JSON object like:
      {
        "tags": ["tag1", "tag2"],
        "fundingStages": ["stage1", "stage2"],
        "minFoundedYear": number | null,
        "maxFoundedYear": number | null,
        "minValuation": number | null,
        "maxValuation": number | null
      }
    `;

        const result = await model.generateContent(aiPrompt);
        const aiResponse = result.response.text();
        const preferences = extractPreferencesFromResponse(aiResponse);

        // Filter and score startups
        const scoredStartups = scoreStartups(STARTUP_MOCK_DATA, preferences);
        const filteredStartups = scoredStartups.filter((s) => s.score > 0);
        const topMatches = filteredStartups
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        res.status(200).json({
            preferences,
            startups: filteredStartups.map((s) => s.startup),
            topMatches: topMatches.map((s) => s.startup),
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate investment recommendations" });
    }
});

function extractPreferencesFromResponse(aiResponse: string) {
    try {
        const cleanedResponse = aiResponse.trim().replace(/```json|```/g, "");
        const parsed = JSON.parse(cleanedResponse);
        return {
            tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t: string) => tagPool.includes(t)) : [],
            fundingStages: Array.isArray(parsed.fundingStages)
                ? parsed.fundingStages.filter((f: string) => fundingStagesPool.includes(f))
                : [],
            minFoundedYear: typeof parsed.minFoundedYear === "number" ? parsed.minFoundedYear : null,
            maxFoundedYear: typeof parsed.maxFoundedYear === "number" ? parsed.maxFoundedYear : null,
            minValuation: typeof parsed.minValuation === "number" ? parsed.minValuation : null,
            maxValuation: typeof parsed.maxValuation === "number" ? parsed.maxValuation : null,
        };
    } catch (e) {
        console.warn("Failed to parse AI response, falling back to defaults:", e);
        return {
            tags: [],
            fundingStages: [],
            minFoundedYear: null,
            maxFoundedYear: null,
            minValuation: null,
            maxValuation: null,
        };
    }
}

function scoreStartups(startups: Startup[], preferences: any) {
    return startups.map((startup) => {
        let score = 0;

        const tagMatches = preferences.tags.filter((tag: string) => startup.tags.includes(tag)).length;
        score += tagMatches * 1;

        if (preferences.fundingStages.length > 0 && preferences.fundingStages.includes(startup.fundingStage)) {
            score += 2;
        }

        if (preferences.minFoundedYear && startup.foundedYear >= preferences.minFoundedYear) score += 1;
        if (preferences.maxFoundedYear && startup.foundedYear <= preferences.maxFoundedYear) score += 1;

        if (preferences.minValuation && startup.valuationLastRound >= preferences.minValuation) score += 1;
        if (preferences.maxValuation && startup.valuationLastRound <= preferences.maxValuation) score += 1;

        return { startup, score };
    });
}

export const simplifyDescription = asyncHandler(async (req, res) => {
    try {
      const { userText } = req.body;
  
      const prompt = `Simplify this project description for a general audience in the same language:\n\n${userText}`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const simplified = response.text();
  
      res.status(200).json({ simplified });
    } catch (error) {
      console.error("Error simplifying description:", error);
      res.status(500).json({ error: "Failed to simplify description" });
    }
  });
  