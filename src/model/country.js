import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import mongooseUniqueValidator from 'mongoose-unique-validator';


const countrySchema = new Schema({
    name: {type: String, required: true, unique: true},
    imageUrl: {type: String, required: true},
    cities_id: [{type: Schema.Types.ObjectId, ref: 'City_id'}]
});

countrySchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Country', countrySchema, 'countries');
