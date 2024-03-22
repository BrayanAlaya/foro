"use strict"

let mongoose = require("mongoose");

let userSquema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
})

userSquema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password;

    return obj
}

module.exports = mongoose.model("User", userSquema)
