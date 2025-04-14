export interface Startup {
    _id: string;
    name: string;
    tags: string[];
    description: string;
    fundingStage: string;
    location: string;
    latitude: number;
    longitude: number;
    foundedYear: number;
    valuationLastRound: number;
    image?: string;
}

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