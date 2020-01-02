var express = require("express");
var router = express.Router();
//connect to db
var model = require("../model");
//photo
var multiparty = require("multiparty");
var fs = require('fs');

//add new essay / edit
router.post("/add", function(req, res, next) {
  var id= parseInt(req.body.id)
  if (id){
    var page =req.body.page
    var title =req.body.title 
    var content =req.body.content

    model.connect(function(db){
      db.collection('articles').updateOne({id: id},{$set: {
        title:title,
        content:content
      }},function(err,ret){
        if(err){
          console.log('EDIT FAILED', err);
        } else {
          console.log('Edit success');
          res.redirect('/?page='+page);
        }
      })
    })
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
          console.log("failed", err);
          res.redirect("/write");
        } else {
          res.redirect("/");
        }
      });
    });
  }
  
});

//delete essay
router.get('/delete',function(req,res,next){
  var id = parseInt(req.query.id)
  var page = req.query.page
  model.connect(function(db){
    db.collection('articles').deleteOne({id:id}, function(err, ret){
      if(err){
        console.log('delete failed');
      } else {
        console.log('delete success');
      }
      res.redirect('/?page='+page)
    })
  })
})

// photo upload
router.post('/upload', function(req, res, next){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files){
    if(err){
      console.log('upload fail',err);
    } else {
      console.log('file list', files)
      var file = files.filedata[0]

      var rs=fs.createReadStream(file.path);
      var newPath = '/uploads/' + file.originalFilename
      var ws=fs.createWriteStream('./public'+newPath);
      rs.pipe(ws)
      ws.on('close', function(){
        console.log('success')
        res.send({err:'', msg: newPath})
      })
    }
  })
})

module.exports = router;
