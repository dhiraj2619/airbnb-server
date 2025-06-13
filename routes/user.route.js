const express = require('express');
const upload = require('../config/multerConfig');
const { signupUser } = require('../controllers/user.controller');
const userRouter = express.Router();

userRouter.post('/signup', upload.fields([
    {name:'profilePic',maxCount:1},
]),signupUser);


module.exports = userRouter;