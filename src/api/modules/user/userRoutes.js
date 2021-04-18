const {Router}=require('express')
const validation=require('./userValidation');
const controller=require('./userControllers');
const {Multer} = require('../../../utils');

const router=Router();

router.post('/signup',validation.signup,controller.signup);
router.post('/login',validation.login,controller.login);
router.get('/logout',validation.logout,controller.logout);

//fetch user profile info
router.get('/:id',validation.fetchUserInfo,controller.fetchUserInfo);

// edit user profile info
router.put('/:id',validation.editUser,controller.editUser);

//create a user
router.post('/',validation.createUser,controller.createUser);

//upload a users profile pic
router.post('/dp-upload',Multer.single('image'),validation.dpUpload,controller.dpUpload);



module.exports=router;