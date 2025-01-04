
require("dotenv").config();
const mongoose = require("mongoose");


const upSeed = async (model, collectionDate, name) => {

     try {

          await mongoose.connect(process.env.DDBB_URL);

          await model.collection.drop();
          console.log(`delete ${name}`);

          await model.insertMany(collectionDate);
          console.log(`insert ${name}`);

          await mongoose.disconnect();
          console.log("disconect");

     } catch (error) {

          console.log(error);

     }
}




module.exports = upSeed;