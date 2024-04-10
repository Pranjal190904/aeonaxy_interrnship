const User=require('../models/user.model')
const bcrypt=require('bcrypt');
const mailer=require('../utils/mailer')
const Otp=require('../models/otp.model')
const {signAccessToken,signResetPasswordToken}=require('../utils/token');
const cloudinary=require('../config/cloudinary.config');

const user={
    register:async(req,res)=>{
        try{
            const {name,password,email}=req.body;
            const hashedPassword=await bcrypt.hash(password,10);
            const user=await User.findOne({where:{email:email}});
            if(user)
            {
                if(user.isVerified)
                {
                    res.status(400).json({message:"email already registered."})
                    return;
                }
                await User.update({name:name,password:hashedPassword},{where:{email:email}});
            }
            else
            {
                await User.create({
                    name:name,
                    email:email,
                    password:hashedPassword
                })
            }
            const otp=Math.floor(Math.random()*8999)+1000;
            await mailer.sendOtp(otp,"Verification",name,email);
            const OTP=await Otp.findOne({where:{user:email}});
            if(OTP)
            {
                await Otp.destroy({where:{user:email}});
            }
            await Otp.create({
                otp:otp,
                user:email
            })
            return res.status(201).json({message:"otp for verification sent succesfully to your email."});
        }
        catch(err)
        {
            return res.status(500).json({message:"Internal Server error."})
        }
    },
    verify:async(req,res)=>{
        try{
            const {email,otp}=req.body;
            const user=await User.findOne({where:{email:email}});
            if(!user)
            {
                res.status(404).json({message:"User not found"});
                return;
            }
            if(user.isVerified)
            {
                res.status(400).json({message:"User already verified"});
                return;
            }
            const OTP=await Otp.findOne({where:{user:email}});
            if(OTP.expires<Date.now())
            {
                res.status(403).json({message:"OTP expired."});
                return;
            }
            if(OTP.otp!=otp)
            {
                res.status(400).json({message:"Incorrect otp."});
                return;
            }
            await User.update({isVerified:true},{where:{email:email}});
            await Otp.destroy({where:{user:email}});
            return res.status(200).json({message:"User Verified Successfully."});
        }
        catch(err)
        {
            return res.status(500).json({message:"Internal server error"});
        }
    },
    login:async(req,res)=>{
        try{
            const {email,password}=req.body;
            const user=await User.findOne({where:{email:email}});
            if(!user || !user.isVerified)
            {
                return res.status(404).json({message:"user not found."});
            }
            const matchPassword=await bcrypt.compare(password,user.password);
            if(!matchPassword)
            {
                return res.status(401).json({message:"incorrect password"});
            }
            const accessToken=signAccessToken(user.userId);
            res.cookie('accessToken',accessToken,{httpOnly:true,sameSite:'None',secure:true});
            return res.status(200).json({message:"login successful"});
        }
        catch(err)
        {
            return req.status(500).json({message:"internal server error"});
        }
    },
    profile:async(req,res)=>{
        try{
            const userId=req.user;
            const userProfile=await User.findOne({where:{userId:userId},attributes:['name','email','profilePhoto','gender','about']});
            return res.status(200).json({userProfile});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    },
    updateProfile:async(req,res)=>{
        try{
            const userId=req.user;
            const details=req.body;
            await User.update(details,{where:{userId:userId}});
            return res.status(200).json({message:"profile details updated successfully."});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server eror"})
        }
    },
    updateEmail:async(req,res)=>{
        try{
            const {newEmail}=req.body;
            const user=await User.findOne({where:{email:newEmail}});
            if(user && user.isVerified)
            {
                return res.status(400).json({message:"email already exist"});
            }
            const otp=Math.floor(Math.random()*8999)+1000;
            await mailer.sendOtp(otp,"Update Email",'',newEmail);
            const OTP=await Otp.findOne({where:{user:newEmail}});
            if(OTP)
            {
                await Otp.destroy({where:{user:newEmail}});
            }
            await Otp.create({
                otp:otp,
                user:newEmail
            })
            res.cookie('newEmail',newEmail,{httpOnly:true,sameSite:'None',secure:true});
            return res.status(200).json({message:"otp for verification sent succesfully to your email."});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"})
        }
    },
    verifyNewEmail:async(req,res)=>{
        try{
            const {otp}=req.body;
            const newEmail=req.cookies.newEmail;
            const userId=req.user;
            if(!newEmail)
            {
                return res.status(400).json({message:"Kindly retry"})
            }
            const OTP=await Otp.findOne({where:{user:newEmail}});
            if(OTP.expires<Date.now())
            {
                return res.status(400).json({messsage:"OTP expired"});
            }
            if(OTP.otp!=otp)
            {
                return res.status(400).json({message:"incorrect otp"});
            }
            await User.update({email:newEmail},{where:{userId:userId}});
            await Otp.destroy({where:{user:newEmail}});
            return res.status(200).json({message:"email updated successfully"});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"})
        }
    },
    updatePhoto:async(req,res)=>{
        try{
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const response=await cloudinary.uploader.upload(dataURI); 
            const userId=req.user;
            await User.update({profilePhoto:response.secure_url},{where:{userId:userId}});
            return res.status(200).json({message:"profile photo updated successfully."})
        }
        catch(err)
        {
            res.status(500).json({message:"internal server eror"});
        }
    },
    resetPassword:async(req,res)=>{
        try{
            const {email}=req.body;
            const user=await User.findOne({where:{email:email}});
            if(!user || !user.isVerified)
            {
                return res.status(404).json({message:"user not found"});
            }
            const otp=Math.floor(Math.random()*8999)+1000;
            await mailer.sendOtp(otp,"Reset Password",user.name,email);
            const OTP=await Otp.findOne({where:{user:email}});
            if(OTP)
            {
                await Otp.destroy({where:{user:email}});
            }
            await Otp.create({
                otp:otp,
                user:email
            })
            res.status(200).json({message:"otp sent successfully to your email"})
        }
        catch(err)
        {
            res.status(500).json({message:"internal server error"})
        }
    },
    verifyOtp:async(req,res)=>{
        try{
            const {email,otp}=req.body;
            const user=await User.findOne({where:{email:email}});
            if(!user || !user.isVerified)
            {
                res.status(404).json({message:"User not found"});
                return;
            }
            const OTP=await Otp.findOne({where:{user:email}});
            if(OTP.expires<Date.now())
            {
                res.status(403).json({message:"OTP expired."});
                return;
            }
            if(OTP.otp!=otp)
            {
                res.status(400).json({message:"Incorrect otp."});
                return;
            }
            const resetPasswordToken=signResetPasswordToken(user.userId);
            res.cookie('resetPasswordToken',resetPasswordToken,{httpOnly:true,sameSite:'None',secure:true})
            return res.status(200).json({message:"otp verifies successfully"})
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    },
    setNewPassword:async(req,res)=>{
        try{
            const {newPassword}=req.body;
            const userId=req.user;
            const hashedPassword=await bcrypt.hash(newPassword,10);
            await User.update({password:hashedPassword},{where:{userId:userId}});
            return res.status(200).json({message:"password reset successful."})
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    }
}

module.exports=user;