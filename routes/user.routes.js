const router=require('express').Router();
const user=require('../controllers/user.controller');

router.post('/register',user.register);
router.post('/verify',user.verify);

module.exports=router;