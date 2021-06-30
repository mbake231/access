const axios = require('axios');
const token = process.env.NODEBB_KEY;
const item = require('./item.js');
var my_scores=null;
function makeUser(user){
    console.log(user);

    var payload = 
    {
        "username":user.email
    }
        ;

    axios
        .post(process.env.FORUM_URL+'/api/v3/users?_uid=1', 
        payload,
            {
            headers: {
                Authorization: `Bearer ${token}`
                }
        })
        .then(res => {
            console.log("nodebb uid: "+res.data.uid);
        })
        .catch(error => {
            console.error(error)
        })

}

async function getHomeForumData(uid) {
    var data = {general:null,
                recent:null};

    await axios
        .get(process.env.FORUM_URL+'/api/recent?_uid='+uid, 
        
            {
            headers: {
                Authorization: `Bearer ${token}`
                }
        })
        .then(res => {

            data.recent=res.data;
           
        })
        .catch(error => {
            console.error(error)
        }).then(uid =>
            axios
            .get(process.env.FORUM_URL+'/api/category/1?_uid='+uid, 
            
                {
                headers: {
                    Authorization: `Bearer ${token}`
                    }
            })
            .then(res => {
                data.general=res.data;
                
            })
            .catch(error => {
                console.error(error)
            })
            


        )
        return data;
}

//This gets written reviews and adds scores
async function getWrittenReviews(tid,uid) {
    uid=0;
    var review_data = ["a"];
  //  var my_scores;
    
    await axios
    //get all the review posts for this item from nodebb reddis
        .get(process.env.FORUM_URL+'/api/topic/'+tid+'?_uid='+uid, 
        
            {
            headers: {
                Authorization: `Bearer ${token}`
                }
        })
        .then(async res => {
            Object.keys(res.data.posts).forEach(async ele => {

                
              //  console.log(res.data.posts[ele].content)
                var item_data = {post_id:res.data.posts[ele].pid,
                    review_text:res.data.posts[ele].content,
                    username:res.data.posts[ele].user.username,
                    timestamp:res.data.posts[ele].timestamp
                    }

                    //console.log(item_data)
                    await item.getReviewScores("4", item_data, function(score_data){
                        console.log(score_data);
                    });  
            })
        })
        .catch(error => {
            console.error(error)
        })
            


        
        return review_data;
}


exports.makeUser = makeUser;
exports.getHomeForumData = getHomeForumData;
exports.getWrittenReviews = getWrittenReviews;

