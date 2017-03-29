'use strict';
const crypto = require('crypto');
const User = require('../views/user');
const co = require('co');

module.exports = {
    createHash: (lenght) => {
        var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            str = '';
        for(let i = 0; i < lenght; i++){
            let index = Math.floor(Math.random() * (alphabet.length - 1));
            str += alphabet[index];
        }
        return str;
    },
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
            req.currentUser = user;
            return next();
        })
        .catch(err => res.status(401).end('Unauthorized'));
    },
    login: (req, res, next) => {
        co(function *(){
            try{
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
                
                return (req.cookies.sender)?
                    res.stetus(302).redirect('/openid'):
                    res.status(200).json(JSON.stringify({ success: true, user }));
            }
            catch(err){
                console.error(err);
                res.status(404).json(JSON.stringify({ success: false, err }));
            }
        }).catch(err => console.error(err));
    },
    logout: (req, res, next) => {
        if(req.session) req.session.destroy(err => console.log(err));
        res.status(200).json({ success: true });
    },
    register: (req, res, next) => {
        co(function *(){
            try{
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

                return res.status(200).json(JSON.stringify({ success: true, user }));
            }
            catch(err){
                console.error(err);
                res.status(404).json(JSON.stringify({ success: false, err }));
            }
        })
        .catch(err => console.error(err));
    },
    oauth: [
        (req, res, next) => {
            console.log('oauth 1');
            if(!req.body.authToken) return next();
            let authToken = req.body.authToken;
            User.findOne({ authToken })
            .then(user => res.status(200).json(user))
            .catch(err => console.error(err));
        },
        (req, res, next) => {
            console.log('oauth 2');
            let id, password, sender, authToken;
            ({ id, password } = req.session);
            if(!id || !password) return next();
            sender = res.cookies.sender;
            res.clearCookie('sender');
            authToken = this.createHash(30);
            User.update({ _id: id }, { $set: { authToken }})
            .then(user => {
                setTimeout(() => User.update({ _id: id }, { $set: { authToken: '' }}), config.expires);
                res.setHeader('Location',`https://${sender}/auth/login?authToken=${authToken}`);
                res.status(302).end();
            })
            .catch(err => console.error(err));
        },
        (req, res, next) => {
            console.log('oauth 3');
            res.cookie('sender', req.body.sender, { maxAge: config.expires });
            res.status(200).render('index.html');
        }
    ]
}