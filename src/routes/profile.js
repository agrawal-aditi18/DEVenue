const express = require('express');
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData} = require("../utils/validation");
const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
}); 

profileRouter.patch("/profile/edit" , userAuth, async(req , res) => {
try {
  if(!validateEditProfileData(req)){
    throw new Error("Invalid Edit Request");
  }

 //now i can safely add this data into my user obj
 const loggedInUser = req.user;
 

 Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
 await  loggedInUser.save();

 res.json({
   message:` ${loggedInUser.firstName} , your profile was updated successfully`,
   data: loggedInUser,
 });

} catch (error) {
  res.status(400).send("ERROR: " + error.message);
}
});


module.exports = profileRouter;