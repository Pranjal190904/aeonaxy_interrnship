require('dotenv').config()

const PORT=process.env.PORT;
const dbUrl=process.env.DBURI
const apiKey=process.env.APIKEY
const mailUser=process.env.MAILUSER
const mailPass=process.env.MAILPASS

module.exports={PORT,dbUrl,apiKey,mailPass,mailUser}