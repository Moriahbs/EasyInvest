export interface Startup {
    companyName: string;
    tags: string[];
    description: string;
    fundingStage: string;
    location: string;
    latitude: number;
    longitude: number;
    foundedYear: number;
    valuationLastRound: number;
}

export const STARTUP_MOCK_DATA: Startup[] = [
    {
        "companyName": "GreenTech Innovations",
        "tags": ["cleantech", "renewable-energy", "sustainability", "AI", "big-data"],
        "description": "Using AI and big data to optimize renewable energy solutions for urban areas.",
        "fundingStage": "Series A",
        "location": "Tel Aviv, Israel",
        "latitude": 32.0853,
        "longitude": 34.7818,
        "foundedYear": 2020,
        "valuationLastRound": 25
    },
    {
        "companyName": "HealthSync",
        "tags": ["healthtech", "wearables", "data-analytics", "telemedicine", "mobile-app"],
        "description": "Wearable devices syncing with telemedicine platforms for real-time health monitoring.",
        "fundingStage": "Seed",
        "location": "Tel Aviv, Israel",
        "latitude": 32.0865,
        "longitude": 34.7822,
        "foundedYear": 2021,
        "valuationLastRound": 8
    },
    {
        "companyName": "EduVerse",
        "tags": ["edtech", "virtual-reality", "e-learning", "gamification", "mobile-app"],
        "description": "An immersive VR platform for interactive and gamified education experiences.",
        "fundingStage": "Series B",
        "location": "Tel Aviv, Israel",
        "latitude": 32.0840,
        "longitude": 34.7805,
        "foundedYear": 2019,
        "valuationLastRound": 60
    },
    {
        "companyName": "SecureNest",
        "tags": ["cybersecurity", "privacy", "cloud", "enterprise", "blockchain"],
        "description": "Enterprise-grade cloud security solutions with blockchain-enhanced data privacy.",
        "fundingStage": "Series A",
        "location": "Tel Aviv, Israel",
        "latitude": 32.0853,
        "longitude": 34.7818,
        "foundedYear": 2020,
        "valuationLastRound": 30
    },
    {
        "companyName": "FoodChain AI",
        "tags": ["foodtech", "AI", "supply-chain", "sustainability", "automation"],
        "description": "AI-driven solutions to streamline food supply chains and reduce waste.",
        "fundingStage": "Pre-Seed",
        "location": "Tel Aviv, Israel",
        "latitude": 32.0837,
        "longitude": 34.7799,
        "foundedYear": 2022,
        "valuationLastRound": 5
    }
];