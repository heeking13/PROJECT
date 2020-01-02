var express = require("express");
var router = express.Router();
//connect to db
var model = require("../model");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

// login interface
router.post("/register", function(req, res, next) {
  //receieve parameters
  var data = {
    //send datas to the serve-side
    username: req.body.username,
    password: req.body.password,
    password1: req.body.password1
  };

  //inesert data
  //data validation
  model.connect(function(db) {
    db.collection("users").insertOne(data, function(err, ret) {
      if (err) {
        console.log("Failed");
        res.redirect("/register");
      } else {
        res.redirect("/login");
      }
    });
  });
});

//login interface
router.post("/login", function(req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password
  };
  //serarch data
  model.connect(function(db) {
    db.collection("users")
      .find(data)
      .toArray(function(err, docs) {
        if (err) {
          res.redirect("/login");
        } else {
          if (docs.length > 0) {
            //login successfully, session store
            req.session.username = data.username;
            res.redirect("/");
          } else {
            res.redirect("/login");
          }
        }
      });
  });
  console.log("login successfuly", data);
});

//logout interface
router.get("/logout", function(req, res, next) {
  req.session.username = null;
  res.redirect("/login");
});

module.exports = router;
