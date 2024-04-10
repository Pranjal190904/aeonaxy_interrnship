const jwt=require('jsonwebtoken');
const {accessTokenSecret,resetPasswordTokenSecret}=require('../config/env.config')

function verifyAccessToken(req,res,next)
{
    const accessToken=req.cookies.accessToken;
    if(!accessToken)
    {
        return res.status(401).json({message:"unauthorized"})
    }
    try{
        const decoded=jwt.verify(accessToken,accessTokenSecret);
        req.user=decoded.aud;
        next();
    }
    catch(err)
    {
        return res.status(401).json({message:"unauthorized"})
    }
}

function verifyResetPasswordToken(req,res,next)
{
    const resetPasswordToken=req.cookies.resetPasswordToken;
    if(!resetPasswordToken)
    {
        return res.status(400).json({message:"bad request"})
    }
    try{
        const decoded=jwt.verify(resetPasswordToken,resetPasswordTokenSecret);
        req.user=decoded.aud;
        next();
    }
    catch(err)
    {
        return res.status(400).json({message:"please try again"})
    }
}

module.exports={verifyAccessToken,verifyResetPasswordToken}