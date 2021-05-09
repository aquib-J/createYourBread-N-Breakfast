const { Router } = require('express');
const validation = require('./userValidation');
const controller = require('./userControllers');
const { Multer } = require('../../../utils');
const { PushToBody } = require('./../../middlewares');

const authRoutes = require('./auth/authRoutes');
const router = Router();

router.use('/auth', /*validation.tokenSchema,*/ authRoutes);

//fetch user profile details
router.get('/:id', validation.getUser, PushToBody, controller.getUser);

// edit user profile info
router.patch('/:id', validation.updateUser, controller.updateUser);

//upload a users profile pic
router.post('/dp-upload', Multer.single('image'), validation.dpUpload, controller.dpUpload);

// fetch All Data associated with a particular user
router.get('/complete-user-record/:id', validation.getCompleteUserRecord, PushToBody, controller.getCompleteUserRecord);

module.exports = router;
