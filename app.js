const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const campgrounds = require('./routes/campground')
const reviews = require('./routes/reviews')

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





app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);



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
