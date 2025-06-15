import appPromise from "./app";
import { Express } from "express";
import http from "http";
import https from "https";
import fs from "fs";

const PORT = parseInt(process.env.PORT || "3000", 10); // Make sure it's a number
const HOST = process.env.NODE_ENV === "production" ? "10.10.248.74" : "0.0.0.0";

appPromise.then((app: Express) => {
  if (process.env.NODE_ENV !== "production") {
    http.createServer(app).listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT} 🚀`);
    });
  }
  else {
    const prop = {
      key: fs.readFileSync('./myserver.key'),
      cert: fs.readFileSync('./CSB.crt')
    }
    https.createServer(prop, app).listen(PORT, HOST, () => {
      console.log(`Server running at production http://${HOST}:${PORT} 🚀`);
    });
  }
  app.get("/", (req, res) => {
    res.send("Backend server is running 🎉");
  });
});
