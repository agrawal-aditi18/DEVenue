const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value){
        if(!["male","female", "others"].includes(value)){
            throw new Error("Gender data is invalid");
        }
    }
  },
  photoUrl: {
    type: String,
    default: "https://avatar.iran.liara.run/public/35",
  },
  about: {
    type: String,
    default: "This is a default about of user!",
  },
  skills: {
    type: [String],
  },
},{
    timestamps: true,
});

//this model create its own instances
module.exports = mongoose.model("User", userSchema);