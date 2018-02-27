import AWS from 'aws-sdk';
import busboyBodyParser from 'busboy-body-parser';
import { Router } from 'express';
import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

var s3 = new AWS.S3();

var s3Bucket = new AWS.S3( { params: {Bucket: 'te-io-pics'} } )

export default ({ config, db }) => {
  let api = Router();
  api.use(busboyBodyParser({ limit: '10mb' })); 

  // '/v1/foodtruck' - GET all food trucks
  api.get('/', (req, res) => {
    var urlParams = {Bucket: 'te-io-pics', Key: 'mypic.jpg'};
	s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
		if (err) 
	    { 
	    	return res.status(401).json({
                success: false,
                error: err
            }); 
	    }else{
	  console.log('the url of the image is', url);
	  res.json(url);
	}
	})
  });

  api.post('/upload', (req, res) => {
  	console.log("req"+req)
    var data = {Key: req.files.file.name, Body: req.files.file};
    console.log("data"+data)
	s3Bucket.putObject(data, function(err, data){
	  if (err) 
	    { 
	    	return res.status(401).json({
                success: false,
                error: err
            }); 
	    } else {
	      console.log('succesfully uploaded the image!');
	      res.json(data);
	    }
	});
  });

  return api;
}
