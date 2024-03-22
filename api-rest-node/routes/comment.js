"use strict"

let express = require("express")
let commentController = require("../controllers/comment")
let jwtAuth = require("../middlewares/authenticated")

let routes = express.Router()

routes.post("/comment/topic/:id", jwtAuth.authenticated ,commentController.save)
routes.post("/comment/:id",jwtAuth.authenticated ,commentController.updateComment)
routes.delete("/comment/:commentId/:topicId", jwtAuth.authenticated , commentController.deleteComment)

module.exports = routes