const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const {campgroundSchema} = require('../schemas.js')

const validateCampGround = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}


router.get('/', CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    // console.log(campgrounds);
    res.render('campgrounds/index', { campgrounds });

}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new');

})
router.get('/:id', CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    // console.log(campground)
    res.render('campgrounds/show', { campground });

}))
router.get('/:id/edit', CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

}))

router.put('/:id', validateCampGround, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}))



router.post('/campgrounds', validateCampGround, CatchAsync(async (req, res, next) => {
    // if(!req.body.campground)

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}))

module.exports = router;