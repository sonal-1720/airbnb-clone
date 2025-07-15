const express = require('express');
const router = express.Router({mergeParams:true}); // Allows nested routes to access params from parent route
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require("../Model/reviews.js");
const Listing = require("../Model/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const controllerReview = require('../Controller/review.js');



//Review Route
//post route for reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(controllerReview.createReview));
//Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(controllerReview.deleteReview));
module.exports = router;
