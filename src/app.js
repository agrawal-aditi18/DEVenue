const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const{validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");

app.use(express.json()); //now this middleware is activated for all the routes to convert the json data into js obj

app.post("/signup", async (req, res) =>{
  try {
    //Validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encryption of password
    const passswordHash = await bcrypt.hash(password, 10);
    console.log(passswordHash)

    const user = new User({
      firstName, lastName, emailId, password: passswordHash,
    });

    await user.save(); //data saved to DB
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

//  Get user by email
app.get("/user", async(req , res) => {
  const userEmail = req.body.emailId;
  try {
     const users = await User.find({emailId : userEmail});
    if(users.length === 0){
      res.status(404).send("User not found");
    }
    else{
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }

});

//Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try{
    const users = await User.find({});
    res.send(users);
  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
})

//Delete a user from the database
app.delete("/user", async(req, res)=>{
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({_id: userId})
    res.send("User deleted successfully");
  } catch (error) {
     res.status(400).send("Something went wrong");
  }
})

//Update the data of the user
app.patch("/user/:userId" , async(req,res) => {
  const userId = req.params?.userId;
  const data = req.body;
 
  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not Allowed");
    }

    if(data?.skills.length > 10){
      throw new Error ("Skills cannot be more than 10")
    }
    const user = await User.findByIdAndUpdate({_id : userId}, data,{
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("UPDATE FAILED: "+ error.message);
  }
})

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
