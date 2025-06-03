const db = require('../dataBase/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');//用于生成token
const jwtconfig = require('../jwt_config/index');
//登录操作
exports.login = (req, res) => {
  const loginInfo = req.body;
  //1、查看数据库是否有用户
  const sql_query_account = 'SELECT * FROM `users` WHERE account = ?';
  db.execute(sql_query_account, [loginInfo.account], (err, result) => {
    if (err) return res.send({
      status: -2001,
      message: "数据库连接存在问题"
    });
    if (result.length !== 1) {
      return res.send({
        status: -2002,
        message: "登录失败，用户不存在"
      });
    };
    //进行密码校验
    const compareResult = bcrypt.compareSync(loginInfo.password, result[0].password);
    if (!compareResult) {
      return res.send({
        status: -2003,
        message: "登录失败，密码错误"
      });
    } else {
      //状态判断，对冻结账号禁止登录
      if (result[0].status === 1) {
        return res.send({
          status: -2004,
          message: "登录失败，账户已经被冻结"
        });
      }
      //校验通过
      //剔除user部分数据
      const user = {
        ...result[0],
        password: '',
        create_time: '',
        update_time: ''
      }
      //设置token
      const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
        expiresIn: '7h'
      })
      //发送token
      res.send({
        result: user,
        status: 2001,
        message: "登录成功",
        token:'Bearer ' + tokenStr,
      })
    }
  });
}

//注册操作
exports.register = (req, res) => {
  const regInfo = req.body;
  //1、判断输入是否为空
  if (!regInfo.account || !regInfo.password) {
    return res.send({
      status: -1001,
      message: "账户或者密码不能为空！"
    });
  };
  //2、判断账户是否存在,如果不存在则创建用户
  const sql_query_account = 'SELECT * FROM `users` WHERE account = ?';
  db.execute(sql_query_account, [regInfo.account], (err, result) => {
    if (result.length > 0) {
      return res.send({
        status: -1002,
        message: "账户已经存在!"
      });
    };
    //3、加密密码
    regInfo.password = bcrypt.hashSync(regInfo.password, 10);
    //4、插入数据库
    const identity = "用户";
    const name = "新人用户";
    const status = 0;
    const sql_insert_account = 'INSERT INTO `users` (account,password,identity,status,name) VALUE (?,?,?,?,?)';
    db.execute(sql_insert_account, [regInfo.account, regInfo.password, identity, status,name], (err, results) => {
      if (results.affectedRows !== 1) {
        return res.send({
          status: -1003,
          message: "注册失败，请重试"
        })
      } else {
        return res.send({
          status: 1001,
          message: "成功注册"
        })
      }
    })
  });
}
  