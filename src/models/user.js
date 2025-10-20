const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum :{
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is invalid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default: "https://avatar.iran.liara.run/public/35",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL:" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);


userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id },
    "DEV@Venue777",
    {
      expiresIn: "7d",
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
  const user = this;
  const passswordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passswordHash
  );

  return isPasswordValid; 
}

//this model create its own instances
module.exports = mongoose.model("User", userSchema);