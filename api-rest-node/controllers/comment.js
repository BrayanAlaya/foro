"use strict"

let Topic = require("../models/topic")
let validate = require("validator")

let controller = {

    save: async (req, res) => {

        let data = {}
        let topicId = req.params.id
        let content = req.body.content
        let user = req.user

        try {

            let topic = await Topic.findById(topicId).exec()

            if (topic) {
                if (!validate.isEmpty(content)) {
                    let values = {
                        content: content,
                        user: user.id
                    }

                    topic.comments.push(values);
                    topic.save();

                    data = { code: 200, topic: topic }

                } else {
                    data = { code: 404, message: "Validation Error" }
                }
            } else {
                data = { code: 404, message: "Topic dosen't exists" }
            }

        } catch (error) {
            data = { code: 500, message: "An error has ocurred" }
        }

        return res.json(data)
    },

    updateComment: async (req, res) => {

        let data = {}
        let params = req.body
        let commentId = req.params.id

        try {

            if (!validate.isEmpty(params.content)) {

                let comment = await Topic.findOneAndUpdate(
                    { "comments._id": commentId },
                    {
                        "$set": {
                            "comments.$.content": params.content
                        }
                    },
                    { new: true }
                );

                if (comment) {
                    data = { code: 200, topic: comment }
                } else {
                    data = { code: 404, message: "Comment not found" }
                }

            } else {
                data = { code: 404, message: "Error Validation" }
            }
        }
        catch (error) {
            data = { code: 500, message: "An error has ocurred" }
        }

        return res.json(data)
    },

    deleteComment: async (req, res) => {

        let data = {}
        let topicId = req.params.topicId
        let commentId = req.params.commentId

        try {

            let topic = await Topic.findOne({ _id: topicId })

            if (topic) {

                let comment = topic.comments.id(commentId)

                if (comment) {

                    topic.comments.pull({_id:comment._id})

                    await topic.save()

                    data = { code: 200, item: topic}
                } else{
                    data = { code: 404, message: "Comment doesn't found" }
                }
            } else {
                data = { code: 404, message: "Topic doesn't found" }
            }

        } catch (error) {
            data = { code: 500, message: "An error has ocurred" }
        }

        return res.json(data)
    }

}

module.exports = controller
