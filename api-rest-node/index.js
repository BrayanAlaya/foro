'use strict'

var mongoose = require("mongoose")
var port = process.env.PORT || 2500;

var app = require("./app");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/api-rest-node", { useNewUrlParser: true })
    .then(()=>{
        app.listen(port)
    })
    .catch(error => console.log(error))
