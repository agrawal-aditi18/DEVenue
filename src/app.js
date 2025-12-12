const express = require("express");
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");
const http = require("http");
require("dotenv").config();


app.use(
  cors({
    //whitelisting the origin..
    //from where my frontend is hosted-
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



app.use(express.json()); //now this middleware is activated for all the routes to convert the json data into js obj
app.use(cookieParser()); //middleware to parse cookie and get accessable

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" ,  requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err.message);
  });
