import express, { Request, Response } from "express";
import { z } from "zod";
import { Food } from "../db";

export const foodRouter = express.Router();

const foodBody = z.object({
    foodName: z.string(),
    foodPrice: z.number(), 
    foodImg: z.string(),
    isStockAvailable: z.boolean().default(true),
});

foodRouter.get("/", async (req: Request, res: Response) => {
    try {
        const getAllFood = await Food.find();
        res.json(getAllFood);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//@ts-ignore

foodRouter.post("/", async (req: Request, res: Response) => {
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
        const food = await Food.create({
            foodName,
            foodPrice,
            foodImg,
            isStockAvailable,
        });

        res.status(201).json({
            message: "Food Added Successfully",
            food,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
