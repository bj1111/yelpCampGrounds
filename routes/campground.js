const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const {isLoggedIn,validateCampGround,isAuthor} = require('../middleware');


router.get('/' ,CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    // console.log(campgrounds);
    res.render('campgrounds/index', { campgrounds });

}))
router.get('/new',isLoggedIn,(req, res) => {
    
    res.render('campgrounds/new');

})
router.get('/:id',CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
        {
        path :'reviews',
        populate:'author'
    }).populate('author');
    if(!campground)
    {
        req.flash('error',`cant find the campground you are looking for`)
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground });

}))
router.get('/:id/edit',isLoggedIn,isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error',`cant find the campground you are looking for`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });

}))

router.put('/:id',isLoggedIn,isAuthor,validateCampGround, CatchAsync(async (req, res) => {
    
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:id', isLoggedIn,isAuthor,CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted  Campground!')
    res.redirect('/campgrounds');

}))



router.post('/', isLoggedIn,validateCampGround, CatchAsync(async (req, res, next) => {
    // if(!req.body.campground)
    


    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash('success','successfully add a new camp ground')
    res.redirect(`/campgrounds/${campground._id}`);

}))

module.exports = router;