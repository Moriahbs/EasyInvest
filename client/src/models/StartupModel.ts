import { User } from "./userModel";

export interface Startup {
  _id: string;
  owner: User;
  name: string;
  tags: string[];
  description: string;
  fundingStage: string;
  location: string;
  latitude: number;
  longitude: number;
  foundedYear: number;
  valuationLastRound: number;
  contactEmail: string;
  contactPhone: string;
  founders: string;
  image?: string;
}

// רשימת קטגוריות קבועה לבחירה
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

// רשימת שלבי מימון קבועים לבחירה
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
