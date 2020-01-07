var express = require("express");
var router = express.Router();
//connect to db
var model = require("../model");
//photo
var multiparty = require("multiparty");
var fs = require("fs");

//add new essay / edit
router.post("/add", function(req, res, next) {
  var id = parseInt(req.body.id);
  //if id exist , is edit report
  if (id) {
    var page = req.body.page;
    var title = req.body.title;
    var content = req.body.content;
    model.connect(function(db) {
      db.collection("articles").updateOne(
        { id: id },
        {
          $set: {
            title: title,
            content: content
          }
        },
        function(err, ret) {
          if (err) {
            console.log("EDIT FAILED", err);
          } else {
            console.log("Edit success");
            res.redirect("/?page=" + page);
          }
        }
      );
    });
  } else {
    var data = {
      title: req.body.title,
      content: req.body.content,
      id: Date.now(),
      username: req.session.username
    };
    model.connect(function(db) {
      db.collection("articles").insertOne(data, function(err, ret) {
        if (err) {
          console.log("Write report failed", err);
          res.redirect("/write");
        } else {
          res.redirect("/");
        }
      });
    });
  }
});

//delete essay
router.get("/delete", function(req, res, next) {
  var id = parseInt(req.query.id);
  var page = req.query.page; // the current page of report
  model.connect(function(db) {
    db.collection("articles").deleteOne({ id: id }, function(err, ret) {
      if (err) {
        console.log("delete failed");
      } else {
        console.log("delete success");
      }
      res.redirect("/?page=" + page);
    });
  });
});

// photo upload router
router.post("/upload", function(req, res, next) {
  //cited from https://www.npmjs.com/package/multiparty
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log("Upload failed", err);
    } else {
      console.log("File list", files);
      var file = files.filedata[0];
      var rs = fs.createReadStream(file.path);
      var newPath = "/uploads/" + file.originalFilename;
      var ws = fs.createWriteStream("./public" + newPath);
      rs.pipe(ws);
      ws.on("close", function() {
        console.log("Photo upload success");
        res.send({ err: "", msg: newPath });
      });
    }
  });
});

module.exports = router;
