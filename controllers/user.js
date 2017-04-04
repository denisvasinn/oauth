'use strict';
const crypto = require('crypto');
const User = require('../views/user');
const co = require('co');
const cookieParser = require('cookie-parser');
const config = require('../config');

var createHash = (lenght) => {
    var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        str = '';
    for(let i = 0; i < lenght; i++){
        let index = Math.floor(Math.random() * (alphabet.length - 1));
        str += alphabet[index];
    }
    return str;
}
module.exports = {
    index: (req, res, next) => {
        res.status(200).render('index.html');
    },
    check: (req, res, next) => {
        User.find({ username: req.body.username })
        .then(users => (users.length)? res.status(200).json({ free: false }): res.status(200).json({ free: true }))
        .catch(err => res.status(500).json({ free: false, err }));
    },
    protected: (req, res, next) => {
        if(!req.session._id) res.status(401).end('Unauthorized');
        User.findOne({ _id: req.session._id })
        .then(user => {
            if(user){
                req.currentUser = user;
                return next();
            } else next(new Error('User is undefined'));
            
        })
        .catch(err => res.status(401).end('Unauthorized'));
    },
    login: (req, res, next) => {
        co(function *(){
            let username, password, salt, user;
            ({ username, password } = req.body);
            if(!username.match(/[\w\d\_\-.]{3,}/i)) throw new Error(`Username not match.`);
            if(!password.match(/.{5,}/i)) throw new Error(`Password not match.`);

            user = yield User.findOne({ username });
            if(!user) throw new Error(`wrong username: ${username}`);
            salt = user.salt;
            password = crypto.createHash('sha1').update(password + salt).digest('hex');
            if (password !== user.password) throw new Error(`wrong password: ${password}`);

            req.session._id = user._id.toString();

            return res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        first: user.first,
                        last: user.last,
                        email: user.email
                    } 
                });
        }).catch(err => {
            console.error('catch err: ' + err);
            res.status(200).json(JSON.stringify({ success: false, err }));
        });
    },
    logout: (req, res, next) => {
        if(req.session) req.session.destroy(err => {
            if(err) next(err);
            else {
                res.clearCookie('id');
                res.clearCookie('sender');
                res.status(200).json({ success: true });
            }
        });
    },
    register: (req, res, next) => {
        co(function *(){
            let first, last, username, password, confirm, email, salt, user;
            ({ first, last, username, password, confirm, email } = req.body);
            if(!first.match(/[\wа-яё]{2,}/i)) throw new Error(`First name is not match.`);
            if(!last.match(/[\wа-яё]{2,}/i)) throw new Error(`Last name is not match.`);
            if(!username.match(/[a-zA-Z0-9\_\-.]{3,}/i)) throw new Error(`Username is not match.`);
            if(!password.match(/.{5,}/i)) throw new Error(`Password is not match.`);
            if(password !== confirm) throw new Error(`Password is not match.`);
            if(!email.match(/[\w\d\-\_\.]+@[\w]+\.([\w]+(\.?)){1,}/)) throw new Error(`Password is not match.`);


            salt = crypto.createHash('sha1').update(username + Date.now()).digest('hex');
            password = crypto.createHash('sha1').update(password + salt).digest('hex');
            user = yield User.create({ first, last, username, password, salt, email });

            req.session._id = user._id.toString();

            return res.status(200).json(JSON.stringify({
                success: true,
                user: {
                    _id: user._id,
                    first: user.first,
                    last: user.last,
                    email: user.email
                }
            }));
        })
        .catch(err => {
            console.error(err);
            res.status(404).json(JSON.stringify({ success: false, err }));
        });
    },
    oauth: [(req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }, (req, res, next) => {
        if(!req.query.token) return next();
        console.log('GET /oauth1');
        let token = req.query.token;
        User.findOne({ token })
        .then(user => {
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    first: user.first,
                    last: user.last,
                    email: user.email
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(404).end(JSON.stringify(err));
        });
    }, (req, res, next) => {
        let _id, sender, token;
        _id = req.session._id;
        sender = req.cookies.sender || req.query.sender;
        if(!(_id && sender)) return next();
        console.log('GET /oauth2');
        token = createHash(30);
        User.update({ _id }, { $set: { token }})
        .then(() => {
            setTimeout(() => {
                    User.update({ _id }, { $set: { token: '' }})
                    .then(() => console.log('token deleted'))
                }, config.expires
            );
            res.location(`https://${sender}/auth/login?token=${token}`).status(302).end();
        })
        .catch(err => {
            console.error(err);
            res.status(404).end(JSON.stringify(err));
        });
    }, (req, res, next) => {
        console.log('GET /oauth3')
        res.cookie('sender', req.query.sender, {maxAge: config.expires});
        res.status(302).redirect('/');
    }]
}