const express = require('express');
const upload = require('../config/multerConfig');
const { signupUser, loginUser, checkUserExists } = require('../controllers/user.controller');
const userRouter = express.Router();


userRouter.post('/check-user',checkUserExists);
userRouter.post('/signup', upload.fields([
    {name:'profilePic',maxCount:1},
]),signupUser);

userRouter.post('/login',loginUser);


module.exports = userRouter;