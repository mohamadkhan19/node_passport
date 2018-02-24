import { Router } from 'express';
import bodyParser from 'body-parser';
import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

import yelp from 'yelp-fusion';

const client = yelp.client(process.env.YELP_API);

export default ({ config, db }) => {
  let api = Router();
  api.post('/', authenticate ,(req,res) => {
    client.search({
      term: req.body.term,
      location: req.body.location
    }).then(response => {
      console.log(response.jsonBody.businesses[0].name);
      res.json(response.jsonBody)
    }).catch(e => {
      res.json(response.jsonBody)
    });
    
  })
  return api;
}