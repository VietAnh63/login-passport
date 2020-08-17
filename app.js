//import express
const express = require("express");
const app = express();
const session = require("express-session");
//import logger
const logger = require("morgan");

//config socketIO
const server = require("http").Server(app);
const io = require("socket.io")(server);

//import mongoose
const mongoClient = require("mongoose");

//import passport
const passport = require("passport");

mongoClient
  .connect("mongodb://localhost/testPassport", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ connect successfully…");
  })
  .catch((error) => {
    console.error(`❌ connect failed with error : ${error}`);
  });

//config Middlewares
app.use(logger("dev"));

//import comtroller
const adController = require("./controllers/admanager");

app.use(
  session({
    secret: "anhpv",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 3,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//import body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//import router
const routerManagerAd = require("./routes/ad_router");
app.use("/", routerManagerAd);

//import ejs
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.io = io;

const port = 3000;
server.listen(port, function () {
  console.log(`Server is running port ${port}`);
});

io.on("connection", function (socket) {
  console.log("server is connecting with " + socket.id);
  adController.changeAd(socket, io);
});
