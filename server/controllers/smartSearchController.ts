import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "express-async-handler";
import { IStartup } from "../models/models";
import { Startup } from "../db/dbUtils";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
export const STARTUP_CATEGORIES: string[] = [
    "טכנולוגיה ירוקה",
    "אנרגיה מתחדשת",
    "קיימות",
    "בינה מלאכותית",
    "ביג דאטה",
    "טכנולוגיית בריאות",
    "מכשירים לבישים",
    "ניתוח נתונים",
    "טלמדיסין",
    "אפליקציה סלולרית",
    "טכנולוגיית חינוך",
    "מציאות מדומה",
    "למידה מקוונת",
    "גיימיפיקציה",
    "אבטחת סייבר",
    "פרטיות",
    "ענן",
    "פתרונות לארגונים",
    "בלוקצ'יין",
    "טכנולוגיית מזון",
    "שרשרת אספקה",
    "אוטומציה",
];

export const FUNDING_STAGES: string[] = [
    "פרה-סיד",
    "סיד",
    "סבב גיוס ראשון",
    "סבב גיוס שני",
    "סבב גיוס שלישי",
    "סבב גיוס רביעי",
    "מאוחר יותר",
    "גשר",
    "IPO",
];

export const getInvestmentRecommendations = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    try {
        const aiPrompt = `
     המשתמש רוצה להשקיע בסטארטאפים טכנולוגיים אך לא מבין בעולם הטכנולוגיה.
בהתבסס על ההעדפה שלו:
"${prompt}",
חלץ את הפרטים הבאים:

תגיות טכנולוגיה רלוונטיות מתוך הרשימה:
${JSON.stringify(STARTUP_CATEGORIES)}

שלבי מימון מועדפים מתוך הרשימה:
${JSON.stringify(FUNDING_STAGES)}
(אם צוינו, אחרת החזר מערך ריק)

שנת הקמה מינימלית
(לדוגמה, "אחרי 2020" משמעו >= 2021, אם לא צוינה החזר null)

שנת הקמה מקסימלית
(לדוגמה, "לפני 2022" משמעו <= 2021, אם לא צוינה החזר null)

שווי מינימלי במיליוני דולרים
(לדוגמה, "יותר מ-10 מיליון" משמעו >= 10, אם לא צוין החזר null)

שווי מקסימלי במיליוני דולרים
(לדוגמה, "פחות מ-50 מיליון" משמעו <= 50, אם לא צוין החזר null)

החזר את התוצאה כאובייקט JSON בפורמט הבא:
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
        console.log({ result });

        const aiResponse = result.response.text();
        console.log({ aiResponse });

        const preferences = extractPreferencesFromResponse(aiResponse);

        // Filter and score startups
        const startups = await Startup.find()
        console.log({ startups });

        const scoredStartups = scoreStartups(startups, preferences); //TODO: use the real startups
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
            tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t: string) => STARTUP_CATEGORIES.includes(t)) : [],
            fundingStages: Array.isArray(parsed.fundingStages)
                ? parsed.fundingStages.filter((f: string) => FUNDING_STAGES.includes(f))
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

function scoreStartups(startups: any[], preferences: any) {
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

        const prompt = `פשט את תיאור הפרויקט הזה עבור קהל כללי באותה שפה. התעכב על נושאים מורכבים ונסה להסבירם בצורה פשוטה וברורה. אל תוסיף מידע על החברה שאינו מופיע בטקסט:\n\n` +
        `${userText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const simplified = response.text();

        res.status(200).json({ simplified });
    } catch (error) {
        console.error("Error simplifying description:", error);
        res.status(500).json({ error: "Failed to simplify description" });
    }
});
