const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRouter = require('./router/login');
const userInfoRouter = require('./router/userInfo');
const jwtconfig = require('./jwt_config/index');
const { expressjwt: jwt } = require('express-jwt');
const Joi = require('joi');
const multer = require('multer');

// 创建app对象
const app = express();

// 挂载中间件
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // 解析客户端传递过来的json
//静态加载
app.use(express.static('./public'));
//登录信息
app.use('/api', loginRouter);
app.use(jwt({
  secret: jwtconfig.jwtSecretKey,
  algorithms: ['HS256']
}).unless({
  path: [/^\/api\//, '/user/userInfoAvatar' ]
}));
//joi错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.send({
      status: -1004,
      message: "输入格式有误"
    })
  }
})
//错误处理的中间件
app.use((err, req, res, next) => {
  res.ce = (err, status = 1)=>{
    res.send({
      status,
      message: err instanceof Error? err.message: err
    })
  }
  next()
})
//上传文件
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './public/image')
    },
    filename(req, file, callback) {
      callback(null, Date.now() + '_' + file.originalname)
    }
  })
});
app.use(upload.any());
//用户信息
app.use('/user', userInfoRouter);

// 启动服务器
app.listen(4000, () => {
  console.log('express服务器启动成功~')
});
