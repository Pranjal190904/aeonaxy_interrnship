const cloudinary=require('cloudinary').v2
const {cloudName,cloudApiSecret,cloudApiKey}=require('../config/env.config');

cloudinary.config({
    cloud_name:cloudName,
    api_key:cloudApiKey,
    api_secret:cloudApiSecret
})

module.exports=cloudinary