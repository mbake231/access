var dbname = '';
var MongoPool = require("../mongo.js");

function setDbName() {
    if(process.env.NODE_ENV == 'production') {
        dbname=process.env.PROD_MOGNO_DB;
    }
    else {
		dbname=process.env.MONGO_DB;
    }
}
/*
async function getCheckLists (_id,cb) {
	setDbName();
	  MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbname);
		dbo.collection("Users").findOne({_id:ObjectId(_id)}, function(err, user) {
			if (err) throw err;
			return cb(user.checklists);
		});
	})
}
*/
async function getCheckLists (_id,cb) {
	setDbName();
	console.log('hi');
	MongoPool.getInstance(function (db) {
	//	if (err) throw err;
		var dbo = db.db(dbname);
		dbo.collection("Users").findOne({_id:ObjectId(_id)}, function(err, user) {
			if (err) throw err;
			return cb(user.checklists);
		});
	})
}

async function getList (_id,list_id,cb) {
	setDbName();
	
	MongoPool.getInstance(function (db) {
		var dbo = db.db(dbname);
		dbo.collection("Users").findOne({_id:ObjectId(_id)}, function(err, res) {
			if (err) throw err;
			//console.log(res.checklists);
			let lists = res.checklists;
			if(lists!=null) {
				for(var i=0;i<lists.length;i++)
					if(lists[0].list_id==list_id) {
						return cb(lists[i]); 

					}
			}	
		});
	})
}

async function getUser (_id,cb) {
	setDbName();
	MongoPool.getInstance(function (db) {
		var dbo = db.db(dbname);
		dbo.collection("Users").findOne({_id:ObjectId(_id)}, function(err, res) {
			if (err) throw err;
			//console.log(res);
			return cb(res);
				
		});
	})
}

async function getItems (_id,cb) {
	setDbName();
	MongoPool.getInstance(function (db) {
		var dbo = db.db(dbname);
		dbo.collection("Users").findOne({_id:ObjectId(_id)}, function(err, res) {
			if (err) throw err;
			//console.log(res.checklists);
			return res.items;				
		});
	})
}

    
exports.getCheckLists=getCheckLists;
exports.getList=getList;
exports.getItems=getItems;
exports.getUser=getUser;
