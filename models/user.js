'use strict';
const mongoose = require('mongoose');

mongoose.connect('')
    .then(res => console.log('mongodb connected'))
    .catch(err => console.log('mongo error'));

let userSchema = new mongoose.Schema({
    first: String,
    last: String,
    username: String,
    password: String,
    salt: String,
    email: String,
    token: { type: String, default: '' },
    date: { type: Date, default: Date.now() }
});

let User = mongoose.model('User', userSchema);
module.exports = User;
