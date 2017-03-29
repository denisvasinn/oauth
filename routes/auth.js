'use strict';
const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.post('*', (req, res, next) => {
    console.log(req.body);
    return next();
});

router.post('/check', User.check);

router.post('/login', User.login);

router.post('/logout', User.protected, User.logout);

router.post('/register', User.register);

router.get('/oauth', User.oauth);

module.exports = router;
