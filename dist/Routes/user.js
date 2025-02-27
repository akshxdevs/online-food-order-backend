"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("../db");
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = require("../middleware");
exports.userRouter = express_1.default.Router();
const signupBody = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
//@ts-ignore
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = signupBody.safeParse(req.body);
        if (!result.success) {
            return res.status(411).json({
                message: "Email already taken | Incorrect input!",
            });
        }
        const existingUser = yield db_1.User.findOne({
            username: req.body.username,
        });
        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken | Incorrect input!",
            });
        }
        const user = yield db_1.User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });
        const userId = user._id;
        const account = yield db_1.Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });
        const userAccountInfo = account.balance;
        const token = jwt.sign({ userId }, config_1.SECRET);
        res.json({
            userId: userId,
            message: "Account Created Successfully",
            userAccountInfo,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
const signinBody = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string()
});
//@ts-ignore
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signinBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            });
        }
        const user = yield db_1.User.findOne({
            username: req.body.username,
            password: req.body.password
        });
        const userId = user === null || user === void 0 ? void 0 : user._id;
        const account = yield db_1.Account.findOne({
            userId
        });
        const userAccountInfo = account === null || account === void 0 ? void 0 : account.balance;
        if (user) {
            const token = jwt.sign({
                userId: user._id
            }, config_1.SECRET);
            const userId = user._id;
            return res.json({
                token,
                userId: userId,
                userAccountInfo: userAccountInfo
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
const updateBody = zod_1.z.object({
    password: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
});
//@ts-ignore
exports.userRouter.put("/", middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }
    yield db_1.User.updateOne(req.body, {
        id: req.userId
    });
    res.json({
        message: "Updated successfully"
    });
}));
exports.userRouter.post("/wallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.Wallet.create({
        userId: req.body.userId,
        pin: req.body.pin
    });
    res.json({
        messsage: "Pin Created Successfully",
    });
}));
//@ts-ignore
exports.userRouter.post("/wallet/pin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, pin } = req.body;
    if (!userId || !pin) {
        return res.status(400).json({ error: "userId and pin are required" });
    }
    try {
        const verify = yield db_1.Wallet.findOne({ userId, pin });
        if (verify) {
            res.json({
                message: "Pin entered correctly.",
            });
        }
        else {
            res.status(403).json({ error: "Pin is incorrect or not created yet." });
        }
    }
    catch (error) {
        console.error("Error verifying pin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
