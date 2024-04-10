const {dbUrl}=require('../config/env.config');
const {Sequelize}=require('sequelize');

const sequelize=new Sequelize(dbUrl);

module.exports=sequelize;