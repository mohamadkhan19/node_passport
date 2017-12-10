import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tripSchema = new Schema({
	email: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    startdate: {type: Date, required: true},
    enddate: {type: Date, required: true},
    count: {type: String, required: true},
    cart: {type: Array, required: true}
});


module.exports = mongoose.model('Trip', tripSchema, 'trips');
