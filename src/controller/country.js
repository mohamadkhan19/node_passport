import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../middleware/authMiddleware';
import Country from '../model/country';

export default () => {
  let api = Router();
  api.get('/', authenticate, (req, res) => {
    Country.find({}, (err, result) => {
      if (err) {
        return res.status(401).json({
                message: 'Not Authenticated',
                success: false,
                error: err
            });
      }
      res.json(result);
    });
  });
  
  api.post('/', authenticate, (req,res) => {
    var country = new Country({
      name: req.body.name,
      imageUrl: req.body.imageUrl
    })
    country.save( (err,result) => {
      if (err) {
        return res.status(401).json({
                message: 'Not Authenticated',
                success: false,
                error: err
            });
      }
      res.json({
        "success": true,
        "obj": result
      })
    })
  })
  
  api.patch('/:id', (req, res) => {
    Country.findById(req.params.id, (err, result) => {
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

api.delete('/:id', (req, res) => {
    Country.findById(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!result) {
            return res.status(500).json({
                title: 'No result Found!'
            });
        }
        result.remove( (err, result) => {
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