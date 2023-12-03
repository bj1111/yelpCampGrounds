const express = require('express');
const router = express.Router({mergeParams:true});
const CatchAsync = require('../utils/CatchAsync')
const {validateReview,isLoggedIn,isreviewAuthor}  = require('../middleware')
const reviews = require('../controllers/reviews')
router.post('/',isLoggedIn,validateReview,CatchAsync(reviews.addReview))

router.delete('/:reviewId',isLoggedIn,isreviewAuthor,CatchAsync(reviews.deleteReview))

module.exports = router;