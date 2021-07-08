const axios = require('axios');
const token = process.env.NODEBB_KEY;
const item = require('./item.js');

//this makea a new user in nodebb
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
//this posts the review to the right category and saves the review details in mongo
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
//this creates a new category for each time someone looks up a new location
async function createReviewCategory(place_id,done) {

    await item.getPlacesInfo(place_id, async function (res){
        var payload = {
            "name": res.name+" /\ "+res.place_id,
            "description":res.place_id,
            "cloneFromCid": '5'
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
//this gets recent topics across all categories
async function getRecentReviews(uid,done) {
    uid=1;
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
}

//get reviews from a certain user
async function getMyReviews(username,done) {
    uid=1;
    var data = [];

    await axios
        .get(process.env.FORUM_URL + '/api/user/'+username+'/topics?_uid=' + uid,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        .then(res => {
            //only return 10 topics
            console.log(res.data.topics[0].tags)
            res.data.topics.map((item) => {
                if(item.tags[0].value==='client' || item.tags[0].value==='advisor') {
                    data.push(item);
                }
            })

            return done(data);
           // return true;
            console.log('This wont print because i am short ciruting everything below')

        })
        .catch(error => {
            console.error(error)
        })
}

//This gets written reviews and adds scores
async function getWrittenReviews(cid, uid,done) {
    //setting this to zero because nodebb demands a uid i think its okay to leave 0 tho
    uid = 1;
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
                 // console.log(res.data.topics[ele])
                
                reviews.unshift ( {
                    topic_id: res.data.topics[ele].tid,
                    review_title: res.data.topics[ele].title,
                    //this needs to come from nodebb endpoint 
                    review_body: res.data.topics[ele].title,
                    username: res.data.topics[ele].user.username,
                    timestamp: res.data.topics[ele].timestamp,
                    //this needs to come from mongo
                    scores: {
                        
                    }
                })
            })

            return done(reviews);
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
exports.getMyReviews = getMyReviews;