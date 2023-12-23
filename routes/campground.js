const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const campgrounds = require('../controllers/campground')
const {isLoggedIn,validateCampGround,isAuthor} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})
// const Campground = require('../models/campground')



router.get('/' ,CatchAsync(campgrounds.index))
router.get('/new',isLoggedIn,campgrounds.newForm)
router.get('/:id',CatchAsync(campgrounds.getCamp))
router.get('/:id/edit',isLoggedIn,isAuthor, CatchAsync(campgrounds.getEditCamp))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampGround, CatchAsync(campgrounds.editCamp))
router.delete('/:id', isLoggedIn,isAuthor,CatchAsync(campgrounds.deleteCamp))
router.post('/', isLoggedIn, upload.array('image'),validateCampGround,CatchAsync(campgrounds.createCamp))
// router.post('/',upload.single('image'),(req,res)=>{
//     console.log(req.file)
//     res.send('it worked')
// })

module.exports = router;