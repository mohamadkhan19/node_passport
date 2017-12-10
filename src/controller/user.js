import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import User from '../model/user';
import UserDataExt from './extensions/userData-ext';

import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

  // '/v1/user/register'
  api.post('/register', (req, res) => {
    UserDataExt.findUserByEmail(req.body.email, (err, userData) => {
      if (err) {
        res.status(409).json({ 
          message: 'An error occured',
          success: false,
          error: err
        });
      } else if (userData) {
        res.status(300).json({ 
          message: `Email ${req.body.email} is already registered`,
          success: false
        });
      }
      // else {
        User.register(new User({ name: req.body.name, username: req.body.email }), req.body.password, function(err, user) {
          if(err) {
            res.status(500).json({ 
              error: err.message,
              success: false
            });
          }
          passport.authenticate('local', { session: false })(req, res, () => {
            res.status(201).json({
              message: 'User created',
              success: true,
              obj: user
            });
          });
        });
      // }
    });
  });

  // '/v1/user/login'
  api.post('/login', (req, res, next) => {
		UserDataExt.findUserByEmail(req.body.email, (err, userData) => {
      if (err) {
        res.status(409).json({ 
          message: 'An error occured',
          success: false,
          error: err
        });
      } else {
				next();
			}
    });
	}, passport.authenticate('local', { session: false, scope: [], failWithError: true }), (err, req, res, next) => {
		if (err) {
			res.status(401).json({ 
        message: `Email or password invalid, please check your credentials`,
        success: false,
        error: err
      });
		}
	}, generateAccessToken, respond);

  // '/v1/user/logout'
  api.get('/logout', authenticate, (req, res) => {
    res.logout();
    res.status(200).send('Successfully logged out');
  });

  api.get('/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
  });
  return api;
}
