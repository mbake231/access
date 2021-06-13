const axios = require('axios');
const token = process.env.NODEBB_KEY;

function makeUser(user){
    console.log(user);

    var payload = 
    {
        "username":user.email
    }
        ;

    axios
        .post('http://localhost/forum/api/v3/users?_uid=1', 
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
        .get('http://localhost/forum/api/recent?_uid='+uid, 
        
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
            .get('http://localhost/forum/api/category/1?_uid='+uid, 
            
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


exports.makeUser = makeUser;
exports.getHomeForumData = getHomeForumData;
