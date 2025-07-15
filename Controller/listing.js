const Listing = require("../Model/listing.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", {allListings});

};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listing });
}
    

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename 
    let newListing =new Listing (req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the current user
    newListing.image = {url,filename}; // Set the image URL and filename
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested does not exist");
         return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; // Store the original image URL
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_250"); // Adjust the URL for display

    res.render("listings/edit.ejs", {listing ,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}; // Update the image URL and filename
    await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}


//mongodb+srv://kawadesonal9:mL2MojQU7dJfHWwS@cluster0.qsds0s2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
