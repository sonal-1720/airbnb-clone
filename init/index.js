const mongoose = require ("mongoose");
const initdata = require ("./data");
const Listing = require ("../Model/listing.js");
main().then((res)=>{
    console.log("Connected to MongoDB successfully");
}).catch
((err) => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
      ...obj,
      owner: "68676f05091c12c68d2c3d0d"
    }))
    await Listing.insertMany(initdata.data);
    console.log("Database initialize with sample data");
}
initDB();