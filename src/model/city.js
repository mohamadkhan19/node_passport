import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const citySchema = new Schema({
    country: {type: String, required: true},
    city: {type: String, required: true},
    imageUrl: {type: String, required: true}
});

module.exports = mongoose.model('City', citySchema, 'cities');
