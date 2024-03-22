"use strict"

const jwt = require("jsonwebtoken")

const secret = "mi-password-super-secreta-4848465";

module.exports = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image
    }

    return jwt.sign(payload,secret,{expiresIn: "12h"})

}
