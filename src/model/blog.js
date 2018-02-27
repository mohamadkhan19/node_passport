import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const blogSchema = new Schema({
});


module.exports = mongoose.model('Blog', blogSchema, 'blogs');
