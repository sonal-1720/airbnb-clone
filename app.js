if(process.env.NODE_ENV !== "production") {
require('dotenv').config()
}
console.log(process.env.SECRET);

const express = require ('express');
const app = express();
const path = require ("path");
const ejsMate = require('ejs-mate');
const session = require ("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Model/user.js');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require('./route/listing.js');
const reviewRouter = require('./route/review.js');
const userRouter = require('./route/user.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); 
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const dbURL = process.env.ATLAS_DB_URL;
main().then((res)=>{
    console.log("Connected to MongoDB successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);

}

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret:process.env.SECRET, // Use a strong secret for session encryption
    },
    touchAfter: 24 * 3600, // time period in seconds after which the session will be updated
})
store.on("error",()=>{
    console.log("Session Store Error Occurred",err);
})

const sessionOptions ={
    store,
    secret : process.env.SECRET, // Use a strong secret for session encryption
    resave:  false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 *24 *60*60* 1000,
        maxAge: 7 *24 *60*60* 1000 ,// 7 days in milliseconds
        httpOnly: true // Helps prevent XSS attacks by not allowing client-side scripts to access the cookie
    },

};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({extended:true})); 
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));
// const mongoose = require('mongoose');
// const ExpressError = require('./utils/ExpressError.js');
// const listingRouter = require('./route/listing.js');
// const reviewRouter = require('./route/review.js');
// const userRouter = require('./route/user.js');

// const dbURL = process.env.ATLAS_DB_URL;
// main().then((res)=>{
//     console.log("Connected to MongoDB successfully");
// }).catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(dbURL);

// }

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser =new User({
//         email : "student@gmail.com",
//         username : "student",
//     });
//     let regeisteredUser = await User.register(fakeUser, "student123");
//     res.send(regeisteredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
    res.redirect("/listings"); // or render a home page if you prefer
});


// app.get('/', (req,res)=>{
//     res.send('Hello');
// });
//Error handling middleware
// app.use((err , req ,res, next)=>{
//     res.send("Something went wrong");
// })
// app.all('*',(req,res,next)=>{
//     next(new ExpressError(404, "Page Not Found!"));
// })

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404, "Page Not Found!"));
// })
app.use((err,req,res,next)=>{
    let {statusCode = 500, message ="Something went wrong"} = err;
    res.render("listings/error.ejs", {message});
})
app.listen(8080, (req,res)=>{
    console.log('Server listening to port 8080');
})