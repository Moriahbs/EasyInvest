"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const PORT = parseInt(process.env.PORT || "3000", 10); // Make sure it's a number
const HOST = process.env.NODE_ENV === "production" ? "10.10.248.74" : "0.0.0.0";
app_1.default.then((app) => {
    if (process.env.NODE_ENV !== "production") {
        http_1.default.createServer(app).listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT} 🚀`);
        });
    }
    else {
        const prop = {
            key: fs_1.default.readFileSync('./myserver.key'),
            cert: fs_1.default.readFileSync('./CSB.crt')
        };
        https_1.default.createServer(prop, app).listen(PORT, HOST, () => {
            console.log(`Server running at production http://${HOST}:${PORT} 🚀`);
        });
    }
    app.get("/", (req, res) => {
        res.send("Backend server is running 🎉");
    });
});
