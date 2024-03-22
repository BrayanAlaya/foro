'use strict'

let express = require("express");

let topicController = require("../controllers/topic");
let jwtAuth = require('../middlewares/authenticated')

let router = express.Router();

router.post("/topic", jwtAuth.authenticated ,topicController.save)
router.post("/topic/:id", jwtAuth.authenticated ,topicController.updateTopic)
router.delete("/topic/:id", jwtAuth.authenticated, topicController.deleteTopic)

router.get("/topics/:page", topicController.getTopics)
router.get("/user/topic/:id", topicController.getTopicsByUser)
router.get("/topic/:id", topicController.getTopic)
router.get("/search/topic/:search", topicController.searchTopic)

module.exports = router;