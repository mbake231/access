const axios = require('axios');
const token = process.env.NODEBB_KEY;
const item = require('./item.js');
var my_scores = null;
var MongoPool = require("./mongo.js");

async function makeUser(user,done) {
    console.log(user);

    var payload = {
        "username": user.email
    };

    axios
        .post(process.env.FORUM_URL + '/api/v3/users?_uid=1',
            payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        .then(res => {
            console.log(res.data.response.uid);
            return done(res.data.response.uid);
        })
        .catch(error => {
            console.error(error)
        })

}

async function postReview(nodebb_uid,review_package,done) {
    var payload = {
        "cid":review_package.cid,
        "title":review_package.review_title,
        "content":review_package.review_body,
        "tags":[review_package.review_type]
    };

    await axios
        .post(process.env.FORUM_URL + '/api/v3/topics/?_uid='+nodebb_uid,
            payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        .then(res => {
            return done(res.data.response.tid);
        })
        .catch(error => {
            console.error(error)
        })

}

async function createReviewCategory(place_id,done) {

    await item.getPlacesInfo(place_id, async function (res){
        var payload = {
            "name": res.name+" /\ "+res.place_id,
            "description":res.place_id
        };
    
        await axios
            .post(process.env.FORUM_URL + '/api/v3/categories?_uid=1',
                payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            .then(res => {
                return done(res.data.response.cid);
            })
            .catch(error => {
                console.error(error)
            })
    })
    

}

async function getRecentReviews(uid,done) {
    var data = {
        general: null,
        recent: null
    };

    await axios
        .get(process.env.FORUM_URL + '/api/recent?_uid=' + uid,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        .then(res => {
            //only return 10 topics
            data.recent = res.data.topics.slice(0,9);
            return done(data.recent);
           // return true;
            console.log('This wont print because i am short ciruting everything below')

        })
        .catch(error => {
            console.error(error)
        })
        
        /*.then( async () => {
            
            //for each topic look up cid in mongo item get the place_id and then add the right data we need from google
           // Object.keys(data.recent).forEach(async (ele) => {
                //  look up place_id in mongo
                await MongoPool.getInstance(function (db) {
                    //MongoPool.connect(url, function (err, db) {
                    var dbo = null;
            
                    if (process.env.NODE_ENV == "production") {
                        dbo = db.db(process.env.PROD_MOGNO_DB);
            
                    } else {
                        dbo = db.db(process.env.MONGO_DB);
            
                    }
                    
                 const googlename = async (cid,cb) => dbo.collection("items").findOne({
                        review_cid: cid
                    }, async function (err, res) {
                        if (err) throw err;
                        try {
                            if(res) {
                                //console.log("found it!")
                                
                                //return done(res);
                                //now get the google places id
                                await item.getPlacesInfo(res.place_id,function(google_data){
                                    //data.recent[ele]["googleName"]=google_data.name;
                                     return cb(google_data.name);
                                });
                            }
                            else
                               // console.log('not found')
                                 return cb(null);
                        } catch (e) {
                            console.log(e);
                            //return done(e);
                        }
                        
                      //  db.close();
                    });
                    //data.recent[ele]["googleName"]=googlename();
                    //i am trying to call googlename n times to add in google name to the thing
                    var dataPackage = [];
                    var ctr=data.recent.length;
                    const package = (dp,cb) => Object.keys(dp).forEach(async (ele)=>{                        
                        var cid=dp[ele].cid;
                        const result = cb => googlename(cid,function (resp) {
                            
                            cb(resp);  
                        
                        });
                        result(function(res){
                            if(res===null)
                                res='Name not found via Google Places.';
                            dp[ele]['googleName']=res
                            //console.log(dp)
                        })
                        ctr--;
                        if(ctr===0){
                            return cb(dp)
                        }
                    })
                  //  console.log(dataPackage)
                    
                    package(data.recent, function(result){
                       // console.log(result)
                        return done(result);
                    })

                })
                
                
           // })
           // console.log(data);
           // return done(data);
        })
    */
}

//This gets written reviews and adds scores
async function getWrittenReviews(cid, uid,done) {
    //setting this to zero because nodebb demands a uid i think its okay to leave 0 tho
    uid = 0;
    var review_data = [];
    //  var my_scores;

    await axios
        //get all the review posts for this item from nodebb reddis
        .get(process.env.FORUM_URL + '/api/category/' + cid + '?_uid=' + uid,
            {headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        .then(async res => {
            var reviews = [];
            Object.keys(res.data.topics).forEach(async (ele) => {
                  console.log(res.data.topics[ele])
                
                reviews.unshift ( {
                    topic_id: res.data.topics[ele].tid,
                    review_title: res.data.topics[ele].title,
                    review_body: res.data.topics[ele].title,
                    username: res.data.topics[ele].user.username,
                    timestamp: res.data.topics[ele].timestamp,
                    scores: {
                        post_id: 4,
                        food: 89,
                        rooms: 94,
                        service: 43
                    }
                })
            })
            return done(reviews);
            /*NEED TO FIX THIS MARRIAGE OF SCORES AND TEXT REVIEWS
            var ctr=res.data.posts.length;
            Object.keys(res.data.posts).forEach(async (ele) => {
                //  console.log(res.data.posts[ele].content)
                var item_data = {
                    post_id: res.data.posts[ele].pid,
                    review_text: res.data.posts[ele].content,
                    username: res.data.posts[ele].user.username,
                    timestamp: res.data.posts[ele].timestamp
                }
                //console.log(item_data)
                const getItemDetail = async cb => await item.getReviewScores("4", item_data, function (score_data) {
                    //review_data.push(score_data);
                     cb(score_data);
                    
                });
                 getItemDetail(function(output){
                    review_data.push(output); 
                })
            })
            return done("test"+review_data);
            */
        })
        .catch(error => {
            console.error(error)
        })
}


exports.makeUser = makeUser;
exports.getRecentReviews = getRecentReviews;
exports.getWrittenReviews = getWrittenReviews;
exports.createReviewCategory = createReviewCategory;
exports.postReview = postReview;