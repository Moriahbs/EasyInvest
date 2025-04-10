export interface Startup {
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
export const STARTUP_MOCK_DATA: Startup[] = [
    {
        companyName: "GreenTech Innovations",
        tags: ["טכנולוגיה ירוקה", "אנרגיה מתחדשת", "קיימות", "בינה מלאכותית", "ביג דאטה"],
        description: "משתמשים בבינה מלאכותית ובביג דאטה כדי לייעל פתרונות אנרגיה מתחדשת באזורים עירוניים.",
        fundingStage: "סבב A",
        location: "תל אביב, ישראל",
        latitude: 32.0853,
        longitude: 34.7818,
        foundedYear: 2020,
        valuationLastRound: 87500000,
    },
    {
        companyName: "HealthSync",
        tags: ["טכנולוגיית בריאות", "מכשירים לבישים", "ניתוח נתונים", "טלמדיסין", "אפליקציה סלולרית"],
        description: "מכשירים לבישים שמתחברים לפלטפורמות טלמדיסין לניטור בריאות בזמן אמת.",
        fundingStage: "סיד",
        location: "תל אביב, ישראל",
        latitude: 32.0865,
        longitude: 34.7822,
        foundedYear: 2021,
        valuationLastRound: 28000000,
    },
    {
        companyName: "EduVerse",
        tags: ["טכנולוגיית חינוך", "מציאות מדומה", "למידה מקוונת", "גיימיפיקציה", "אפליקציה סלולרית"],
        description: "פלטפורמת מציאות מדומה סוחפת לחוויות חינוכיות אינטראקטיביות ומשחקיות.",
        fundingStage: "סבב B",
        location: "תל אביב, ישראל",
        latitude: 32.0840,
        longitude: 34.7805,
        foundedYear: 2019,
        valuationLastRound: 210000000,
    },
    {
        companyName: "SecureNest",
        tags: ["אבטחת סייבר", "פרטיות", "ענן", "פתרונות לארגונים", "בלוקצ'יין"],
        description: "פתרונות אבטחת ענן ברמה ארגונית עם פרטיות נתונים משופרת באמצעות בלוקצ'יין.",
        fundingStage: "סבב A",
        location: "תל אביב, ישראל",
        latitude: 32.0853,
        longitude: 34.7818,
        foundedYear: 2020,
        valuationLastRound: 105000000,
    },
    {
        companyName: "FoodChain AI",
        tags: ["טכנולוגיית מזון", "בינה מלאכותית", "שרשרת אספקה", "קיימות", "אוטומציה"],
        description: "פתרונות מבוססי בינה מלאכותית לייעול שרשראות אספקת מזון ולהפחתת בזבוז.",
        fundingStage: "פרה-סיד",
        location: "תל אביב, ישראל",
        latitude: 32.0837,
        longitude: 34.7799,
        foundedYear: 2022,
        valuationLastRound: 17500000,
    },
];