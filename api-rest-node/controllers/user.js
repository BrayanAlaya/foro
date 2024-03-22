'use strict'

let validator = require("validator")
let User = require("../models/user")
let bcrypt = require("bcryptjs");
let jwt = require("../services/jwt");
let fs = require("node:fs");
let path = require("node:path")
let authenticate = require("../middlewares/authenticated")

let controller = {

    save: async (req, res) => {

        let data = {};
        let params = await req.body;

        //Validation
        let nameValidator = !validator.isEmpty(params.name);
        let surnameValidator = !validator.isEmpty(params.surname);
        let emailValidator = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let passwordValidator = !validator.isEmpty(params.password);

        if (nameValidator && surnameValidator && emailValidator && passwordValidator) {

            let user = new User({
                name: params.name,
                surname: params.surname,
                email: params.email.toLowerCase(),
                role: params.role,
                image: params.image
            });

            let userFind = await User.findOne({ email: user.email }).exec();

            if (!userFind) {

                user.password = await bcrypt.hash(params.password, 8);

                let result = await user.save();

                data = { code: 200, date: result }

            } else {

                data = { code: 500, messege: "Ya hay un email con el mismo nombre" }

            }


        } else {
            data = { code: 404, messege: "Error en la validacion" }
        }

        return res.status(200).send(data)
    },

    login: async (req, res) => {
        let data = {}
        let params = req.body;

        let validateEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email)
        let validatePassword = !validator.isEmpty(params.password)

        if (validateEmail && validatePassword) {

            let user = await User.findOne({ email: params.email }).exec()

            if (user) {

                let result = bcrypt.compareSync(params.password, user.password)

                if (result) {
                    user.password = undefined;

                    let info = "asdads"

                    if (params.getToken) {
                        info = await jwt(user);
                    } else {
                        info = user;
                    }
                    //limpiar password

                    data = { code: 200, data: info }
                } else {
                    data = { code: 404, messege: "contrseña incorrecta" }
                }

            } else {

                data = { code: 500, messege: "El usuario no existe" }

            }
        }

        return res.send(data)
    },

    update: async (req, res) => {

        let params = req.body;
        let data = {};

        try {

            var validateName = !validator.isEmpty(params.name) && validator.isAlpha(params.name);
            var validateSurname = !validator.isEmpty(params.surname) && validator.isAlpha(params.surname);
            var validateImage = !validator.isEmpty(params.image);

        } catch (error) {
            data = { code: 500, messege: error };
        }

        if (validateName && validateSurname && validateImage) {

            let user = req.user;
            let userNew = await User.findOneAndUpdate({ _id: user.id }, params, { new: true });

            if (userNew) {
                data = { code: 200, user: userNew, token: await jwt(userNew) };
            } else {
                data = { code: 500, messege: "hubo un error" };
            }

        } else {
            data = { code: 404, messege: "no paso" };
        }

        return res.send(data);
    },

    uploadAvatar: async (req, res) => {

        let data = {};

        let fileOriginalName = req.file.originalname
        let fileDestination = req.file.destination + "/"
        let filename = req.file.filename;
        let fileExt = fileOriginalName.split(".")[1];

        if (fileExt == "jpg" || fileExt == "png" || fileExt == "jpeg") {

            fs.unlink(fileDestination + req.user.image, async (err) => {

                data = { code: 200, image: filename }

                return res.json(data)
            })

        } else {

            fs.unlink(req.file.path, (err) => {

                if (err) {
                    data = { code: 500, messege: "has been an error" }
                } else {
                    data = { code: 500, messege: "image eliminated" }
                }

                return res.json(data)

            })
        }
    },

    avatar: (req, res) => {

        let filename = req.params.filename
        let filePath = "uploads/users/" + filename

        let response = fs.existsSync(filePath);

        if (response) {

            return res.sendFile(path.resolve(filePath))

        } else {

            return res.json({ code: 500, messege: "No encontrado" })
        }

    },

    getUsers: async (req, res) => {

        var data = {}

        try {

            const users = await User.find();

            if (users == null || !users) {

                data = { code: 500, messege: "No se encontro al usuario" }

            } else {

                data = users

            }

        } catch (error) {

            data = { code: 500, messege: "No se encontro al usuario" }

        }

        return res.json(data);

    },

    getUser: async (req, res) => {
        var data = {}

        try {

            const user = await User.findById(req.params.id).exec();

            if (user == null) {

                data = { code: 500, messege: "No se encontro al usuario" }

            } else {

                data = user

            }

        } catch (error) {

            data = { code: 500, messege: "No se encontro al usuario" }

        }

        return res.json(data);

    }

};

module.exports = controller;
