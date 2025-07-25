const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../Model/reviews.js");
const Listing = require("../Model/listing");
const {isLoggedIn, isOwner,validateListing} = require('../middleware.js');
const listingController = require('../Controller/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const uploads = multer({ storage});




router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn ,validateListing,uploads.single("listing[image]"), wrapAsync(listingController.createListing))
    .post((req,res)=>{
        res.send(req.file);
    })
       

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,uploads.single("listing[image]") ,validateListing , wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner , wrapAsync(listingController.deleteListing))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync(listingController.renderEditForm));

module.exports = router;