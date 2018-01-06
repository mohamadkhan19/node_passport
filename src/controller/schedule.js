import { Router } from 'express';
import bodyParser from 'body-parser';
import config from '../config';
import GoogleMapsAPI from 'googlemaps';
import sleep from 'system-sleep';

var gmAPI;

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
        "name": "Treasure Island, San Francisco",
        "Latitude": 37.8201814,
        "Longitude": -122.3864967,
        "AverageTime": 1.00,
        "StartTime": 900,
        "EndTime": 2300}]

        //Algorithm

	var publicConfig = {
  		key: 'AIzaSyBGkSkVCbON1Cn7LMgsz2Fm-N3r6kHH5rY',
  		stagger_time:       1000, // for elevationPath
  		encode_polylines:   false,
  		secure:             true, // use https
	};
		

	var distance = [];
	for (var i = 0; i < cart.length; ++i) {
		distance[i] = [];
		for (var j = 0; j < cart.length; ++j)
			distance[i][j] = 0;
	}

	for (var i = 0; i < cart.length; i++) {
		for (var j = 0; j < cart.length; j++) {
      			var params = {
      		 		origins: cart[i]['name'],
      	    			destinations: cart[j]['name'],
      	    			mode: 'driving'
      			};
			var vi = i, vj = j;
			var gmAPI = new GoogleMapsAPI(publicConfig);
      			gmAPI.distance(params, function(err, result){
				distance[vi][vj] = result['rows'][0]['elements'][0]['duration']['value'];
      			});
			sleep(750);
	  	}
	}
		
	console.log(distance);
		
	// generate all permutations
	var best_perm = [], best_dist = -1;
	var fact = [];
	fact[0] = 1;
	for (var i = 1; i <= cart.length; i++) {
		fact[i] = fact[i-1] * i;			
	}
	for (var i = 0; i < fact[cart.length]; i++) {
		var perm = [];
		var val  = i;
		var taken = [];
		for (var j = 0; j < cart.length; j++) {
			var pos = ~~(val/fact[cart.length - j - 1]);
			val = val % fact[cart.length - j - 1];
			var digit = 0;
			for (var k = 0; k < cart.length; k++)
				if (!taken[k]) {
					if (pos == 0){
						taken[k] = 1;
						digit = k;						
					}
					pos--;
				}
			perm[j] = digit;
		}

		// Compute distance cost
		var total_dist = 0;
		for (var j = 0; j < cart.length - 1; j++){
			total_dist += distance[perm[j]][perm[j+1]];			
		}
		if (best_dist == -1 || total_dist <= best_dist) {
			best_dist = total_dist;
			best_perm = perm;			
		}
	}
	var final_cart = [];
	for (var i = 0; i < cart.length; i++)
		final_cart[i] = cart[best_perm[i]];
        res.send(final_cart);
  });

  return api;
}
