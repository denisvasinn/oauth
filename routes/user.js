const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.route('/:id')
.get(User.protected, (req, res, next) => res.status(200).json(JSON.stringify({user: {
    _id: user._id,
    first: user.first,
    last: user.last,
    email: user.email
}})))
.put(User.protected, (req, res, next) => res.status(200).end('PUT user'))
.delete(User.protected, (req, res, next) => res.status(200).end('DELETE user'));

module.exports = router;