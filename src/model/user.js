import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema, 'users');
