import { Router } from 'express';
import bodyParser from 'body-parser';
import config from '../config';
import GoogleMapsAPI from 'googlemaps';
import sleep from 'system-sleep';

import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

var gmAPI;
var rand = require('random-seed');

export default ({ config, db }) => {
  let api = Router();

  // v1/schedule
  api.post('/', authenticate , (req, res) => {
    let cart= [];
    //cart = req.body.cart;
     cart = [{
         "name": "Baker Beach",
         "Latitude": 37.791032,
         "Longitude": -122.5096298,
         "AverageTime": 120,
         "StartTime": 10,
         "EndTime": 17},
       {
         "name": "Lombard Street",
         "Latitude": 37.7918949,
         "Longitude": -122.4623753,
         "AverageTime": 120,
         "StartTime": 8,
         "EndTime": 17},
       {
         "name": "Treasure Island, San Francisco",
         "Latitude": 37.8201814,
         "Longitude": -122.3864967,
         "AverageTime": 120,
         "StartTime": 9,
         "EndTime": 23}]
   var hotel = req.body.hotel;

        //Algorithm

	var publicConfig = {
  		key: 'AIzaSyBGkSkVCbON1Cn7LMgsz2Fm-N3r6kHH5rY',
  		stagger_time:       1000, // for elevationPath
  		encode_polylines:   false,
  		secure:             true, // use https
	};
		
	// Initialize distance to 0.
	var distance = [];
	for (var i = 0; i < cart.length; ++i) {
		distance[i] = [];
		for (var j = 0; j < cart.length; ++j)
			distance[i][j] = 0;
	}

    //	Getting the distance between every pair of locations through map api.
    //  Stored into the distance 2D array. 
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
			sleep(500);
	  	}
	}
	var hotel_to_location = [];
	var location_to_hotel = [];
	for (var i = 0; i < cart.length; i++) {
		var params = {
      		origins: hotel,
      	    destinations: cart[i]['name'],
      	    mode: 'driving'
      	};
		var vi = i;
		var gmAPI = new GoogleMapsAPI(publicConfig);
      		gmAPI.distance(params, function(err, result){
			hotel_to_location[vi] = result['rows'][0]['elements'][0]['duration']['value'];
      		});
		sleep(750);

		var params = {
      		origins: cart[i]['name'],
      	    destinations:  hotel,
      	    mode: 'driving'
      	};
		var vi = i;
		var gmAPI = new GoogleMapsAPI(publicConfig);
      		gmAPI.distance(params, function(err, result){
			location_to_hotel[vi] = result['rows'][0]['elements'][0]['duration']['value'];
      		});
		sleep(750);
	}
		
	console.log(distance);
	console.log(location_to_hotel);
	console.log(hotel_to_location);
		
	// generate all permutations
	var best_perm = [], best_dist = -1;
	// Initialize factorial arrary. fact[i] = i!.
	var fact = [];
	fact[0] = 1;
	for (var i = 1; i <= cart.length; i++) {
		fact[i] = fact[i-1] * i;			
	}
	// enumerate from 1 to (cart.legnth!) to genereate permutations.
	/*for (var i = 0; i < fact[cart.length]; i++) {
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
		}*/
	// instead of enumerate all permutations, we generate several random permutations.
	var total_perm = 100000;
	var seed = 'my secret string value';
	var rand = gen.create(seed);
	for (var i = 0; i< total_perm; i++) {
		for (var j = 0; j < cart.length; j++) {
			perm[j] = j;
		}
		for (var j = 0; j < cart.length * cart.length; j++) {
			var a = gen.intBetween(0, cart.length - 1);
			var b = gen.intBetween(0, cart.length - 1);
			var tmp = perm[a];
			perm[a] = perm[b];
			perm[b] = tmp;
		}
		// Compute distance cost

		var total_dist = 0;
		var current_time = 8*60;
		var is_valid = true;
		// loop through each locations in the order of visit;
		for (var j = 0; j < cart.length - 1; j++){
			total_dist += distance[perm[j]][perm[j+1]];
			console.log(current_time);
			current_time += ~~(distance[perm[j]][perm[j+1]]/60);
			if (current_time < cart[perm[j]]['StartTime']*60) is_valid = false;
			current_time += cart[perm[j]]['AverageTime'];
			if (current_time > cart[perm[j]]['EndTime']*60) is_valid = false;
		}
		if (current_time < cart[perm[cart.length - 1]]['StartTime']*60) is_valid = false;
		current_time += cart[perm[j]]['AverageTime'];
		if (current_time > cart[perm[cart.length - 1]]['EndTime']*60) is_valid = false;

		total_dist += hotel_to_location[perm[0]];
		total_dist += location_to_hotel[perm[perm.length - 1]];

		console.log(is_valid);
		console.log(perm);
		console.log(total_dist);
		if (is_valid && (best_dist == -1 || total_dist <= best_dist)) {
			best_dist = total_dist;
			best_perm = perm;			
		}
	}
	console.log("!!!!!!");
	console.log(best_perm);
	console.log(best_dist);
	if (best_dist == -1) {
		res.send(cart);
		return api;
	}
	var final_cart = [];
	for (var i = 0; i < cart.length; i++)
		final_cart[i] = cart[best_perm[i]];
        res.send(final_cart);
  });

  return api;
}
