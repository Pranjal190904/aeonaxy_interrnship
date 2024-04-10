const jwt=require('jsonwebtoken');
const {accessTokenSecret,resetPasswordTokenSecret}=require('../config/env.config')

function signAccessToken(id)
{
    const payload={
        aud:id
    }
    const options={
        expiresIn:'10d'
    }
    const token=jwt.sign(payload,accessTokenSecret,options);
    return token;
}

function signResetPasswordToken(id)
{
    const payload={
        aud:id
    }
    const options={
        expiresIn:'10m'
    }
    const token=jwt.sign(payload,resetPasswordTokenSecret,options);
    return token;
}
module.exports={signAccessToken,signResetPasswordToken};