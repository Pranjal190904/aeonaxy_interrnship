const {DataTypes}=require('sequelize');
const sequelize=require('../config/db.config');
const User=require('../models/user.model')

const Course=sequelize.define('Course',{
    courseId:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    title:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    durationInMonths:{
        type:DataTypes.INTEGER
    },
    level:{
        type:DataTypes.ENUM,
        values:['beginner','intermediate','advanced']
    },
    category:{
        type:DataTypes.STRING
    },
    description:{
        type:DataTypes.STRING
    }
});

Course.belongsToMany(User,{through:'Enrollment'});

module.exports=Course