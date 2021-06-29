const axios = require('axios');
const token = process.env.NODEBB_KEY;
const item = require('./item.js');

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
    var review_data = [];
    
    await axios
    //get all the review posts for this item from nodebb reddis
        .get(process.env.FORUM_URL+'/api/topic/'+tid+'?_uid='+uid, 
        
            {
            headers: {
                Authorization: `Bearer ${token}`
                }
        })
        .then(async res => {
            var ctr=0;
            //now we need to step through all the posts from nodebb so we can add in the scores that are stored in mongo
            while(ctr<res.data.posts.length) {
                
                
                //add numberical review data, we will just pass post_id 4 for now for testing
                //res.data.posts[i].pid
                await item.getReviewScores("4", function(score_data){
                
                console.log("here"+ctr)
                console.log('leng'+res.data.posts.length);
                //create the API response with all the data needed from reddis and mongo
                    review_data.push({post_id:res.data.posts[ctr].pid,
                        review_text:res.data.posts[ctr].content,
                        username:res.data.posts[ctr].user.username,
                        timestamp:res.data.posts[ctr].timestamp,
                        scores:score_data
                        });
                        
                }).then( () => {
                    console.log('ohai')
                    ctr++;})                
            }
        })
        .catch(error => {
            console.error(error)
        })
            


        
        return review_data;
}


exports.makeUser = makeUser;
exports.getHomeForumData = getHomeForumData;
exports.getWrittenReviews = getWrittenReviews;

