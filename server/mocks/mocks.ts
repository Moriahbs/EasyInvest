export interface Startup {
    companyName: string;
    tags: string[];
    description: string;
    fundingStage: string;
    location: string;
    foundedYear: number;
    valuationLastRound: number;
}

export const STARTUP_MOCK_DATA: Startup[] = [
    {
        "companyName": "GreenTech Innovations",
        "tags": ["cleantech", "renewable-energy", "sustainability", "AI", "big-data"],
        "description": "Using AI and big data to optimize renewable energy solutions for urban areas.",
        "fundingStage": "Series A",
        "location": "San Francisco, CA",
        "foundedYear": 2020,
        "valuationLastRound": 25
    },
    {
        "companyName": "HealthSync",
        "tags": ["healthtech", "wearables", "data-analytics", "telemedicine", "mobile-app"],
        "description": "Wearable devices syncing with telemedicine platforms for real-time health monitoring.",
        "fundingStage": "Seed",
        "location": "Boston, MA",
        "foundedYear": 2021,
        "valuationLastRound": 8
    },
    {
        "companyName": "EduVerse",
        "tags": ["edtech", "virtual-reality", "e-learning", "gamification", "mobile-app"],
        "description": "An immersive VR platform for interactive and gamified education experiences.",
        "fundingStage": "Series B",
        "location": "London, UK",
        "foundedYear": 2019,
        "valuationLastRound": 60
    },
    {
        "companyName": "SecureNest",
        "tags": ["cybersecurity", "privacy", "cloud", "enterprise", "blockchain"],
        "description": "Enterprise-grade cloud security solutions with blockchain-enhanced data privacy.",
        "fundingStage": "Series A",
        "location": "Tel Aviv, Israel",
        "foundedYear": 2020,
        "valuationLastRound": 30
    },
    {
        "companyName": "FoodChain AI",
        "tags": ["foodtech", "AI", "supply-chain", "sustainability", "automation"],
        "description": "AI-driven solutions to streamline food supply chains and reduce waste.",
        "fundingStage": "Pre-Seed",
        "location": "Austin, TX",
        "foundedYear": 2022,
        "valuationLastRound": 5
    },
    {
        "companyName": "DriveSmart",
        "tags": ["autotech", "electric-vehicles", "IoT", "smart-cities", "data-analytics"],
        "description": "IoT solutions for electric vehicles integrated with smart city infrastructure.",
        "fundingStage": "Series A",
        "location": "Munich, Germany",
        "foundedYear": 2021,
        "valuationLastRound": 22
    },
    {
        "companyName": "FinFlow",
        "tags": ["fintech", "blockchain", "payments", "decentralized", "mobile-app"],
        "description": "A decentralized payment platform leveraging blockchain for secure transactions.",
        "fundingStage": "Seed",
        "location": "Singapore",
        "foundedYear": 2020,
        "valuationLastRound": 15
    },
    {
        "companyName": "SpaceXplor",
        "tags": ["spacetech", "satellites", "AI", "exploration", "big-data"],
        "description": "AI-driven satellites for low-cost space exploration and data collection.",
        "fundingStage": "Series B",
        "location": "Cape Canaveral, FL",
        "foundedYear": 2018,
        "valuationLastRound": 75
    },
    {
        "companyName": "MindWell",
        "tags": ["mental-health", "AI", "wellness", "mobile-app", "data-analytics"],
        "description": "A mobile app using AI to provide personalized mental health support.",
        "fundingStage": "Seed",
        "location": "Toronto, Canada",
        "foundedYear": 2021,
        "valuationLastRound": 12
    },
    {
        "companyName": "AgriBotics",
        "tags": ["agritech", "robotics", "sustainability", "automation", "IoT"],
        "description": "Robotics and IoT solutions for sustainable farming and automated crop management.",
        "fundingStage": "Series A",
        "location": "Amsterdam, Netherlands",
        "foundedYear": 2019,
        "valuationLastRound": 28
    }
]