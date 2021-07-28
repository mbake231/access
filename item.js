var MongoPool = require("./mongo.js");
const axios = require('axios')
const nodebb = require('./nodebb.js');
const exj = require ('./google_eg.json');


async function createItemPage(place_id,done) {
    //create cat for it
    await nodebb.createReviewCategory(place_id, function (cid){
        MongoPool.getInstance(function (db) {
            var dbo = null;
            if (process.env.NODE_ENV == "production") {
              dbo = db.db(process.env.PROD_MOGNO_DB);
            } else {
              dbo = db.db(process.env.MONGO_DB);
            }
            dbo
              .collection("items")
              .findOne({
                place_id: place_id,
              }, function (err, res) {
                try {
                  if (res == null) {
                      console.log('item not found, creating')
                    var review = {
                      place_id: place_id,
                      review_cid: cid
                    };
                    dbo
                      .collection("items")
                      .insertOne(review, function (err, result) {
                        if (err) throw err;
                        console.log("Inserted: " + result);
                        //scope.send(result);
                        return done(cid);
                      });
                  } else {
                    console.log("Item with that place_id already exists");
                    return scope.status(400).send({
                      message: "That id already exists.",
                    });
                  }
                } catch {
                  //console.log(err);
                }
              });
          });

    })
}

async function buildItem (id,done) {
    var item_details = {name:null,address:null,photos:[],website:null,review_tid:null,rating:null,reviews:[]}

    //GO to mongo to see what categories id maps to the google places id, and if none found make a new item page
    await findItemData(id, async function(mongo_data){
        
        if(mongo_data){
            item_details.review_cid = mongo_data.review_cid;
        }
        else
            await createItemPage(id, function(cid){
              item_details.review_cid=cid;
            });        
    });
    //Go get the google details for the item page
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
/* 
    item_details.reviews = [{
        "post_id": "6",
        "review_text": "<p dir=auto>sucked ass</p>\n",
        "username": "admin",
        "timestamp": "1624895714362",
        "another": "scores",
        "scores": {
            "_id": "60d9da93241c7a89e349c458",
            "post_id": "4",
            "food": "89",
            "rooms": "94",
            "service": "43"
        }
      }]
*/
    //Go to nodebb to get all the reviews- go to mongo to get the scores
    await nodebb.getWrittenReviews(item_details.review_cid,'1', async function(review_data){
        if(review_data){
            item_details.reviews = review_data;
            // cb(true);
        }
    });


    await getReviewScores(item_details.review_cid, async function(scores){
            for(var i=0;i<scores.length;i++){
                for(var p=0;p<item_details.reviews.length;p++){
                    if(scores[i].topic_id==item_details.reviews[p].topic_id) {
                        item_details.reviews[p].scores=scores[i];
                    }
                }
            }      
        });

        setTimeout(function () {
            var ctr=0; 

            if(ctr!=0)
                console.log(item_details)
                return done(item_details)
            ctr++;
        }, 500);
        
        /*console.log(as2());
        try {
            const fart = await as2();
            console.log(fart);
        } catch(e) {
            console.error(e)
        }

        var as1done = false;
        var as2done = false;

        await as1(async function(done){
            if(done) {
                as1done=true;
              //  console.log(as1done)
             await as2(function(donetwo){
                if(donetwo){
                    as2done=true; 
                  //  console.log(as2done)
                }
            })
        }
        }).then(console.log(item_details))
      */
        //while(!as1done&&!as2done)
          //  console.log('waiting')
      //  console.log(item_details)

}
//fetch from google palces
async function getPlacesInfo  (id,done) {
    try{
    const res = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json?place_id='+id+'&key=AIzaSyC05tPzPeNGHpVEUu0PyyiVokuJ0G1Q7cI'
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
//get item from mongo via google places id
async function findItemData (place_id, done) {
     await MongoPool.getInstance(function (db) {
        //MongoPool.connect(url, function (err, db) {
        var dbo = null;

        if (process.env.NODE_ENV == "production") {
            dbo = db.db(process.env.PROD_MOGNO_DB);

        } else {
            dbo = db.db(process.env.MONGO_DB);

        }
     dbo.collection("items").findOne({
            place_id: place_id
        }, async function (err, res) {
            if (err) throw err;
            try {
                if(res) {
                  //  console.log("found it!")
                    return done(res);
                }
                else
                    console.log('not found')
                    return done(null);
            } catch (e) {
                console.log(e);
                return done(e);
            }
            
          //  db.close();
        });
    })
}
//get the scores 
async function getReviewScores (cid, done) {
    var scores=[];
    await MongoPool.getInstance(async function (db) {
       //MongoPool.connect(url, function (err, db) {
       var dbo = null;

       if (process.env.NODE_ENV == "production") {
           dbo = db.db(process.env.PROD_MOGNO_DB);

       } else {
           dbo = db.db(process.env.MONGO_DB);

       }
       
      await dbo.collection("reviews").find({cid:cid}).forEach(async function(item){ 
          // if (err) throw err;
    
           try {
               if(item) {
                   scores.push(item);
                  
                   //return done(item_data);
               }
               else
                   console.log('not found')
           } catch (e) {
               console.log(e);
               return done(e);
           }
           
          // db.close();
       });
       
       return done(scores);
   })
}

//add a new review to mongo and to nodebb
async function createReview(nodebb_uid, review_package) {
    MongoPool.getInstance(function (db) {
        var dbo = null;
        if (process.env.NODE_ENV == "production") {
          dbo = db.db(process.env.PROD_MOGNO_DB);
        } else {
          dbo = db.db(process.env.MONGO_DB);
        }
        dbo
          .collection("items")
          .findOne({
            place_id: review_package.item_id
          }, async function (err, res) {
            try {
              if (res) {
                var cid = res.review_cid;
                await nodebb.postReview(nodebb_uid,review_package, function(topic_id){
                    review_package['topic_id']=topic_id;
                    var payload = review_package
                     dbo
                  .collection("reviews")
                  .insertOne(payload, function (err, result) {
                    if (err) throw err;
                    else
                    console.log("Inserted: " + result);
                    
                  //  db.close();
                   
                  }); 
                })
                
           
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
}


exports.getPlacesInfo = getPlacesInfo;
exports.findItemData = findItemData;
exports.buildItem = buildItem;
exports.getReviewScores = getReviewScores;
exports.createReview = createReview;