var MongoPool = require("./mongo.js");
const axios = require('axios')
const nodebb = require('./nodebb.js');
const exj = require ('./google_eg.json');

var item_details = {name:null,address:null,photos:[],website:null,review_tid:null,rating:null,reviews:[]}

async function buildItem (id,done) {

    //GO to mongo to get topicID
    await findItemData(id, function(mongo_data){
        if(mongo_data){
            item_details.review_tid = mongo_data.review_tid;
        }
    });
    

   await getPlacesInfo(id, function(google_data) {
    //Go to google to get places data
    if(google_data) {
        //console.log(google_data)
        item_details.name=google_data.name;
        item_details.address=google_data.formatted_address;
        item_details.website=google_data.website;
        if(google_data.photos[0].photo_reference)
           item_details.photos.push(google_data.photos[0].photo_reference)
        if(google_data.photos[1].photo_reference)
           item_details.photos.push(google_data.photos[1].photo_reference);
        if(google_data.photos[2].photo_reference)
           item_details.photos.push(google_data.photos[2].photo_reference);

    }
    });
    //Go to nodebb to get all the reviews- it will also return scores
    if(item_details.review_tid)
        item_details.reviews.push(await nodebb.getWrittenReviews(item_details.review_tid));
    else
        console.log('')
    console.log(JSON.stringify(item_details))
    done(item_details)

}

async function getPlacesInfo  (id,done) {

    try{
    const res = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJjT56loFMr4YR-I3fXckHS2Y&key=AIzaSyC05tPzPeNGHpVEUu0PyyiVokuJ0G1Q7cI'
           )
           if(res.data.result.place_id) {
                done(res.data.result);
                
                //console.log(item_details)
            }
           } 
         catch (err) {
         // next(err)
        } 
}

async function findItemData (pid, done) {
       
     await MongoPool.getInstance(function (db) {
        //MongoPool.connect(url, function (err, db) {
        var dbo = null;

        if (process.env.NODE_ENV == "production") {
            dbo = db.db(process.env.PROD_MOGNO_DB);

        } else {
            dbo = db.db(process.env.MONGO_DB);

        }
     dbo.collection("items").findOne({
            place_id: pid
        }, async function (err, res) {
            if (err) throw err;
            try {
                if(res) {
                  //  console.log("found it!")
                    return done(res);
                }
                else
                    console.log('not found')
            } catch (e) {
                console.log(e);
                return done(e);
            }
            
          //  db.close();
        });
    })
}

async function getReviewScores (post_id, item_data, done) {
    
    await MongoPool.getInstance(function (db) {
       //MongoPool.connect(url, function (err, db) {
       var dbo = null;

       if (process.env.NODE_ENV == "production") {
           dbo = db.db(process.env.PROD_MOGNO_DB);

       } else {
           dbo = db.db(process.env.MONGO_DB);

       }
     dbo.collection("reviews").findOne({
           post_id: post_id
       }, async function (err, res) {
           if (err) throw err;
           try {
               if(res) {
                  // console.log("found it!")
                  // console.log(res)
                  item_data.another='scores';
                  item_data.scores=res;
                   return done(item_data);
               }
               else
                   console.log('not found')
           } catch (e) {
               console.log(e);
               return done(e);
           }
           
          // db.close();
       });
   })
}



exports.getPlacesInfo = getPlacesInfo;
exports.findItemData = findItemData;
exports.buildItem = buildItem;
exports.getReviewScores = getReviewScores;