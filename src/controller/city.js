import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import City from '../model/city';
import Country from '../model/country'

export default () => {
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
  
  api.get('/:id', authenticate, (req, res) => {
    City.find({"country_id":req.params.id}, (err, city) => {
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
  
  api.post('/', function (req, res) {
    Country.findOne({"name":req.body.country}, function (err, country) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        var city = new City({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            country_id: country._id
        });
        city.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            country.cities_id.push(result);
            country.save();
            res.status(201).json({
                message: 'Saved!',
                success: 1,
                obj: result
            });
        });
    });
});
  
  api.patch('/:id', (req, res) => {
    City.findById(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!result) {
            return res.status(500).json({
                error: 'No result Found!'
            });
        }
        result.name = req.body.name;
        result.imageUrl = req.body.imageUrl;
        result.save( (err, result) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated!',
                obj: result
            });
        });
    });
});

api.delete('/:id',  (req, res) => {
    City.findById(req.params.id, (err, city) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!city) {
            return res.status(500).json({
                title: 'No city Found!'
            });
        }
        city.remove( (err, result) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted!',
                obj: result
            });
        });
    });
});

  return api;
}