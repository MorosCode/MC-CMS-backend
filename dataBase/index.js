const mysql = require('mysql2');

//连接数据库
const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  //本地数据库信息
  password: "",
  database: ""
});
//2、获取连接是否成功
db.getConnection((err, connection) => {
  if (err) {
    console.log("连接失败");
    return;
  }

  connection.connect(err => {
    if (err) {
      console.log('和数据库交互失败');
    } else {
      console.log('数据库连接成功，可进行交互');
    }
  })
})

module.exports = db;

