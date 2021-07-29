var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var MongoPool = require("./mongo.js");


var dbname = '';
var url;
if (process.env.NODE_ENV == 'production') {
    url = process.env.ORMONGO_URL; 
} else {
    url = process.env.MONGODB_URI || process.env.MONGO_FULL_URL;

}

const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

ObjectId = require('mongodb').ObjectID;

function initialize(passport, getUserByEmail, getUserById) {
    if (process.env.NODE_ENV == 'production') {
        dbname = process.env.PROD_MOGNO_DB;
    } else {
        dbname = process.env.MONGO_DB;
    }

    const authenticateUser = async (email, password, done) => {
       
        MongoPool.getInstance(function (db) {
            //MongoPool.connect(url, function (err, db) {
                console.log(email)
            var dbo = null;

            if (process.env.NODE_ENV == "production") {
                dbo = db.db(process.env.PROD_MOGNO_DB);

            } else {
                dbo = db.db(process.env.MONGO_DB);

            }
            dbo.collection("Users").findOne({
                email: email
            }, async function (err, user) {
                if (err) throw err;
                if (user == null) {
                    return done(null, false, {
                        message: "No user with that email"
                    })
                }
                try {
                    if (await bcrypt.compare(password, user.password)) {
                       
                        return done(null, user)
                    } else {
                        return done(null, false, {
                            message: 'Password incorrect'
                        })
                    }
                } catch (e) {
                    return done(e);
                }
              //  db.close();
            });
        })
    }
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, authenticateUser));
    try {

        passport.serializeUser((user, done) => {

                done(null, user._id)
            }


        );

    } catch (e) {
        console.log(e);
    }

    passport.deserializeUser((id, done) => {
        //return done(null, function (id) {
        MongoPool.getInstance(function (db) {
        //MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbname);
            dbo.collection("Users").findOne({
                "_id": ObjectId(id)
            }, function (err, result) {
                if (err) throw err;
                //  console.log("Successfully deserailized:"+result._id);
             //   db.close();
                return done(null, result);
                
            });
        })

        //})
    })


}
module.exports = initialize