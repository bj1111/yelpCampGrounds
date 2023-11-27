const express = require('express');
const router = express.Router();
const User = require('../models/user')
const CatchAsync = require('../utils/CatchAsync');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');

})

router.post('/register',CatchAsync(async (req,res,next)=>{
    try{
        const {Email,username,password} = req.body;
    const user = new User({Email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,(err)=> {
        if(err)
        {
            return next(err);
        }
        req.flash('success',`Welcome to YelpCamp!!! ${username}`);
        res.redirect('/campgrounds')
        

    })
    

    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/register')
    }
    
    


}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success',`hello!!!!}`);
    res.redirect('/campgrounds');
    
})

router.get('/logout',(req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });

})


module.exports = router;