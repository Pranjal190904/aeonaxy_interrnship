const sequelize=require('../config/db.config')
const {DataTypes}=require('sequelize')

const Otp=sequelize.define('Otp',{
    otp:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    user:{
        type: DataTypes.STRING,
        allowNull: false
    },
    expires:{
        type:DataTypes.DATE,
        defaultValue: Date.now()+600000
    }
})

module.exports=Otp;