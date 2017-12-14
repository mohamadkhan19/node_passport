import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 60*60*24*7*54*20; //sec*min*day*week*year*20 
const SECRET = process.env.SECRET; //Secret message

let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
  req.token = req.token || {};
  req.token = jwt.sign ({
    id: req.user.id,
  }, SECRET, {
    expiresIn: TOKENTIME // 20 years
  });
  next();
}

let respond = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.username,
    token: req.token
  });
}

module.exports = {
  authenticate,
  generateAccessToken,
  respond
}
