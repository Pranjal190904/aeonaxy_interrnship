const User=require('../models/user.model')
const bcrypt=require('bcrypt');
const mailer=require('../utils/mailer')
const Otp=require('../models/otp.model')

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
            await mailer(otp,"Verification",name,email);
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
            if(User.isVerified)
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
    }
}

module.exports=user;