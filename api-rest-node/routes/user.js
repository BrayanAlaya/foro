"use strict";

var express = require('express'); 
var userController = require("../controllers/user");

var router = express.Router();
var multer = require("multer");
const upload = multer({dest: "uploads/users"})

var md_authToken = require("../middlewares/authenticated")

router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.post('/register', userController.save);
router.post('/login', userController.login);
router.put('/update', md_authToken.authenticated, userController.update);
router.post('/upload-avatar', [md_authToken.authenticated, upload.single("file0")], userController.uploadAvatar);
router.get('/avatar/:filename', userController.avatar)

module.exports = router;
