var express = require("express");
var router = express.Router();
//connect to db
var model = require("../model");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

//register interface
router.post("/register", function(req, res, next) {
  //receieve parameters
  var data = {
    //send datas to the serve-side
    username: req.body.username,
    password: req.body.password,
    password1: req.body.password1
  };

  //define errors
  let errors = [];
  //data validation
  if (!req.body.username || !req.body.password || !req.body.password) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (req.body.password !== req.body.password1) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (req.body.username.length < 6) {
    errors.push({ msg: "Username length must more than 6" });
  }

  if (req.body.password.length < 6) {
    errors.push({ msg: "Password length must more than 6" });
  }

  // if has error, then input the data again
  if (errors.length > 0) {
    res.render("register", {
      errors,
      username: req.body.username,
      password: req.body.password,
      password1: req.body.password1
    });
  } else {
    //if input the correct data, will search fi there already have the same username
    model.connect(function(db) {
      var username = parseInt(req.body.username);
      db.collection("users")
        .findOne({ username: username })
        .then(user => {
          if (user) {
            errors.push({ msg: "Username already use" });
            res.render("register", {
              errors,
              username: req.body.username,
              password: req.body.password,
              password1: req.body.password1
            });
          } else {
            //if not, insert data to database
            db.collection("users").insertOne(data, function(err, ret) {
              if (err) {
                console.log("Failed");
                res.redirect("/register");
              } else {
                res.redirect("/login");
              }
            });
          }
        });
    });
  }
});

//login interface
router.post("/login", function(req, res, next) {
  //receieve user input data
  var data = {
    username: req.body.username,
    password: req.body.password
  };
  //define erroes
  let errors = [];
  if (!req.body.username || !req.body.password || !req.body.password) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("login", {
      errors,
      username: req.body.username,
      password: req.body.password
    });
  } else {
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
  }

  console.log("login successfuly", data);
});

//logout interface
router.get("/logout", function(req, res, next) {
  req.session.username = null;
  res.redirect("/login");
});

module.exports = router;
