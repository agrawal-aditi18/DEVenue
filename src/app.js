const express = require("express");

const app = express();

app.get("/user/:userId/:name", (req, res)=>{
    // console.log(req.query);
    console.log(req.params);
    res.send({firstName: "Aditi", lastName: "Agrawal"});
})

app.post("/user", (req,res) => {
    //saving data to DB
    res.send("Data successfully saved to the database!")
});

app.delete("/user", (req,res)=>{
    res.send("Deleted successfully!");
});

app.use("/test", (req, res)=>{
    res.send("Hello from test route!");
});

app.listen(7777, ()=> {
    console.log("Server is successfully listening on port 7777...");
});