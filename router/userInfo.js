const express = require("express");
const userInfoController = require("../routerController/userInfo");
// const expressJoi = require('@escook/express-joi')
//限制规则
// const { login_limit } = require('../limit/login')
const router = express.Router();
//文件上传
//图片上传
router.post("/userInfoAvatar",userInfoController.uploadAvatar);
//图片和用户绑定
router.post("/bindAccount", userInfoController.bindAccount);
//用户信息的获取
router.post("/getUserInfo", userInfoController.getUserInfo);
//修改用户信息
router.post("/changeUserInfo", userInfoController.changeUserInfo);



module.exports = router;