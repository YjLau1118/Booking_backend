import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if(!token){
    return res.status(401).json({
      status: 'Error',
      message: 'Unauthorized'
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: 'Error',
        message: 'Token is not valid'
      });
    }
    req.user = user;
    console.log(req.user)
    next()
  })
}
