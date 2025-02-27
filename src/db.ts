import mongoose from "mongoose";
export const db = mongoose.connect("mongodb+srv://aksh:yxVjO8sfkwWzsWws@atlascluster.zjyi9.mongodb.net/",{dbName:"food-order-app"}).then(()=>{
    console.log("Connected to db...");
}).catch((err)=>{console.error("Error Occured",err);
});

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        maxlength:30,
        minlength:8
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    firstName:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        maxlength:30
    },
    lastName:{
        type:String,
        require:true,
        trim:true,
        maxlength:25
    }
});

const AccountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    balance: {  
        type:Number,
        required:true
    }
});


const WalletSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    pin:{
        type:Number,
        required:true,
        min:0,
        max:9999
    }
});

const FoodSchema = new mongoose.Schema({
    foodName:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        maxlength:30
    },
    foodImg:{
        type:String,
        require:true,
    },
    foodPrice:{
        type:Number,
        required:true,
        trim:true,
    },
    isStockAvailable:{
        type:Boolean,
        default:true
    },
});
export const Wallet = mongoose.model("Wallet",WalletSchema)
export const Food = mongoose.model("Food",FoodSchema);
export const Account = mongoose.model("Account",AccountSchema);
export const User = mongoose.model("User",UserSchema);

