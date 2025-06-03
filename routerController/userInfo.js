const db = require('../dataBase/index');
const config = require('../config/config')
const crypto = require('crypto')

exports.uploadAvatar = (req, res) => {
  //生成唯一ID
  const onlyId = crypto.randomUUID();
  // 上传数据库
  const sql_insert_userInfo = 'INSERT INTO image (image_url, onlyId) VALUES (?,?)'
  const insertValue = config.IMAGEURL + `/image/${req.files[0].filename}`;
  db.execute(sql_insert_userInfo, [insertValue, onlyId], (err, result) => {
    if (err) return res.ce(err);
    res.send({
      status: 2002,
      message: "图片上传成功",
      onlyId: onlyId,
      image_url: insertValue
    })
  })
}

//绑定账号
exports.bindAccount = (req, res) => {
  const { account, onlyId, image_url } = req.body;
  const sql_update_image = 'UPDATE image SET account = ? WHERE onlyId = ?'
  const sql_update_users = 'UPDATE users SET image_url = ? WHERE account = ?'
  db.execute(sql_update_image, [account, onlyId], (err, result) => {
    if (err) return res.ce(err);
    if (result.affectedRows === 1) {
      db.execute(sql_update_users, [image_url, account], (err, result) => {
        if (err) return res.ce(err);
        if (result.affectedRows === 1) {
          res.send({
            status: 2003,
            message: "绑定成功",
            onlyId: onlyId
          })
        }
      })
    }
  })
} 

//获取用户信息，基于Id查询
exports.getUserInfo = (req, res) => {
  const { id } = req.body;
  const sql_query_userInfo = 'SELECT * FROM users WHERE id = ?'
  db.execute(sql_query_userInfo, [id], (err, result) => {
    //敏感数据处理
    const userInfo = {
      ...result[0],
      password: "",
      create_time: "",
      update_time: "",
    };
    if (err) return res.ce(err);
    res.send(userInfo)
  })
}

//修改用户信息
exports.changeUserInfo = (req, res) => {
  const { id, name, sex, email } = req.body;
  const sql_change_userInfo = 'UPDATE users SET name = ?, sex = ?, email = ? WHERE id = ?'
  db.execute(sql_change_userInfo, [name, sex, email, id], (err, result) => {
    if (err) return res.ce(err);
    res.send({
      status: 2004,
      message: "修改成功",
    }); 
  })
}  
 