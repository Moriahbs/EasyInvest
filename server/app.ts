import express, { Express } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import startupsRoute from "./routes/startupsRoute";
import usersRoute from "./routes/usersRoute";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";
import cors from "cors";
import expressSession from "express-session";
import passport from "passport";
import googleRoute from "./routes/googleRoute";
import chatBotRoute from "./routes/smartSearchRoute";
import smartSearchRoute from "./routes/smartSearchRoute";
import topicsRoute from "./routes/topicsRoute";
import path from "path";

dotenv.config(); // Make sure this is called early

const promise: Promise<Express> = new Promise((resolve, reject) => {
  const app = express();

  // ✅ Define all allowed frontend origins
  const allowedOrigins = [
    'http://localhost:5173',
    'https://10.10.248.74',
    'https://easy-invest.cs.colman.ac.il',
  ];

  // ✅ Secure & flexible CORS setup
  const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };

  app.use(express.static(path.join(__dirname, "front")));
  app.use(cors(corsOptions));

  // ✅ Set up express-session (used only if necessary)
  const expressSessionOptions: any = {
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,           // ⚠️ set to true if HTTPS (on production!)
      sameSite: 'none',       // ✅ allow cross-site cookie
    },
  };
  app.use(expressSession(expressSessionOptions));

  // ✅ Required parsers & passport
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  // ✅ Your routes
  app.use("/auth", googleRoute);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/startups", startupsRoute);
  app.use("/users", usersRoute);
  app.use("/images", express.static("images"));
  app.use("/api/chatbot", chatBotRoute);
  app.use("/api/smartSearch", smartSearchRoute);
  app.use("/api/topics", topicsRoute);
  app.use("/assets", express.static("assets"));

  // ✅ Static file serving for frontend
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "front", "index.html"));
  });

  // ✅ MongoDB Connection
  mongoose
    .connect(process.env.DATABASE_URL as string, {})
    .then(() => {
      console.log("Connected to MongoDB");
      resolve(app);
    })
    .catch((error) => {
      console.error("Initial connection error", error);
      reject(error);
    });

  const db = mongoose.connection;
  db.on("error", (error) => console.error("MongoDB connection error:", error));
  db.once("open", () => console.log("MongoDB connection established"));
});

export default promise;
