var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articleRouter = require("./routes/article");

var app = express();

var socket = require("socket.io");
var server = app.listen(9000, function() {
  console.log("listening to requests on port 9000");
});

var io = socket(server);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session setup
//cited from https://www.npmjs.com/package/express-session
app.use(
  session({
    secret: "heqing",
    resave: false,
    saveUninitialized: true,
    //validation time length for 10 minurtes
    cookie: { maxAge: 1000 * 60 * 10 }
  })
);

//Login blocking
app.get("*", function(req, res, next) {
  //get session
  var username = req.session.username;
  var page = req.path;
  console.log("session", username);
  //locking nott include login and register
  if (page != "/login" && page != "/register") {
    if (!username) {
      res.redirect("/login");
    }
  }
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/article", articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//socket setup
io.on("connection", function(socket) {
  console.log("connection", socket.id);
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
});

module.exports = app;
