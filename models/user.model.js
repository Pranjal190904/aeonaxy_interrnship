const sequelize=require('../config/db.config')
const {DataTypes}=require('sequelize');

const User=sequelize.define('User',{
    userId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    profilePhoto:{
        type:DataTypes.STRING
    },
    gender:{
        type:DataTypes.ENUM,
        values:  ['male','female','other']
    },
    isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    about:{
        type:DataTypes.STRING
    },
    isUserSuperadmin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

module.exports=User