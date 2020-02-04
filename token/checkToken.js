const jwt = require('jsonwebtoken');

const salt = 'userTest'

//检查token是否过期
module.exports =  ( req, res, next ) => {
  //拿到token
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      err_code: 3,
      message: '没有找到token,请先登录'
    })
  }
  const token = authorization.split(' ')[1];
  let tokenContent;
  try {
    tokenContent = jwt.verify(token, 'testUser');//如果token过期或验证失败，将抛出错误
  } catch (err) {
    return res.status(401).json({
      err_code: 4,
      message: 'token过期或失效'
    })
  }
  next()
};