//var MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const path = require("path");
const express = require("express");
var bodyParser = require("body-parser");
const nodebb = require('./nodebb.js'); // create express app
const user = require('./user.js'); // create express app
const cookieParser = require('cookie-parser')
var cors = require("cors");
var mongo = require("mongodb");
const passport = require("passport");
const port = process.env.PORT || 3000; // Heroku will need the PORT environment variable
const helmet = require("helmet");
//var initializePassport = require("./passport.js");
const hpp = require("hpp");
const bcrypt = require('bcrypt');
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
const jwt = require('jsonwebtoken');
const app = express(); // create express app
var MongoPool = require("./mongo.js");
var sessionStore = new MongoStore({
  url: process.env.MONGODB_FULL_URL || process.env.MONGO_FULL_URL,
});
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(helmet());
app.use(hpp());


require("./mongo.js").initPool();

app.set('trust proxy', 1);
//app.use(express.static("client/build"));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/build')));



/* Set Cookie Settings */

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    store: sessionStore,
    key: "connect.sid",
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false, maxAge: 24 * 60 * 60 * 1000},
    proxy: true,
    domain:'localhost'
  })
);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



app.use(function (req, res, next) {
  if (req.secure) {
    // request was via http, so do no special handling
    res.redirect("http://" + req.headers.host + req.url);
  } else {
    // request was via http, so do no special handling
    next();
  }
});

app.use(passport.initialize());
app.use(passport.session());
require('./passport.js')(passport);


//sign tokens for nodebb session sharing
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

// start express server on port 5000
app.listen(port, () => console.log(`App is live on port ${port}!`));





app.post("/login", function (req, res, next) {
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    console.log("logged in", req);
    var userInfo = {
      username: req.user._id,
    };
    //generate token for session sharing
    console.log(req.user.email);
    const token = generateAccessToken({ id:req.user._id, username: req.user.email });
    console.log(token);
    res.json(token);
    //res.send(userInfo);
    res.end();
  }
);

app.post("/register", async (req, res) => {
  try {
    if (req.body.password == req.body.confirmpassword) {
      if (req.body.password.length > 5) {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashedPassword);
        const scope = res;

        MongoPool.getInstance(function (db) {
          //MongoPool.connect(url, function (err, db) {

          var dbo = null;

          if (process.env.NODE_ENV == "production") {
            dbo = db.db(process.env.PROD_MOGNO_DB);

          } else {
            dbo = db.db(process.env.MONGO_DB);

          }
          console.log(req.body.email)
          dbo
            .collection("Users")
            .findOne({
              email: req.body.email
            }, function (err, res) {
              try {
                if (res == null) {

                  var user = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    nodebb_uid: null
                  };
                  dbo
                    .collection("Users")
                    .insertOne(user, function (err, result) {
                      if (err) throw err;
                      console.log("Inserted: " + result);
                      scope.send(result);
                      db.close();
                      nodebb.makeUser(user);
                    });
                } else {
                  console.log("User with that email already exists");
                  return scope.status(400).send({
                    message: "That email already exists.",
                  });
                }
              } catch {
                //console.log(err);
              }
            });
        });
      } else {
        console.log("password needs to be 6 characters");
        return res.status(400).send({
          message: "Password too short.",
        });
      }
    } else {
      console.log("passwords dont match");
      return res.status(400).send({
        message: "Passwords don't match.",
      });
    }
  } catch {
    res.redirect("/register");
  }
});

app.post("/logout", async (req, res) => {
  console.log('logout');
  await req.logout();
  req.session = null;
  res.clearCookie("connect.sid");
  return res.redirect("/");
});

app.post("/user", (req, res) => {
  if( req.user) {
      res.send(user.getUser());
      res.end();
  }
  else {
    //res.redirect('/login');
  }
});

app.post("/home", async (req, res) => {
  console.log(req.body.uid);
  if( req.user) {
    var data = JSON.stringify(await nodebb.getHomeForumData(req.user.uid));
    res.json(data);
    res.end();
  }
  else {
    res.redirect('/login');
  }
});


