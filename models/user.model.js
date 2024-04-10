const sequelize=require('../config/db.config')
const {DataTypes}=require('sequelize');

const User=sequelize.define('User',{
    userId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail:{
                msg:'invalid email'
            }
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isStrongPassword(value) {
                if (!/\d/.test(value) || !/[a-zA-Z]/.test(value) || value.length < 8) {
                    throw new Error('Password must be at least 8 characters long and contain at least one letter and one number');
                }
            }
        }
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