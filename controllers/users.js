const User = require('../models/user')
const passport = require('passport');

module.exports.getregForm = (req,res)=>{
    res.render('users/register');

}
module.exports.registerUser = async (req,res,next)=>{
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

}


module.exports.loginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.loggIn = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}

module.exports.loggOut = (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });

}