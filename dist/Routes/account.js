"use strict";
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
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../db");
exports.accountRouter = express_1.default.Router();
exports.accountRouter.post("/balance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const account = yield db_1.Account.findOne({ userId });
        if (account) {
            res.json({
                balance: account.balance,
            });
        }
        else {
            res.status(404).json({ error: "Account not found" });
        }
    }
    catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
//@ts-ignore
exports.accountRouter.post("/transfer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        const { amount, userId } = req.body;
        session.startTransaction();
        const account = yield db_1.Account.findOne({ userId }).session(session);
        if (!account || account.balance < amount) {
            yield session.abortTransaction();
            console.log("Insufficient balance!");
        }
        else {
            yield db_1.Account.updateOne({ userId: userId }, { $inc: { balance: -amount } }, { session });
            yield session.commitTransaction();
            return res.json({ message: "Transfer successful" });
        }
    }
    catch (error) {
        console.error("Error in transaction:", error);
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        return res.status(500).json({ error: "Internal server error" });
    }
    finally {
        session.endSession();
    }
}));
