"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const startupsRoute_1 = __importDefault(require("./routes/startupsRoute"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerConfig_1 = __importDefault(require("./swaggerConfig"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const googleRoute_1 = __importDefault(require("./routes/googleRoute"));
const smartSearchRoute_1 = __importDefault(require("./routes/smartSearchRoute"));
const smartSearchRoute_2 = __importDefault(require("./routes/smartSearchRoute"));
const topicsRoute_1 = __importDefault(require("./routes/topicsRoute"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config(); // Make sure this is called early
const promise = new Promise((resolve, reject) => {
    const app = (0, express_1.default)();
    // ✅ Define all allowed frontend origins
    const allowedOrigins = [
        'http://localhost:5173',
        'https://10.10.248.74',
        'https://easy-invest.cs.colman.ac.il',
    ];
    // ✅ Secure & flexible CORS setup
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    };
    app.use(express_1.default.static(path_1.default.join(__dirname, "front")));
    app.use((0, cors_1.default)(corsOptions));
    // ✅ Set up express-session (used only if necessary)
    const expressSessionOptions = {
        secret: process.env.SESSION_SECRET || "mysecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // only true in prod
            sameSite: 'none', // ✅ allow cross-site cookie
        },
    };
    app.use((0, express_session_1.default)(expressSessionOptions));
    // ✅ Required parsers & passport
    app.use(body_parser_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    // ✅ Your routes
    app.use("/auth", googleRoute_1.default);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
    app.use("/startups", startupsRoute_1.default);
    app.use("/users", usersRoute_1.default);
    app.use("/images", express_1.default.static("images"));
    app.use("/api/chatbot", smartSearchRoute_1.default);
    app.use("/api/smartSearch", smartSearchRoute_2.default);
    app.use("/api/topics", topicsRoute_1.default);
    app.use("/assets", express_1.default.static("assets"));
    // ✅ Static file serving for frontend
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "front", "index.html"));
    });
    // ✅ MongoDB Connection
    mongoose_1.default
        .connect(process.env.DATABASE_URL, {})
        .then(() => {
        console.log("Connected to MongoDB");
        resolve(app);
    })
        .catch((error) => {
        console.error("Initial connection error", error);
        reject(error);
    });
    const db = mongoose_1.default.connection;
    db.on("error", (error) => console.error("MongoDB connection error:", error));
    db.once("open", () => console.log("MongoDB connection established"));
});
exports.default = promise;
