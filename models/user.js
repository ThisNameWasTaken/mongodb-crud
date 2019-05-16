const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    password: String,
    plate: String,
    phone: String,
    notificationId: String
}, { collection: 'users' });

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', userSchema);

module.exports = User;