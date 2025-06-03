const express = require("express");
const loginController = require("../routerController/login");
const expressJoi = require('@escook/express-joi')
//限制规则
const { login_limit } = require('../limit/login')

const router = express.Router();
router.post("/login", expressJoi(login_limit), loginController.login);
router.post("/register", expressJoi(login_limit), loginController.register);

module.exports = router;