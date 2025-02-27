"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const Routes_1 = require("./Routes");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/m3", Routes_1.mainRouter);
const port = 3000;
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
