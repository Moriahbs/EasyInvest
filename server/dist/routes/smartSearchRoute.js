"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smartSearchController_1 = require("../controllers/smartSearchController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/recommended", smartSearchController_1.getInvestmentRecommendations);
router.post("/simplify", smartSearchController_1.simplifyDescription);
exports.default = router;
