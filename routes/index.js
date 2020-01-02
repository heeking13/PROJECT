//This is the main js file of router of the project

var express = require("express");
var router = express.Router();
var model = require("../model");
var moment = require("moment");


/* GET home page. */
router.get("/", function(req, res, next) {
  //GET USERNAME SEND TO HOME PAGE
  var username = req.session.username;
  var page = req.query.page || 1;
  var data = {
    total: 0,
    curPage: page,
    list: []
  };
  var pageSize = 2;
  model.connect(function(db) {
    //query all eaasays
    db.collection("articles")
      .find()
      .toArray(function(err, docs) {
        console.log("essay list", err);
        data.total = Math.ceil(docs.length / pageSize);
        //query current page essay list
        model.connect(function(db) {
          db.collection("articles")
            .find()
            .sort({ _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .toArray(function(err, docs2) {

              if(docs2.length == 0){
                res.redirect('/?page='+((page-1) || 1))
              } else {
                docs2.map(function(ele, index) {
                  ele["time"] = moment(ele.id).format("DD/MM/YYYY HH:mm:ss");
                });
                data.list = docs2;
              }
              //Responsive client
              res.render("index", { username: username, data: data });
            });
        });
      });
  });
});

//render chatroom page
router.get("/chat",function(req, res, next){
  res.render("chat",{});
});


//render register page
router.get("/register", function(req, res, next) {
  res.render("register", {});
});

//render login page
router.get("/login", function(req, res, next) {
  res.render("login", {});
});

//resend write page
router.get("/write", function(req, res, next) {
  var username = req.session.username || "";
  var id = parseInt(req.query.id);
  var page = req.query.page;
  var item = {
    title:'',
    content:''
  }
  if(id){
    model.connect(function(db){
      db.collection('articles').findOne({id:id}, function(err,docs){
        if(err){
          console.log('query failed');
        } else {
          item = docs;
          item['page'] = page;
          res.render("write", { username: username, item:item });
        }
      })
    })
  } else {    
  res.render("write", { username: username, item:item });
  }
});

//render detail page
router.get("/detail", function(req, res, next) {
  var id = parseInt(req.query.id)
  var username = req.session.username || ""
  model.connect(function(db){
    db.collection('articles').findOne({id: id}, function(err, docs){
      if(err){
        console.log('query failed');
      } else {
        var item = docs;
        item['time'] = moment(item.id).format("DD/MM/YYYY HH:mm:ss");
        res.render("detail", {item: item, username: username});
      }
    })
  })
});

module.exports = router;
