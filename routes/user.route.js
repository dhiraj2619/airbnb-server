const express = require('express');
const upload = require('../config/multerConfig');
const userRouter = express.Router();

userRouter.post('/signup', upload.fields([
    {name:'profilePic',maxCount:1},
]));


module.exports = userRouter;