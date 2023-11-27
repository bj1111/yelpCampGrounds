const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const {campgroundSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware');

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


router.get('/' ,CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    // console.log(campgrounds);
    res.render('campgrounds/index', { campgrounds });

}))
router.get('/new',isLoggedIn,(req, res) => {
    
    res.render('campgrounds/new');

})
router.get('/:id',isLoggedIn,CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground)
    {
        req.flash('error',`cant find the campground you are looking for`)
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground });

}))
router.get('/:id/edit',isLoggedIn,CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error',`cant find the campground you are looking for`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });

}))

router.put('/:id',isLoggedIn,validateCampGround, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn,CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted  Campground!')
    res.redirect('/campgrounds');

}))



router.post('/', isLoggedIn,validateCampGround, CatchAsync(async (req, res, next) => {
    // if(!req.body.campground)
    

    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','successfully add a new camp ground')
    res.redirect(`/campgrounds/${campground._id}`);

}))

module.exports = router;