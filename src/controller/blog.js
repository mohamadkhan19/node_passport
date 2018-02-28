import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import Blog from '../model/blog';
import City from '../model/city';
import Country from '../model/country';

export default () => {
  let api = Router();
  api.get('/', authenticate, (req, res) => {
    Blog.find({}, (err, blog) => {
      if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
      res.json(blog);
    });
  });
  
  api.get('/:id', authenticate, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
      if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
      res.json(blog);
    });
  });
  
  api.get('/city/:city_id', authenticate, (req, res) => {
    Blog.find({"City_Id": req.params.city_id}, (err, blog) => {
      if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
      City.findById(req.params.city_id, (err,city) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        Country.findById(city.country_id, (err,country) => {
          if (err) {
              return res.status(500).json({
                  title: 'An error occurred',
                  error: err
              });
          }
          res.json({
            "blog": blog,
            "city": city.name,
            "country": country.name
          });
        })
      })
    });
  });
  return api;
}