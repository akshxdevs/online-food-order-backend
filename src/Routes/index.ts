import express from "express";

import { foodRouter } from "./food";
import { userRouter } from "./user";
import { accountRouter } from "./account";

export const mainRouter = express.Router();

mainRouter.use("/user",userRouter)
mainRouter.use("/food",foodRouter)
mainRouter.use("/account",accountRouter)

