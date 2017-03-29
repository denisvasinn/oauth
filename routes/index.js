'use strict';
const express = require('express');
const User = require('../controllers/user');
const router = express.Router();


router.get('/', User.index);

module.exports = router;