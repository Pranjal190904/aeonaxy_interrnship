require('dotenv').config()

const PORT=process.env.PORT;
const dbUrl=process.env.DBURI
const apiKey=process.env.APIKEY
const mailUser=process.env.MAILUSER
const mailPass=process.env.MAILPASS
const accessTokenSecret=process.env.ACCESSTOKENSECRET
const cloudName=process.env.CLOUDNAME
const cloudApiKey=process.env.CLOUDAPIKEY
const cloudApiSecret=process.env.CLOUDAPISECRET
const resetPasswordTokenSecret=process.env.RESETPASSWORDTOKENSECRET

module.exports={PORT,dbUrl,apiKey,mailPass,mailUser,accessTokenSecret,cloudName,cloudApiKey,cloudApiSecret,resetPasswordTokenSecret}