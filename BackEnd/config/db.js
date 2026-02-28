const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/DiteTracker");
    console.log("connected hui hui");
  } catch (error) {
    console.error("failed to connect ", error.message);
    process.exit(1);
  }
};
module.exports = connectDb;
