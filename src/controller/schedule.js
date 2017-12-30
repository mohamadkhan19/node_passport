import { Router } from 'express';
import bodyParser from 'body-parser';
import config from '../config';

export default ({ config, db }) => {
  let api = Router();

  // v1/schedule
  api.get('/', (req, res) => {
    let cart= [];
    cart = [{
        "name": "Baker Beach",
        "Latitude": 37.791032,
        "Longitude": -122.5096298,
        "AverageTime": 4.00,
        "StartTime": 1500,
        "EndTime": 1700},
      {
        "name": "Lombard Street",
        "Latitude": 37.7918949,
        "Longitude": -122.4623753,
        "AverageTime": 1.00,
        "StartTime": 900,
        "EndTime": 1700},
      {
        "name": "Treasure Island",
        "Latitude": 37.8201814,
        "Longitude": -122.3864967,
        "AverageTime": 1.00,
        "StartTime": 900,
        "EndTime": 2300}]

        //Algorithm

        res.send(cart);
      
    
  });

  return api;
}
