'use strict'

let Topic = require("../models/topic");
let validator = require("validator");

let controller = {

    save: async (req, res) => {

        let params = req.body;

        let data = {}

        try {

            var titleValidator = !validator.isEmpty(params.title)
            var contentValidator = !validator.isEmpty(params.content)

            if (titleValidator && contentValidator) {

                let user = req.user
                let topic = new Topic({ title: params.title, content: params.content, code: params.code, lang: params.lang, user: user.id });

                let result = await topic.save()

                if (result) {
                    data = { code: 200, topic: result }
                } else {
                    data = { code: 500, messege: "Hubo un error al guardar" }
                }

            } else {
                data = { code: 500, messege: "Hubo un error con la validacion" }
            }

        } catch (error) {

            data = { code: 500, messege: "An error has ocurred" }

        }


        return res.json(data)
    },

    getTopics: (req, res) => {

        let data = {}

        let page = req.params.page


        if (page && validator.isInt(page) && page != 0) {
            data = parseInt(page)
        } else {
            page = 1
        }

        var options = {
            sort: { date: -1 },
            populate: ["user", "comments.user"],
            page: page,
            limit: 3
        }

        Topic.paginate({}, options, (err, topics) => {

            if (err) {
                data = { code: 500, messege: "An error has ocurred" }
            } else {

                if (topics.docs.length > 0) {

                    data = { code: 200, topics: topics.docs, totalPages: topics.totalPages, page: topics.page }

                } else {
                    data = { code: 404, messege: "There's no topics" }
                }
            }

            return res.json(data)
        })

    },

    getTopicsByUser: async (req, res) => {

        let data = {}

        try {
            let topics = await Topic.find({ user: req.params.id }).sort({ date: -1 }).exec()

            if (topics.length > 0) {
                data = { code: 200, topics: topics }
            } else {
                data = { code: 404, messege: "Thers's no topics" }
            }

        } catch (error) {
            data = { code: 500, messege: "An error has ocurred" }
        }


        return res.json(data)
    },

    getTopic: async (req, res) => {

        let data = {}
        let topicId = req.params.id

        try {

            let topic = await Topic.findById(topicId).populate("user").exec();

            if (topic) {
                data = { code: 200, topic: topic }
            } else {
                data = { code: 404, messege: "Theres's no topic" }
            }

        } catch (error) {
            data = { code: 500, messege: "An error has ocurred" }
        }

        return res.json(data)
    },

    updateTopic: async (req, res) => {

        let topiId = req.params.id
        let params = req.body
        let user = req.user
        let data = {}

        try {

            let validateTilte = !validator.isEmpty(params.title)
            let validateContent = !validator.isEmpty(params.content)
    
            if (validateTilte && validateContent) {

                let update = {
                    title: params.title,
                    content: params.content,
                    code: params.code,
                    lang: params.lang,
                }

                let result = await Topic.findOneAndUpdate({ _id: topiId, user: user.id }, update, { new: true })

                if (result) {
                    data = { code: 200, topic: result }
                } else {
                    data = { code: 200, topic: result }
                }

            } else {
                data = { code: 404, messege: "Validation Error" }
            }

        } catch (error) {
            data = { code: 500, messege: "An error Has occured" }
        }

        return res.json(data)
    },

    deleteTopic: async (req, res) => {

        let topicId = req.params.id;
        let data = {}
        let user = req.user

        try {

            let result = await Topic.deleteOne({ _id: topicId, user: user.id })

            if (result.deletedCount != 0) {

                data = { code: 200, messege: "The topic has been deleted" }

            } else {

                data = { code: 404, messege: "Error when deleting" }

            }

        } catch (error) {

            data = { code: 500, messege: "An error has ocurred" }

        }

        return res.json(data)
    },

    searchTopic: async (req, res) => {
        let data = {}

        let search = req.params.search

        try {

            let topics = await Topic.find({
                "$or": [
                    { title: { "$regex": search, "$options": "i" } },
                    { content: { "$regex": search, "$options": "i" } },
                    { code: { "$regex": search, "$options": "i" } },
                    { lang: { "$regex": search, "$options": "i" } }
                ]
            }).populate(["user", "comments.user"]).exec()

            if (topics) {
                data = { code: 200, topics: topics }
            } else {
                data = { code: 404, message: "There aren't results" }
            }

        } catch (error) {
            data = { code: 500, message: "An error has ocurred" }
        }

        return res.json(data)
    }
}

module.exports = controller