import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  City_Id: [{type: Schema.Types.ObjectId, ref: 'City_id'}]
});


module.exports = mongoose.model('Blog', blogSchema, 'blogs');
