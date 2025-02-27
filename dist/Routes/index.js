"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
const food_1 = require("./food");
const user_1 = require("./user");
const account_1 = require("./account");
exports.mainRouter = express_1.default.Router();
exports.mainRouter.use("/user", user_1.userRouter);
exports.mainRouter.use("/food", food_1.foodRouter);
exports.mainRouter.use("/account", account_1.accountRouter);
