if(process.env.NODE_ENV !== 'Production')
{
    require('dotenv').config()
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const campgroundsRoutes = require('./routes/campground')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/user')

mongoose.connect('mongodb://127.0.0.1:27017/camp-ground')
    .then(() => {
        console.log("MONGODB CONNECTED !!!!!!");

    })
    .catch(err => {
        console.log("MONGODB CONNTECTION ERROR");
    })


app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

const sessionConfig = 
    {
        secret: "thisshouldbeabettersecert",
        resave: false,
        saveUninitialized : true,
        httpOnly: true,
        cookie: {
            expires: Date.now() + 1000*60*60*24*7,
            maxAge: 1000*60*60*24*7
        }
    }

app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    return next();


})



app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/',usersRoutes)



app.all('*', (req, res, next) => {
    next(new ExpressError('page not found!!', 404));

})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "something went wrong"
    res.status(statusCode).render('error', { err })
})
app.listen(3000, () => {
    console.log('listening on port 3000 !!!!!!!');
});