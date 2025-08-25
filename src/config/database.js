const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
      "mongodb+srv://namastedev:1vlobWJ7SFb42kBi@namastenode.df2lbva.mongodb.net/DEVenue"
    );
};

module.exports = connectDB;