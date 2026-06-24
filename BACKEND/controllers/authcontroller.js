import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../utils/email.js";
import Otp from "../models/OTP.js";
import jwt from "jsonwebtoken";


// REGISTER USER---------->
async function registerUser(req,res) {
    const {name,email,password } = req.body;

    let existUser = await User.findOne({email});
    if (existUser) {
        return res.status(400).json({message:"User already exist"});
    }

   if (name || email || password) {
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
    try {

        const user = await User.create({name,email,password:hashedPassword,role:"user",isVerified:false});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`otp for ${email} is ${otp}`);
        await Otp.create({email,otp,action:"account_Verification"});
        await sendOTPEmail(email,otp,"account_verification");
        res.status(201).json({message:"User created successfully and otp sent",user});


    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({message:"Something went wrong"});
    }
   }else{
    res.status(400).json({message:"All fields are required"});
   }
      
}




// LOGIN USER-------->

async function logInUser(req,res) {
    const {email,password} = req.body;
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found , please register first"});
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Incorrect password"});
    }

    if(!user.isVerified && user.role === "user"){
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.deleteMany({email , action:"account_Verification"});
        await Otp.create({email,otp,action:"account_Verification"});
        await sendOTPEmail(email,otp,"account_verification");
        console.log("otp sent",otp);
        return res.status(400).json({message:"Please verify your account",error:"new OTP sent to your email"});
    }
    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.status(200).json({message:"User logged in successfully",_id:user._id,name:user.name,email:user.email,role:user.role,token});
}


//VERIFY OTP------->
async function verifyOtp(req,res) {
    const {email ,otp} = req.body;
    const otpRecord = await Otp.findOne({email , otp , action:"account_Verification"});
    if(!otpRecord){
        return res.status(400).json({message:"Invalid OTP"});
    }

    const user = await User.findOneAndUpdate({email},{isVerified:true});
    await Otp.deleteMany({email , action:"account_Verification"});
    await Otp.create({email,otp,action:"account_Verification"});

    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.status(200).json({message:"User verified successfully",_id:user._id,name:user.name,email:user.email,role:user.role,token});
}


export {logInUser,registerUser , verifyOtp}