import appPromise from "./app";
import { Express } from "express";
import http from "http";

const PORT = process.env.PORT || 3000;

appPromise.then((app: Express) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("development");
    http.createServer(app).listen(PORT);
  }
  app.get("/", (req, res) => {
    res.send("Easy Invest server running!! 🚀");
  });
});
