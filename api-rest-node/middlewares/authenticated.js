"Use strict"

let jwtAuth = require("jsonwebtoken");
const secret = "mi-password-super-secreta-4848465";

exports.authenticated = (req, res, next) => {

    let data = {}
    let token = req.headers.authorization;

    try {
        var decode = jwtAuth.verify(token, secret)

        if (decode) {
         
            req.user = decode;

            next();
        }
    } catch (error) {

        return res.send( {code: 500, message: error})
    }


}

