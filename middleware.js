module.exports.isLoggedIn = function(req,res,next)
{
    console.log("REQ USER...:",req.user)
    if(!req.isAuthenticated())
    {
            req.flash('error','user must be logged in!!')
            return res.redirect('/login')

    }
    next();

} 
