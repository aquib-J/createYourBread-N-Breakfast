const { Router } = require('express');
const validation = require('./userValidation');
const controller = require('./userControllers');
const { Multer } = require('../../../utils');
const { PushToBody } = require('./../../middlewares');
const router = Router();

router.post('/signup', validation.signup, PushToBody, controller.signup);
// signs up and creates a user : email id is unique
router.post('/login', validation.login, controller.login);
router.get('/logout', validation.logout, controller.logout);

//fetch user profile details
router.get('/:id', validation.getUser, PushToBody, controller.getUser);

// edit user profile info
router.patch('/:id', validation.updateUser, controller.updateUser);

//upload a users profile pic
router.post('/dp-upload', Multer.single('image'), validation.dpUpload, controller.dpUpload);

// fetch All Data associated with a particular user
router.get('/complete-user-record/:id',validation.getCompleteUserRecord,PushToBody,controller.getCompleteUserRecord);

module.exports = router;
