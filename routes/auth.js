'use strict';
const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.all('*', (req, res, next) => {
    return next();
});

router.post('/check', User.check);
router.post('/login', User.login);
router.all('/logout', User.logout);
router.post('/register', User.register);
router.get('/oauth', User.oauth);

module.exports = router;
