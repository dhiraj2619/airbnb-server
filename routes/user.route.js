const express = require('express');
const upload = require('../config/multerConfig');
const { signupUser, loginUser, checkUserExists } = require('../controllers/user.controller');
const { SESSION_SECRET, JWT_SECRET } = require('../config/config');
const passport = require('passport');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');


userRouter.post('/check-user',checkUserExists);
userRouter.post('/signup', upload.fields([
    {name:'profilePic',maxCount:1},
]),signupUser);

userRouter.post('/login',loginUser);


userRouter.use(require('express-session')({
    secret:SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));


userRouter.get('/google',passport.authenticate("google",{
    scope:["profile","email"],
    prompt:"select_account"
}));

userRouter.get('/google/callback',passport.authenticate("google",{session:false,failureRedirect:"/login"}),(req,res)=>{
     const token = jwt.sign({id:req.user._id},JWT_SECRET,{expiresIn:'7d'});

     res.send(`
      <script>
        window.opener.postMessage(
          ${JSON.stringify({ token })},
          "${process.env.CLIENT_ORIGIN}"
        );
        window.close();
      </script>
    `);
});



module.exports = userRouter;