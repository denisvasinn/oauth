const User = require('../models/user');

module.exports = {
    findOne(path){
        return User.findOne(path);
    },
    find(path){
        return User.find(path);
    },
    update(path, changes){
        return User.update(path, changes);
    },
    create(attr){
        return new User(attr).save();
    },
    delete(path){
        return User.deleteOne(path);
    }
}