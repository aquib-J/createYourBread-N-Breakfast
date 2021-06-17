const { Router } = require('express');
const validation = require('./userValidation');
const controller = require('./userControllers');
const { Multer } = require('../../../utils');
const { PushToBody, Authenticate } = require('./../../middlewares');

const authRoutes = require('./auth/authRoutes');
const router = Router();

router.use('/auth', authRoutes);

//fetch user profile details
router.get('/:userId', validation.getUser, Authenticate.checkSession, PushToBody, controller.getUser);

// edit user profile info
router.patch('/:userId', validation.updateUser, Authenticate.checkSession, PushToBody, controller.updateUser);

//upload a users profile pic
router.post(
  '/:userId/dp-upload',
  validation.dpUpload,
  Authenticate.checkSession,
  Multer.single('image'),
  PushToBody,
  controller.dpUpload,
);

// fetch All Data associated with a particular user
router.get(
  '/:userId/complete-user-record',
  validation.getCompleteUserRecord,
  Authenticate.checkSession,
  PushToBody,
  controller.getCompleteUserRecord,
);

module.exports = router;
