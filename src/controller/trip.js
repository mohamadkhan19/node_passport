import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import Trip from '../model/trip';
import User from '../model/user';
import UserDataExt from './extensions/userData-ext';

import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

  // '/v1/foodtruck' - GET all food trucks
  api.get('/', authenticate, (req, res) => {
    Trip.find({}, (err, trip) => {
      if (err) {
        return res.status(401).json({
                message: 'Not Authenticated',
                success: false,
                error: err
            });
      }
      res.json(trip);
    });
  });

  api.post('/add', authenticate, (req, res) => {
    let newTrip = new Trip({
            country: req.body.country,
            city: req.body.city,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            count: req.body.count,
            cart: req.body.cart
        });

    newTrip.save(function(err, trip) {
      if (err) {
        res.send(err);
      }
      res.status(201).json({
                message: 'trip details saved successfully',
                success: true,
                obj: trip
            });
    });
  });

  return api;
}
