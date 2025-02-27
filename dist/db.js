"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Account = exports.Food = exports.Wallet = exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.db = mongoose_1.default.connect("mongodb+srv://aksh:yxVjO8sfkwWzsWws@atlascluster.zjyi9.mongodb.net/", { dbName: "food-order-app" }).then(() => {
    console.log("Connected to db...");
}).catch((err) => {
    console.error("Error Occured", err);
});
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 30,
        minlength: 8
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    firstName: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        maxlength: 30
    },
    lastName: {
        type: String,
        require: true,
        trim: true,
        maxlength: 25
    }
});
const AccountSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});
const WalletSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pin: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    }
});
const FoodSchema = new mongoose_1.default.Schema({
    foodName: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        maxlength: 30
    },
    foodImg: {
        type: String,
        require: true,
    },
    foodPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    isStockAvailable: {
        type: Boolean,
        default: true
    },
});
exports.Wallet = mongoose_1.default.model("Wallet", WalletSchema);
exports.Food = mongoose_1.default.model("Food", FoodSchema);
exports.Account = mongoose_1.default.model("Account", AccountSchema);
exports.User = mongoose_1.default.model("User", UserSchema);
