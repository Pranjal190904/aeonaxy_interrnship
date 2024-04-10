const router=require('express').Router();
const course=require('../controllers/course.controller');
const {verifyAccessToken}=require('../middlewares/auth')

router.post('/create',verifyAccessToken,course.create);
router.post('/update',verifyAccessToken,course.update);
router.delete('/:courseId',verifyAccessToken,course.delete);

module.exports=router;