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
exports.foodRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("../db");
exports.foodRouter = express_1.default.Router();
const foodBody = zod_1.z.object({
    foodName: zod_1.z.string(),
    foodPrice: zod_1.z.number(),
    foodImg: zod_1.z.string(),
    isStockAvailable: zod_1.z.boolean().default(true),
});
exports.foodRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllFood = yield db_1.Food.find();
        res.json(getAllFood);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
//@ts-ignore
exports.foodRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = foodBody.safeParse(req.body);
        if (!result.success) {
            console.log("Incorrect data:", result.error);
            return res.status(400).json({
                message: "Incorrect input!",
                errors: result.error.errors,
            });
        }
        const { foodName, foodPrice, foodImg, isStockAvailable } = result.data;
        const food = yield db_1.Food.create({
            foodName,
            foodPrice,
            foodImg,
            isStockAvailable,
        });
        res.status(201).json({
            message: "Food Added Successfully",
            food,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
