//Date: 20/12/2019
//This file is about the operation of mongoDB

// cited from https://www.npmjs.com/package/mongodb
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
var database = "project"; //connect the database "report"

// Use connect method to connect to the server
function connect(callback) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log("Databse connected failed", err);
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
