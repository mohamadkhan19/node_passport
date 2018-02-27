import { Router } from 'express';
import bodyParser from 'body-parser';
import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';
import City from '../model/city';

export default ({ config, db }) => {
  let api = Router();
  api.get('/', authenticate, (req, res) => {
    City.find({}, (err, city) => {
      if (err) {
        return res.status(401).json({
                message: 'Not Authenticated',
                success: false,
                error: err
            });
      }
      res.json(city);
    });
  });
  
  api.post('/', authenticate, (req,res) => {
    var city = new City({
      city: req.body.city,
      country: req.body.country,
      imageUrl: req.body.imageUrl
    })
    city.save( (err,city) => {
      if (err) {
        return res.status(401).json({
                message: 'Not Authenticated',
                success: false,
                error: err
            });
      }
      res.json({
        "success": true,
        "obj": city
      })
    })
  })

  return api;
}