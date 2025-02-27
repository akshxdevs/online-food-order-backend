"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: No token provided or invalid format" });
    }
    const token = authHeader.split(' ')[1];
    console.log(authHeader);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET);
        console.log(decoded);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
            return res.status(403).json({ message: "Forbidden: Invalid token structure" });
        }
    }
    catch (error) {
        return res.status(403).json({ message: "Forbidden: Token verification failed", error: error.message });
    }
};
exports.authenticateJWT = authenticateJWT;
