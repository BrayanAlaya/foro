"use strict"

var express = require("express");
var bodyParser = require("body-parser");

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(function (req, res) {
//     res.setHeader('Content-Type', 'text/plain')
//     res.write('you posted:\n')
//     res.end(JSON.stringify(req.body, null, 2))
//   })

var userRoutes = require("./routes/user");
var topicRouters = require("./routes/topic");
var commentRouters = require("./routes/comment") ;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use("/api", userRoutes);
app.use("/api", topicRouters);
app.use("/api", commentRouters);

module.exports = app;
