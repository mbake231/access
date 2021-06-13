var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_FULL_URL;
var dbname='';

function setDbName() {
    if(process.env.NODE_ENV == 'production') {
        dbname=process.env.PROD_MOGNO_DB;
    }
    else {
		dbname=process.env.MONGO_DB;
    }
}

var option = {
  db:{
    numberOfRetries : 5
  },
  server: {
    auto_reconnect: true,
    poolSize : 40,
    socketOptions: {
        connectTimeoutMS: 500
    }
  },
  replSet: {},
  mongos: {}
};

function MongoPool(){}

var p_db;

function initPool(cb){
  MongoClient.connect(url, {useUnifiedTopology: true,useNewUrlParser: true }, function(err, db) {
    if (err) throw err;

    p_db = db;
    if(cb && typeof(cb) == 'function')
        cb(p_db);
  });
  return MongoPool;
}

MongoPool.initPool = initPool;

function getInstance(cb){
  if(!p_db){
    initPool(cb)
  }
  else{
    if(cb && typeof(cb) == 'function')
      cb(p_db);
  }
}
MongoPool.getInstance = getInstance;

module.exports = MongoPool;