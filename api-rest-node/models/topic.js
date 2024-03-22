"use strict"

let mongoose = require("mongoose");
let pagination = require("mongoose-paginate-v2");

let commentSchema = mongoose.Schema({
    content: String,
    date: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.ObjectId , ref: "User"}   
})

let commentModel = mongoose.model("Comment", commentSchema);

let topicSchema = mongoose.Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.ObjectId, ref: "User"},
    comments: [commentSchema]
})

//cargar paginacion con (moongose pagination)
topicSchema.plugin(pagination);


module.exports = mongoose.model("Topic", topicSchema);

