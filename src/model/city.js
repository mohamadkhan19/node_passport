import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Country from './country';

const citySchema = new Schema({
    name: {type: String, required: true},
    imageUrl: {type: String, required: true},
    country_id: {type: Schema.Types.ObjectId, ref: 'Country_id'}
});

citySchema.post('remove', function (data) {
  console.log("data"+data)
    Country.findById(data.country_id, function (err, result) {
      console.log("result"+result)
        result.cities_id.pull(data);
        result.save();
    });
});

module.exports = mongoose.model('City', citySchema, 'cities');
