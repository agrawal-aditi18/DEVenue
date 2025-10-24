const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encryption of password
    const passswordHash = await bcrypt.hash(password, 10);
    console.log(passswordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passswordHash,
    });

    await user.save(); //data saved to DB
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT();
      //Add the token to cookie and send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/logout", async(req, res) =>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfully!!");
});



module.exports = authRouter;
