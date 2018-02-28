import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initalizeDb from '../db';
import user from '../controller/user';
import trip from '../controller/trip';
import schedule from '../controller/schedule';
import yelp from '../controller/yelp';
import blog from '../controller/blog';
import city from '../controller/city';
import country from '../controller/country';

let router = express();


//connect to db
initalizeDb(db => {

  //internal middleware
  router.use(middleware({ config, db }));
  router.use('/user', user({ config, db }));
  router.use('/trip', trip({ config, db }));
  router.use('/schedule', schedule({ config, db }));
  router.use('/yelp', yelp({ config, db }));
  router.use('/blog', blog());
  router.use('/city', city());
  router.use('/country', country());
  
});

export default router;
