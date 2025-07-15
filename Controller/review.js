const Listing = require('../Model/listing.js');
const Review = require('../Model/reviews.js');

module.exports.createReview =  async(req,res)=>{
        let listing = await Listing.findById(req.params.id);
        console.log(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created Successfully!");
        res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
     // Redirect to the listing page after deleting the review
    res.redirect(`/listings/${id}`);
}