import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Account } from "../db";
export const accountRouter = express.Router();

accountRouter.post("/balance", async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
        const account = await Account.findOne({ userId });
        if (account) {
            res.json({
                balance: account.balance, 
            });
        } else {
            res.status(404).json({ error: "Account not found" });
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//@ts-ignore

accountRouter.post("/transfer", async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        const { amount, userId } = req.body;
        session.startTransaction();
        const account = await Account.findOne({ userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            console.log("Insufficient balance!");
        }else{           
            await Account.updateOne(
                { userId: userId },
                { $inc: { balance: -amount } },
                { session }
            );
            await session.commitTransaction();
            return res.json({ message: "Transfer successful" });
        }
    } catch (error) {
        console.error("Error in transaction:", error);
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        session.endSession();
    }
});
