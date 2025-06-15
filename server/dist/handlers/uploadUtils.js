"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = "images/";
        if (req.baseUrl.includes("users")) {
            uploadPath = "images/users/";
        }
        else if (req.baseUrl.includes("startups")) {
            uploadPath = "images/startups/";
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueFilename = (0, uuid_1.v4)() + path_1.default.extname(file.originalname);
        cb(null, uniqueFilename);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
