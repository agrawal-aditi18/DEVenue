const express = require("express");

const app = express();

app.use("/", 
[(req, res, next)=>{
    // res.send("Handling the route user 1!");
    next();
},
(req, res, next)=>{
    // res.send("Handling the route user 2!");
    next();
},
],
(req, res, next)=>{
    // res.send("Handling the route user 3!");
    next();
},
(req, res, next)=>{
    // res.send("Handling the route user 4!");
    next();
},
);

app.get("/user", (req ,res, next)=>{
res.send("Handle/ route");
})

app.listen(7777, ()=> {
    console.log("Server is successfully listening on port 7777...");
});