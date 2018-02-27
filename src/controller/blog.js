import { Router } from 'express';
import bodyParser from 'body-parser';
import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';
import Blog from '../model/blog';

export default ({ config, db }) => {
  let api = Router();
  api.get('/', authenticate, (req, res) => {
    Blog.find({}, (err, blog) => {
      if (err) {
        return res.status(401).json({
                message: 'Not Authenticated',
                success: false,
                error: err
            });
      }
      res.json(blog);
    });
  });
  return api;
}