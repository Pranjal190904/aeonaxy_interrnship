const router=require('express').Router();
const user=require('../controllers/user.controller');
const course=require('../controllers/course.controller');
const {verifyAccessToken,verifyResetPasswordToken}=require('../middlewares/auth')
const upload=require('../middlewares/multer')

router.post('/register',user.register);
router.post('/verify',user.verify);
router.post('/login',user.login);
router.get('/profile',verifyAccessToken,user.profile);
router.post('/update/profile',verifyAccessToken,user.updateProfile);
router.post('/update/email',verifyAccessToken,user.updateEmail);
router.post('/verifyNewEmail',verifyAccessToken,user.verifyNewEmail);
router.post('/update/profilePhoto',verifyAccessToken,upload,user.updatePhoto);
router.post('/resetPassword',user.resetPassword);
router.post('/verifyOtp',user.verifyOtp);
router.post('/setNewPassword',verifyResetPasswordToken,user.setNewPassword);
router.get('/courses',course.courses);
router.post('/course/enroll',verifyAccessToken,course.enroll);
router.get('/enrolledCourses',verifyAccessToken,course.coursesEnrolled);

module.exports=router;