//Date: 20/12/2019
//This file is about the operation of mongoDB

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
var database = "project";

//Encapsulation the database link method
function connect(callback) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log("connected fail", err);
    } else {
      var db = client.db(database);
      callback && callback(db);
      client.close();
    }
  });
}

module.exports = {
  connect
};
