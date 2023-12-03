const express = require('express');
const router = express.Router();
const User = require('../models/user')
const CatchAsync = require('../utils/CatchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.get('/register',users.getregForm)

router.post('/register',CatchAsync(users.registerUser))

router.get('/login',users.loginForm)

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    users.loggIn);

router.get('/logout', users.loggOut)


module.exports = router;