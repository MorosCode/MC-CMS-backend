const joi = require('joi')

//对输入的合法性进行验证
//对账号的验证
const account = joi.string().alphanum().min(6).max(12).required();
//对密码的验证
const password = joi.string().pattern(/^(?=.*\d)(?=.*[a-zA-Z]).*$/).min(6).max(12).required();

module.exports.login_limit = {
  body: {
    account,
    password
  }
}