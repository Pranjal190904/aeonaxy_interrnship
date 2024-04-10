const nodemailer=require('nodemailer');
const {mailUser,mailPass}=require('../config/env.config')

const transporter=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: mailUser,
        pass: mailPass
    }
})
const mailer={
    sendOtp:async(otp,subject,user,email)=>{
        const options={
            to: email,
            subject: subject,
            html: `<p style="font-size: 20px">Hello ${user},<br>Here is your OTP:<br><b>${otp}</b><br><br>This OTP is valid till 10 minutes.</p>`
        }
        await transporter.sendMail(options);
    },
    courseNotification:async (user,course,email)=>{
        const options={
            to: email,
            subject: "Course Enrollment",
            html: `<p style="font-size: 20px">Congratulation ${user},<br>You Have Successfully Enrolled in the Course <b>${course}</b></p>`
        }
        await transporter.sendMail(options);
    }
}

module.exports=mailer;