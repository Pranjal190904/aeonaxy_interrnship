const Course=require('../models/course.model')
const User=require('../models/user.model')
const sequelize=require('../config/db.config')
const Enrollment=sequelize.models.Enrollment;
const mailer=require('../utils/mailer')

const course={
    courses:async(req,res)=>{
        try{
            const {filter,page=1,limit=10}=req.query;
            const offset = (page - 1) * limit;
            if(!filter)
            {
                let courses=await Course.findAll({limit:parseInt(limit),offset:offset});
                return res.status(200).json({courses});
            }
            let courses=await Course.findAll({where:filter,limit:parseInt(limit),offset:offset});
            return res.status(200).json({courses});
        }
        catch(err)
        {
            return res.status(500).json({message:"Internal server error"});
        }
    },
    enroll:async(req,res)=>{
        try{
            const userId=req.user;
            const {courseId}=req.body;
            const enrollment=await Enrollment.findOne({where:{UserUserId:userId,CourseCourseId:courseId}});
            if(enrollment)
            {
                return res.status(400).json({message:"already enrolled."});
            }
            const course=await Course.findOne({where:{courseId:courseId}});
            const user=await User.findOne({where:{userId:userId}});
            await course.addUser(user);
            await mailer.courseNotification(user.name,course.title,user.email);
            return res.status(200).json({message:"User enrolled successfully"})
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server eror"});
        }
    },
    coursesEnrolled:async(req,res)=>{
        try{
            const userId=req.user;
            const user=await User.findOne({where:{userId:userId}});
            const enrolledCourses=await user.getCourses();
            return res.status(200).json({enrolledCourses});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    },
    create:async(req,res)=>{
        try{
            const {title,durationInMonths,level,category,description}=req.body;
            const userId=req.user;
            const user=await User.findOne({userId:userId});
            if(!user.isUserSuperadmin)
            {
                return res.status(401).json({message:"unauthorized"});
            }
            await Course.create({
                title:title,
                durationInMonths:durationInMonths,
                level:level,
                category:category,
                description:description
            });
            return res.status(201).json({message:"Course created successfully."});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"})
        }
    },
    update:async(req,res)=>{
        try{
            const updatedDetails=req.body;
            const userId=req.user;
            const user=await User.findOne({where:{userId:userId}});
            if(!user.isUserSuperadmin)
            {
                return res.status(401).json({message:"unauthorized"});
            }
            await Course.update(updatedDetails,{where:{courseId:req.query.courseId}});
            return res.status(200).json({message:"course details updated successfully"});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    },
    delete:async(req,res)=>{
        try{
            const courseId=req.params.courseId;
            const userId=req.user;
            const user=await User.findOne({where:{userId:userId}});
            if(!user.isUserSuperadmin)
            {
                return res.status(401).json({message:"unauthorized"});
            }
            await Course.destroy({where:{courseId:courseId}});
            return res.status(200).json({message:"course deleted successful."});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    }
}

module.exports=course